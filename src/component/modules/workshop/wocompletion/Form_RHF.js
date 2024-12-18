import React, { useRef, useState, useEffect } from "react"
import { useDispatch, connect } from 'react-redux'
import { toast } from 'react-toastify';
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
import { updateData, createData, fetchDataGenerate } from "./FormAction";
import '../../../Public/CSS/App.css'
import { GENERATE_DATA, SAVE,SET_VALIDATION_SCHEMA, SET_TRANSACTION_STATUS, UPDATE } from "../../../../redux/actions/types";
import { useHotkeys } from "react-hotkeys-hook";
import { useKey } from "../../../../utils/ShortcutKeyHelper";

import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";
import store from "../../../../redux/reducers";
// import { useKey } from "../../../../utils/ShortcutKeyHelper";

const Form = ({ title, actions, formComps, initialValues, postdata, formValidationSchema,executegenerate, submitdata, actionlabel, resetTrx }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()


    const formRefs = useRef();
    const postAction = loc.pathname.split('/').pop()
    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    const { setValue, getValues } = methods
    const onItemClickHandler = (lovroute, value) => dispatch(ShowLov(lovroute, value, (_.isNil(getValues(value)) ? '' : getValues(value))))
    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation

    const generateData = async (cb) => {

        const key_doc = methods.control._formValues.workorderno


        //   if (_.isEmpty(key_doc)) {

        //  toast.warning("Request Code Is Required")


        //  return;
        //   }

        //   console.log(methods.getValues('requestno'))

        if (!_.isEmpty(key_doc.workorderno) && _.size(methods.control._formValues.inputgrid) === 0) {

            // await dispatch(DialogLoading())



            await dispatch(fetchDataGenerate(key_doc.workorderno, () => {
                // dispatch(submitlinkdata(linkData))
            }))



            if (cb) cb()

        }
    }
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

        console.log('run generate', executegenerate)

        if (executegenerate) {
            generateData(() => {
                dispatch({
                    type: GENERATE_DATA, payload: false
                })
            })
        }

        return () => {
            dispatch({
                type: GENERATE_DATA, payload: false
            })
        }
    }, [executegenerate])
    useEffect(() => {
        //console.log('reset transaction', resetTrx, submitdata)
        if (resetTrx & !_.isUndefined(submitdata)) {
            methods.reset(submitdata)
        }
        return () => {
            resetTransaction(false)
        }
    }, [resetTrx])



    const submitHandler = () => formRefs.current(
        (rowid, data, object) => {
            /*
              * 1. Set post Data. 
              *    Jika action UPDATE maka data ditambahkan rowid,
              * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
             */

            //   console.log(rowid, data, object)

            let postObject = (actionlabel === NEWS ? object : { ROWIDS: rowid, ...object })


            dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, rowid, data))
        }
    )


    useKey('save', () => {
        console.log('click')
        submitHandler()
    })



    const Buttons = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }


    useEffect(() => {
        if (actions) {

            let data = []
            data.push(postdata)

            const submiting = { formComps, data }

            // \\ console.log('submit', submiting)


            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))

                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting, (v) => {
                        //console.log(v)
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                            // dispatch({ type: SET_TRANSACTION_STATUS, payload: STATUS_SAVED })
                            resetTransaction(true)
                        }

                    }))
                    break;
                default:
                    break;
            }

        }
    }, [actions])

    const RenderForm = React.memo(() => {
        if (!formComps)
            return <LoadingStatus />

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        //      let defaultDataValue = { ...initialValues }
        let defaultDataValue = { [documentkey]: initialValues[documentkey] }

        return (
            <Segment raised className="form-container">
                <FormUI as={'form'} style={{ marginTop: '0px', marginBottom: '50px' }}>

                    <ComponentAdaptersMixed
                        key="0.componentgroup"
                        formRefs={formRefs}
                        methods={methods}
                        components={_.groupBy(formComps, 'grouprowsseq')}
                        defaultDataValue={defaultDataValue}
                        itemClickHandler={onItemClickHandler}
                        postAction={postAction}
                    />
                </FormUI>
            </Segment>
        )
    })

    //console.log(formValidationSchema)
    return (
        <FormProvider {...methods}   >
            <ContentHeader
                title={title}
                btn1={Buttons}
                children={<RenderForm />} />
        </FormProvider>
    );

}

const mapStateToProps = (state) => {
    return {
        actions: state.auth.modals.actionpick,
        formComps: getFormComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        resetTrx: state.auth.resetTrx,
        actionlabel: state.auth.actionlabel,
        executegenerate: state.auth.generate_execute
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)
