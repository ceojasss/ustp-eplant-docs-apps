import React, { useRef, useState, useEffect, useCallback, lazy, Suspense } from "react"
import { useDispatch, connect } from 'react-redux'


import { Form as FormUI, Label, Header, Segment, SegmentGroup, Button, Divider, Accordion } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";
import dateFormat, { masks } from "dateformat";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { resetLov, DialogConfirmation, DialogCrudConfirmation, resetTransaction, setEditData, fetchLovUrlPreview } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, isFieldLov, getTitle, getFormTitle } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData, fetchDataGenerate } from "./FormAction";
import '../../../Public/CSS/App.css'
import { GENERATE_DATA, SAVE, SET_GRID_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";



import store from "../../../../redux/reducers";

/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - 
 |                - 
 |          
 |  Description:  Helper Functions for Form / List Component
 |                > list of functions                 
 |                  - 
 |                  - 
 |                  - 
 *===========================================================================*/

const Forms = ({ executegenerate, title, periode, units, actions, formComp, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx, urlpreview }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)



    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype
    //    // console.log('render form');

    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation
    const generateData = async (cb) => {

        // const key_doc = methods.control._formValues.agreementcode
        // const progressdate = methods.control._formValues.wipdate
        // const progressno = methods.control._formValues.documentno


        //   if (_.isEmpty(key_doc)) {

        //  toast.warning("Request Code Is Required")


        //  return;
        //   }

        //   // console.log(methods.getValues('requestno'))

        if (/*!_.isEmpty(key_doc) &&*/ _.size(methods.control._formValues.inputgrid) === 0) {

            // await dispatch(DialogLoading())

            // // console.log( methods.control._formValues)

            await dispatch(fetchDataGenerate('', '', () => {
                // dispatch(submitlinkdata(linkData))
            }))



            if (cb) cb()

        }
    }


    useEffect(() => {

        // console.log('run generate', executegenerate)

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
        if (_.isEmpty(formComp))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationMixed(postAction,
            (obj) => {
                customschema(obj, formComp, formComps, methods)
            }
        );


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])


    useEffect(() => {


        // // console.log('reset transaction', resetTrx, submitdata)

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {


                const viewData = _.omit(submitdata, _.filter(_.keys(submitdata), x => (x.includes('displayonly'))))

                // // console.log('masuk sini 2', viewData)

                setTimeout(() => {
                    methods.reset(viewData)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        // if (_.isEmpty(submitdata['inputgrid'])){

                        // } else {
                        //     doctype = 'MRSLR'
                        // }
                        // // console.log(doctype)
                        dispatch(fetchLovUrlPreview('EPV', '', initialValues['suppliercode']))
                    }
                }, 0.1);


            } else {
                // console.log('masuk sini aja')

                setTimeout(() => {
                    methods.reset(methods.getValues())
                }, 0.1);
            }

            dispatch(resetTransaction(false))
        }
        return () => {
            dispatch(resetTransaction(false))
        }
    }, [resetTrx])

    useEffect(() => {
        if (actions) {

            let data = []
            data.push(postdata)

            const submiting = { formComp, formComps, data }



            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))

                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting, (v) => {
                        //// console.log(v)
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




    if (!formComp || formComp.length === 0)
        return <LoadingStatus />


    const submitHandler = () => formRefs.current((data, object) => {

        /*
         * 1. Set post Data. 
         *    Jika action UPDATE maka data ditambahkan rowid,
         * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
        */


        //    // console.log(data, object)
        //      dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, object, data))


        //        let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })
        dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))
    })

    // // console.log(urlpreview)
    const handlerReport = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        // // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            // if (!_.isNull(submitdata)) {
            //     if (!_.isNull(submitdata.approvedate))
            //         window.open(initialValues['v_url_preview'].replace('_DRAFT', ''))
            // } else {
                window.open(initialValues['v_url_preview'])
            // }
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }

    // if (!_.isNull(submitdata)){

    //     // console.log(submitdata.approvedate)
    // }
    // // console.log(initialValues['v_url_preview'].replace('_DRAFT',''))
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    let buttonReport
    if (actionlabel === Appresources.BUTTON_LABEL.LABEL_UPDATE) {
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReport,
        },
        {
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
        }]

    } else {
        // // console.log('3')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
        },
        {
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
        }
        ]
    }
    // if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PAYMENT_VOUCHER_R01_DRAFT.rdf') : _.includes(initialValues['v_url_preview'], 'RPT_PAYMENT_VOUCHER_R01_DRAFT.rdf'))) {
    //     // // console.log('1')
    //     buttonReport = [{
    //         btnTitle: 'View Report',
    //         btnIcon: 'file pdf outline',
    //         reportHandler: handlerReport,
    //     },
    //     {
    //         btnTitle: 'View Report',
    //         btnIcon: 'file pdf outline',
    //         // reportHandler: handlerReport,
    //         hidden: 'none'
    //     }
    //     ]
    // } else {
    //     // // console.log('3')
    //     buttonReport = [{
    //         btnTitle: 'View Report',
    //         btnIcon: 'file pdf outline',
    //         hidden: 'none'
    //         // reportHandler: handlerReport,
    //     },
    //     {
    //         btnTitle: 'View Report',
    //         btnIcon: 'file pdf outline',
    //         hidden: 'none'
    //         // reportHandler: handlerReport,
    //     }
    //     ]
    // }
    const RenderForm = React.memo(() => {

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        let defaultDataValue = { [documentkey]: initialValues[documentkey] }



        return (
            <Segment raised className="form-container">
                <FormUI as={'form'} style={{ marginTop: '0px', marginBottom: '50px' }}>
                    <FormProvider {...methods} raised  >
                        <ComponentAdaptersMixed
                            key="0.componentgroupheader"
                            formRefs={formRefs}
                            methods={methods}
                            defaultDataValue={defaultDataValue}
                            postAction={postAction}
                        />
                    </FormProvider>
                </FormUI>
            </Segment >
        )
    })


    return (
        <ContentHeader
            title={title}
            btn1={button}
            btn2={buttonReport}
            children={<RenderForm />} />
    );

}

