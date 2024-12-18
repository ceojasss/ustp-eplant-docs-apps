import React, { useRef, useState, useEffect, useCallback } from "react"
import { useDispatch, connect } from 'react-redux'
import { Form as FormUI, Label, Header, Segment, SegmentGroup, Button } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";
import dateFormat, { masks } from "dateformat";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, populateList } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroupArray from "../../../templates/forms/ComponentAdaptersGroupArray";
import { getFormListComponent, getFormComponent, UniquePropertyTest, useYupValidationResolver, FormDefaultValidation, clearCacheData, checkDuplicateRows, InitValidation } from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_TRANSACTION_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";


const Forms = ({ title, periode, units, actions, formComps, initialValues, postdata, formValidationSchema }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    const postAction = loc.pathname.split('/').pop()


    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidation();


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])



    /** add custom validation to default schema validation */
    yup.addMethod(yup.array, 'customlimit', function (fields) {
        return this.test('limiting', '', function (array, field) {

            console.log('limitting', array)

            //let msg = checkDuplicateRows(array, fields, field)

            let msg = null

            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });

    })

    let customSchema

    if (formValidationSchema) {
        customSchema = formValidationSchema.concat(
            yup.object().shape({
                inputgrid: yup.array()
                    .customlimit(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))
            })
        )


        // console.log(customSchema)
    }

    const resolver = useYupValidationResolver(customSchema);

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && { inputgrid: initialValues } })

    const submitHandler = () => formRefs.current((object) => {

        //   console.log('yeeay')

        console.log('submit object ', object)
        /*
          * 1. Set post Data. 
          *    Jika action UPDATE maka data ditambahkan rowid,
          * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
         */
        let postObject = (postAction === NEWS ? object : { ...object })
        dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, postObject))
    })

    const button = {
        btnLabel: (postAction.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE),
        btnIcon: 'save',
        addClickHandler: submitHandler
    }



    if (actions) {

        let data = []
        data.push(postdata)

        const submiting = { formComps, data }

        switch (actions) {

            case Appresources.BUTTON_LABEL.LABEL_SAVE:

                console.log('masuuk')
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

    const defaultDataValue = { nomorspb: units[0] }


    //    console.log(customSchema)

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
                            {...methods}
                            components={_.groupBy(formComps, 'grouprowsseq')}
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

const mapStateToProps = (state) => {


    return {
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComp: getFormComponent(),
        formComps: getFormListComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)