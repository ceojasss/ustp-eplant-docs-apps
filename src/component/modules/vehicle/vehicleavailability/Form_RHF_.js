import React, { useRef, useState, useEffect, useCallback } from "react"
import { useDispatch, connect } from 'react-redux'
import { Form as FormUI, Label, Header, Segment, SegmentGroup, Button } from 'semantic-ui-react'
import { useForm, FormProvider, appendErrors } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";
import dateFormat, { masks } from "dateformat";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, populateList, resetTransaction } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroupArray from "../../../templates/forms/ComponentAdaptersGroupArray";
import { getFormListComponent, getFormComponent, UniquePropertyTest, useYupValidationResolver, FormDefaultValidation, clearCacheData, checkDuplicateRows, getFormComponentv2, InitValidation, InitValidationList } from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_TRANSACTION_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

const Forms = ({ title, periode, units, actions, formComps, initialValues, postdata, formValidationSchema, resetTrx, submitdata, actionlabel }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    const postAction = loc.pathname.split('/').pop()

    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationList(postAction,
            (obj) => {
                customschema(obj, formComps, methods)
            });


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])


    const resolver = useYupValidationResolver(formValidationSchema);

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && { inputgrid: initialValues } })

    const submitHandler = () => formRefs.current((data, object) => {

        //   console.log('yeeay')

        //  console.log('submit object ', object)
        /*
          * 1. Set post Data. 
          *    Jika action UPDATE maka data ditambahkan rowid,
          * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
         */
        let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })
        dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, postObject, data))



    })

    let button = {
        btnLabel: (postAction.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE),
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    useEffect(() => {

        console.log('reset transaction', resetTrx, submitdata)
        if (resetTrx & !_.isUndefined(submitdata)) {



            methods.reset(submitdata)
        }
        return () => {
            resetTransaction(false)
        }
    }, [resetTrx])


    useEffect(() => {
        if (actions) {

            let data = []
            data.push(postdata)

            const submiting = { formComps, data }

            //  console.log('submit', submiting)


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

    /* 
        if (actions) {
    
            let data = []
            data.push(postdata)
    
            const submiting = { formComps, data }
    
            switch (actions) {
    
                case Appresources.BUTTON_LABEL.LABEL_SAVE:
    
                    // console.log('masuuk')
                    dispatch(createData(submiting, (v) => {
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                            //    setTimeout(navigate(-1), 1000);
    
                        }
                    }))
    
                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting, (v) => {
                        console.log(submiting)
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
    
                        }
                        //navigate(-1)
                    }))
                    break;
                default:
                    break;
            }
    
        }
     */
    const defaultDataValue = { vehiclegroupcode: units[0] }


    //console.log(customSchema)

    const RenderForm = React.memo(() => {
        if (!formComps)
            return <LoadingStatus />

        return (
            <Segment raised className="form-container">
                <Header dividing as='h4' icon='dashboard' content={`Unit : ${units[0]} / ${units[1]}`} floated='left' />
                <Header dividing as='h4' icon='calendar alternate outline' content={`Periode Transaksi : ${dateFormat(periode, " mmm yyyy")}`} floated='right' />
                <FormUI as={'form'}  >
                    <FormProvider {...methods} raised style={{ marginBottom: '50px' }} >
                        <ComponentAdaptersGroupArray
                            key="0.componentgroup"
                            OnClickRef={formRefs}
                            methods={methods}
                            defaultDataValue={defaultDataValue}
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
            btn1={button}
            children={<RenderForm />} />
    );

}

const customschema = (formValidationSchema, formComps, methods) => {

    let customSchema
    const { setValue, getValues } = methods
}


const mapStateToProps = (state) => {


    return {
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComps: getFormListComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        resetTrx: state.auth.resetTrx,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        actionlabel: state.auth.actionlabel,
    }

}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)