const customschema = (formValidationSchema, formComp, formComps, methods, title) => {

    let customSchema
    const { setValue, getValues } = methods


    // ? add custom validation to default schema validation 
   

    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'supplierTdate', function (fields) {
        return this.test('supplierTdate ', '', function (array, v) {

            //// console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0, total = 0, errors=[]
            const suppliercode = getValues('suppliercode')
            const tdate = getValues('tdate')
            // console.log(suppliercode)
            _.map(array, (x, index) => {
                // accum += x.amount
                setValue(`${this.path}[${index}].suppliercode`,_.get(suppliercode,'suppliercode'), { shouldDirty: true })
                setValue(`${this.path}[${index}].tdate`,tdate, { shouldDirty: true })
            })
            // total = accum - totalAmount
            //    // console.log(_.isNil(accum), _.isNil(totalAmount))
            //  // console.log(accum, totalAmount)
            // // console.log(total)

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // if (getValues(`${this.path}[${errors[0]}].hadisplayonly`) == '0'){
                // if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 0) {
                    // return this.createError(
                        // { path: `${this.path}[${errors[0]}].karung`, message: `Required ` }
                    // )
                // } else if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 2) {
                //     return this.createError(
                //         { path: `${this.path}[${errors[0]}].emdek`, message: `Jalur Tdk Standart ` }
                //     )
                // }
                // }
            }
        });

    })

    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'Value', function (fields) {
        return this.test('Value ', '', function (array, v) {

            //// console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0, total = 0, errors=[]
            // const suppliercode = getValues('suppliercode')
            // const tdate = getValues('tdate')
            // console.log(suppliercode)
            _.map(array, (x, index) => {
                if (x.tvalue > 4){
                    setValue(`${this.path}[${index}].tvalue`,4, { shouldDirty: true })
                }
                // accum += x.amount
                // setValue(`${this.path}[${index}].suppliercode`,suppliercode, { shouldDirty: true })
                // setValue(`${this.path}[${index}].tdate`,tdate, { shouldDirty: true })
            })
            // total = accum - totalAmount
            //    // console.log(_.isNil(accum), _.isNil(totalAmount))
            //  // console.log(accum, totalAmount)
            // // console.log(total)

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // if (getValues(`${this.path}[${errors[0]}].hadisplayonly`) == '0'){
                // if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 0) {
                    // return this.createError(
                        // { path: `${this.path}[${errors[0]}].karung`, message: `Required ` }
                    // )
                // } else if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 2) {
                //     return this.createError(
                //         { path: `${this.path}[${errors[0]}].emdek`, message: `Jalur Tdk Standart ` }
                //     )
                // }
                // }
            }
        });

    })

    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'Keterangan', function (fields) {
        return this.test('Keterangan', '', function (array, v) {

            //// console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0, total = 0, errors=[]
            // const suppliercode = getValues('suppliercode')
            // const tdate = getValues('tdate')
            // console.log(suppliercode)
            _.map(array, (x, index) => {
                if(x.tvalue == 1){
                    setValue(`${this.path}[${index}].ketdisplayonly`,'Dibawah Standar', { shouldDirty: true })
                } else if(x.tvalue == 2){
                    setValue(`${this.path}[${index}].ketdisplayonly`,'Standar', { shouldDirty: true })
                } else if(x.tvalue == 3){
                    setValue(`${this.path}[${index}].ketdisplayonly`,'Baik', { shouldDirty: true })
                } else if(x.tvalue == 4){
                    setValue(`${this.path}[${index}].ketdisplayonly`,'Sangat Baik', { shouldDirty: true })
                } else {
                    setValue(`${this.path}[${index}].ketdisplayonly`,null, { shouldDirty: true })
                }
                // if (x.tvalue > 4){
                    // setValue(`${this.path}[${index}].tvalue`,4, { shouldDirty: true })
                // }
                // accum += x.amount
                // setValue(`${this.path}[${index}].suppliercode`,suppliercode, { shouldDirty: true })
                // setValue(`${this.path}[${index}].tdate`,tdate, { shouldDirty: true })
            })
            // total = accum - totalAmount
            //    // console.log(_.isNil(accum), _.isNil(totalAmount))
            //  // console.log(accum, totalAmount)
            // // console.log(total)

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // if (getValues(`${this.path}[${errors[0]}].hadisplayonly`) == '0'){
                // if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 0) {
                    // return this.createError(
                        // { path: `${this.path}[${errors[0]}].karung`, message: `Required ` }
                    // )
                // } else if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 2) {
                //     return this.createError(
                //         { path: `${this.path}[${errors[0]}].emdek`, message: `Jalur Tdk Standart ` }
                //     )
                // }
                // }
            }
        });

    })




    if (formValidationSchema) {
        customSchema = formValidationSchema
            .concat(
                yup.object().shape({
                    inputgrid: yup.array().supplierTdate().Value().Keterangan(),
                    // destination: yup.string().checkdestination()
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {

    return {
        urlpreview: state.auth.urlpreview,
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComp: getFormComponent(),
        formComps: getFormListComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        formValidationSchema: state.auth.formValidationSchema,
        actionlabel: state.auth.actionlabel,
        resetTrx: state.auth.resetTrx,
        executegenerate: state.auth.generate_execute
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)