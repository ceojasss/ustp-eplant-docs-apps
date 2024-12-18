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
import { resetLov, DialogConfirmation, DialogCrudConfirmation, resetTransaction, ShowData, ShowDataLinked, fetchLovUrlPreview, fetchLovUrlPreviewArray } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, parseDatetoString } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData, ROUTES, executeApprove } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";



import store from "../../../../redux/reducers";
import ComponentAdaptersLinked from "../../../templates/forms/ComponentAdaptersLinked";
import { PO, PR, PREFIX_EDIT, VH } from "../../../Constants";
import eplant from "../../../../apis/eplant";
import format from 'dateformat'
import KUPReport from './../../../../file/KUP-Rev 3-20 November 2023.pdf';

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

const Forms = ({ title, periode, units, actions, formComp, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx, urlpreview }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    let buttonReport
    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)



    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype

    //    // console.log('render form');


    const ClickHandler1 = () => {


        const ppocode = encodeURIComponent(methods.getValues('ppocode'))
        const ppodate = encodeURIComponent(parseDatetoString(methods.getValues('ppodate')))

        const urls = `${ROUTES}/link?ppocode=${ppocode}&ppodate=${ppodate}`
        dispatch(ShowDataLinked(PR, urls))
    }



    let buttonForm = {
        btnLabel: 'Pilih Purchase Request',
        btnIcon: 'copy outline',
        addClickHandler: ClickHandler1
    }


    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation


    useEffect(() => {
        if (_.isEmpty(formComp))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationMixed(postAction,
            (obj) => {
                customschema(obj, formComp, formComps, methods,actionlabel)
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
                // // console.log('masuk sini')
                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {

                        // doctype=  _.get(submitdata['inputgrid'][0]['itemcode'],'code').match('06010002') ? 'POSLR':'PO'
                        // if (doctype == 'POSLR' ){
                        dispatch(fetchLovUrlPreview('PPO', initialValues['process_flag'], initialValues['ppocode']))
                        // } else {
                        // }
                    }
                }, 0.1);
            } else {

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

            //  // console.log('submit', submiting)


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
                        if (submiting.data[0].header.process_flag === "APPROVED"){
                            // console.log('he')
                            dispatch(executeApprove(methods.getValues('agreementcode')))
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


    const handlerReport = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        // // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
            
            
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }
    const handlerReportKUP = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        window.open(KUPReport)
    }

    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PPB.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PPB.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[1], 'v_url_preview').match('rpt_ppb.RDF') : _.includes(initialValues['v_url_preview'], 'rpt_ppb.RDF'))) {
        // // console.log('1')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReport,
        },
         {
            btnTitle: 'View Report KUP',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReportKUP,
        }

        ]
    }



    //   // console.log(formValidationSchema)

    //  // console.log('compss', formComp)

    const RenderForm = React.memo(() => {

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        //      let defaultDataValue = { ...initialValues }
        let defaultDataValue = { [documentkey]: initialValues[documentkey] }

        // // console.log(defaultDataValue)


        return (
            <Segment raised className="form-container">
                <FormUI as={'form'} style={{ marginTop: '0px', marginBottom: '50px' }}>
                    {/* <FormProvider {...methods}   > */}
                    <ComponentAdaptersLinked
                        key="0.componentgroupheader"
                        formRefs={formRefs}
                        methods={methods}
                        defaultDataValue={defaultDataValue}
                        postAction={postAction}
                        handler1={buttonForm}
                    />
                    {/*    </FormProvider> */}
                </FormUI>
            </Segment >
        )
    })




    return (<FormProvider {...methods}   >
        <ContentHeader
            title={title}
            btn1={button}
            btn2={buttonReport}
            methods={methods}
            children={<RenderForm />} />
    </FormProvider>
    );

}

