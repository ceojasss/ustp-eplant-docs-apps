import React, { useRef, useState, useEffect } from "react"
import { useDispatch, connect } from 'react-redux'
import { Form as FormUI, Segment } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, resetTransaction } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroup from "../../../templates/forms/ComponentAdaptersGroup";
import { getFormComponent, InitValidation, useYupValidationResolver } from "../../../../utils/FormComponentsHelpler";
import { NEWS, STATUS_SAVED, STATUS_UPDATED } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_TRANSACTION_STATUS, UPDATE } from "../../../../redux/actions/types";


const Form = ({ title, actions, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()


    const formRefs = useRef();
    const postAction = loc.pathname.split('/').pop()


    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation

    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidation(postAction);

        return () => {
            dispatch(resetLov())
        };

    }, [navigate])

    useEffect(() => {
        if (resetTrx & !_.isUndefined(submitdata)) {
            methods.reset(submitdata)
        }
        return () => {
            resetTransaction(false)
        }
    }, [resetTrx])


    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    const { setValue, getValues } = methods
    const onItemClickHandler = (lovroute, value) => dispatch(ShowLov(lovroute, value, (_.isNil(getValues(value)) ? '' : getValues(value))))

    const submitHandler = () => formRefs.current(
        (rowid, data, object) => {
            /*
              * 1. Set post Data. 
              *    Jika action UPDATE maka data ditambahkan rowid,
              * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
             */
            let postObject = (actionlabel === NEWS ? object : { ROWIDS: rowid, ...object })
            dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, rowid, data))
        }
    )

    const Buttons = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }


    if (actions) {

        let data = []
        data.push(postdata)

        const submiting = { formComps, data }

        switch (actions) {

            case Appresources.BUTTON_LABEL.LABEL_SAVE:
                dispatch(createData(submiting))
                /*                 dispatch(createData(submiting, (v) => {
                                    if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                                        dispatch({ type: SET_TRANSACTION_STATUS, payload: STATUS_SAVED })
                                    }
                                }))
                 */
                break;
            case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                dispatch(updateData(submiting, (v) => {
                    console.log('status', v)
                    if (v === Appresources.TRANSACTION_ALERT.UPDATE_SUCCESS) {
                        dispatch({ type: SET_TRANSACTION_STATUS, payload: STATUS_UPDATED })
                    }
                }))
                break;
            default:
                break;

        }
    }

    const RenderForm = React.memo(() => {
        if (!formComps)
            return <LoadingStatus />

        return (
            <Segment raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px" }}>
                <FormUI as={'form'}>
                    <FormProvider {...methods} >
                        <ComponentAdaptersGroup
                            key="0.componentgroup"
                            OnClickRef={formRefs}
                            {...methods}
                            components={_.groupBy(formComps, 'grouprowsseq')}
                            itemClickHandler={onItemClickHandler}
                            postAction={postAction}
                        />
                    </FormProvider>
                </FormUI>
            </Segment>
        )
    })

    return (
        <ContentHeader
            title={title}
            btn1={Buttons}
            children={<RenderForm />} />
    );

}

const mapStateToProps = (state) => {

    // console.log(state)
    return {
        actions: state.auth.modals.actionpick,
        formComps: getFormComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        resetTrx: state.auth.resetTrx,
        actionlabel: state.auth.actionlabel,
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)