const customschema = (formValidationSchema, formComp, formComps, methods, actionlabel) => {

    let customSchema
    const { setValue, getValues } = methods

    let validationSchems = {}

    yup.addMethod(yup.string, "setpurchasesite",
        function setpurchasesite() {
            return this.test((value, values) => {


                // // console.log(getValues('authorized'))
                // setValue('authorized', '0', { shouldDirty: true })
                if (getValues('inputby').match(/^.*HO$/)) {
                    setValue('purchasing_site', 'HO', { shouldDirty: true })
                } else {
                    setValue('purchasing_site', 'SO', { shouldDirty: true })
                }
                return true

            })
        }
    )

    yup.addMethod(yup.string, "setinclude",
        function setinclude() {
            return this.test((value, values) => {


                // // console.log(getValues('authorized'))
                // setValue('authorized', '0', { shouldDirty: true })
                if (getValues('include_transport') === 'N;Y') {
                    setValue('include_transport', 'N', { shouldDirty: true })
                }
                return true

            })
        }
    )


    yup.addMethod(yup.string, "ppn",
        function ppn() {
            return this.test((value, values) => {


                // // console.log(getValues('authorization'))

                if (!_.isUndefined(getValues('inputgrid[0]'))) {
                    // // console.log(_.size(getValues('inputgrid')))
                    // for (let i = 0; i < _.size(getValues('inputgrid')); i++) {

                    // }
                    // // console.log(getValues('inputgrid'))
                    for (let i = 0; i < _.size(getValues('inputgrid')); i++) {
                        // // console.log(getValues(`inputgrid[${i}].itemdescription`).match(/^.*MINYAK SOLAR.*$/))
                        // // console.log(_.isMatch(getValues(`inputgrid[${i}].itemdescription`),'MINYAK SOLAR'))
                        // if (getValues(`inputgrid[${i}].statusppn`) != getValues(`inputgrid[${i}].statusppn`)){
                        if (getValues(`inputgrid[${0}].itemdescription`).match(/^.*MINYAK SOLAR.*$/)) {
                            // // console.log('1')
                        } else {
                            // // console.log('2')
                            if (getValues(`inputgrid[${0}].statusppn`) == 1) {

                                setValue(`inputgrid[${i}].statusppn`, 1, { shouldDirty: true })
                            }
                        }
                        // }
                    }

                }
                return true

            })
        }
    )

    yup.addMethod(yup.string, "AgreementCodeReq",
    function AgreementCodeReq() {
        return this.test((value, values) => {


            // // console.log(getValues('authorized'))
            // console.log(actionlabel)
            if (_.isNil(getValues('agreementcode'))){
                eplant.get(`${ROUTES}/getagreement?tdate=${format(getValues('ppodate'),'dd/mm/yyyy')}`).then(res => {
                    // console.log(res)
                    setValue(`agreementcode`, _.get(res.data[0],'agreementcode'), { shouldDirty: true })
                })
            }
            // setValue('authorized', '0', { shouldDirty: true })
            // if (getValues('include_transport') === 'N;Y') {
            //     setValue('include_transport', 'N', { shouldDirty: true })
            // }
            return true

        })
    }
)

    yup.addMethod(yup.string, "amount",
        function amount() {
            return this.test((value, values) => {


                // // console.log(getValues('authorization'))

                if (!_.isUndefined(getValues('inputgrid[0]'))) {
                    // // console.log(_.size(getValues('inputgrid')))
                    // for (let i = 0; i < _.size(getValues('inputgrid')); i++) {

                    // }
                    // // console.log(getValues('inputgrid'))
                    for (let i = 0; i < _.size(getValues('inputgrid')); i++) {
                        // // console.log(getValues(`inputgrid[${i}].itemdescription`).match(/^.*MINYAK SOLAR.*$/))
                        // // console.log(_.isMatch(getValues(`inputgrid[${i}].itemdescription`),'MINYAK SOLAR'))
                        // if (getValues(`inputgrid[${i}].statusppn`) != getValues(`inputgrid[${i}].statusppn`)){
                        let totamount = getValues(`inputgrid[${i}].quantity`) * getValues(`inputgrid[${i}].unitprice`)
                        setValue(`inputgrid[${i}].amount`, totamount, { shouldDirty: true })
                        // }
                    }

                }
                return true

            })
        }
    )
    // yup.addMethod(yup.array, 'AgreementCodeReq', function (fields) {
    //     return this.test('AgreementCodeReq ', '', function (array, v) {

    //         //// console.log('limitting', array)

    //         let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0
    //         // const totalAmount = getValues('totalamount')

    //         _.map(array, (x, index) => {
    //             accum += x.amount
    //         })
    //         // // console.log(accum)
    //         //    // console.log(_.isNil(accum), _.isNil(totalAmount))
    //         //  // console.log(accum, totalAmount)

    //         if (_.isNil(accum)) {
    //             return true;
    //         } else {
    //             if (accum >= 100000000) {
    //                 if (_.isEmpty(getValues('agreementcode'))) {
    //                     msg = 'Required'//'Total Amount Not Match with Sum Amount'
    //                     return !_.isEmpty(msg) ? this.createError({ path: `agreementcode`, message: msg }) : true;
    //                 }
    //             }
    //         }


    //         return true;
    //     });

    // })

    yup.addMethod(yup.array, 'autoLine', function (fields) {
        return this.test('autoLine', 'autoLine', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let  errors = []

            let st = store.getState()

            //          console.log('data', st)
            let x = 0
            let y = true

            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)
                // index  = index+1
                if (_.isUndefined(v.polineno) ){
                    x+=1
                } else {
                    x = v.polineno 
                }
                // console.log(v)

                // console.log(methods)
                if(_.isNil(v.polineno) && _.isNil(v.rowid)){
                    setValue(`${this.path}[${index}].polineno`, x, { shouldDirty: true })
                    // console.log(index)
                    errors.push(index)
                } 
                // else {
                //     setValue(`${this.path}[${index}].lineno`, x, { shouldDirty: true })
                // }
                if (_.find(st.auth.deletelist, ['tid', v.tid]))
                    return;

                // console.log(v.hadisplayonly)
                // if (!_.isUndefined(v.hadisplayonly)){

                // }

            })
            // console.log('hee',_.isEmpty(errors))
            // console.log('1',errors.length)
            // console.log(`${this.path}[${smt}].hadisplayonly` )
            if (errors.length === 0) {
                return true
            } else  {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // if (getValues(`${this.path}[${errors[0]}].hadisplayonly`) == '0'){
                    // const r = getValues(`${this.path}[${errors[0]}].hectplanteddisplayonly`)
                    // return this.createError(
                        // { path: `${this.path}[${errors[0]}].request_vol`, message: `Luas CR > ${r} ` }
                    // )
                // }
            }

        });

    })

    customSchema = formValidationSchema
        .concat(
            yup.object().shape({
                include_transport: yup.string().setinclude(),
                ppn: yup.string().ppn(),
                setpurchasesite: yup.string().setpurchasesite(),
                inputgrid: yup.array()./*AgreementCodeReq().*/autoLine(),
                amount: yup.string().amount(),
                AgreementCodeReq: yup.string().AgreementCodeReq()
            }))

    //  // console.log(customSchema.fields.concat.setAuthDate())

    /* if (formValidationSchema) {
    
        // console.log('customSchema')
    
        customSchema = formValidationSchema
            .concat(yup.object().setAuthDate())
    } */
    //
    // // console.log(customSchema)

    if (!_.isEmpty(customSchema))
        store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {
    // // console.log(state.auth.urlpreviewarray)

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
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)