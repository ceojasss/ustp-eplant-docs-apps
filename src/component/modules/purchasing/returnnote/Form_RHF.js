import React, { useRef, useState, useEffect, useCallback, lazy, Suspense } from "react"
import { useDispatch, connect } from 'react-redux'


import { Form as FormUI, Label, Header, Segment, SegmentGroup, Button, Divider, Accordion } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";
import dateFormat, { masks } from "dateformat";
import eplant from '../../../../apis/eplant'
// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { resetLov, DialogConfirmation, DialogCrudConfirmation, resetTransaction, fetchLovUrlPreview } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, UserInfo } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";



import store from "../../../../redux/reducers";
import { useKey } from "../../../../utils/ShortcutKeyHelper";

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
    // // console.log(initialValues)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    let buttonReport
    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)

    // // console.log(postAction)

    const resolver = useYupValidationResolver(formValidationSchema);

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype
    // // console.log(methods)

    useKey('save', () => {
        // // console.log('click')
        submitHandler()
    })
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
                // console.log('masuk sini', submitdata)
                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        //         doctype=  _.get(submitdata,'spk_type').match('0') ? 'CRMIN':'CR'
                        // if (doctype == 'CRMIN' ){
                        //     dispatch(fetchLovUrlPreview(doctype,initialValues['process_flag'],initialValues['requestcode']))
                        // } else {
                        dispatch(fetchLovUrlPreview('RN', initialValues['process_flag'], initialValues['returnnotenumber']))
                        // }
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

            // console.log('submit', submiting)


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

        dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))
    })


    //  // console.log(initialValues['v_url_preview'])

    const handlerReport = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        // // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }
    const handlerReportSolar = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            // // console.log('hehe',initialValues['v_url_preview_solar'])
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }


    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('rpt_returnnote_new.rdf') : _.includes(initialValues['v_url_preview'], 'rpt_returnnote_new.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_RETURNNOTE_NEW.rdf') : _.includes(initialValues['v_url_preview'], 'RPT_RETURNNOTE_NEW.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_RETURNNOTE_NEW.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_RETURNNOTE_NEW.RDF'))) {
        // // console.log('1')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReport,
        },
        {
            btnTitle: 'View Report Minor',
            btnIcon: 'file pdf outline',
            // reportHandler: handlerReportMinor,
            hidden: 'none'
        }
        ]
    } else {
        // // console.log('3')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
            // reportHandler: handlerReport,
        },
        {
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
            // reportHandler: handlerReport,
        }
        ]
    }

    const RenderForm = React.memo(() => {

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        //      let defaultDataValue = { ...initialValues }
        let defaultDataValue = { [documentkey]: initialValues[documentkey] }

        // // console.log(defaultDataValue)


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



    // console.log('run form')
    return (
        <ContentHeader
            title={title}
            btn1={button}
            btn2={buttonReport}
            children={<RenderForm />} />
    );

}

const customschema = (formValidationSchema, formComp, formComps, methods) => {

    let customSchema
    const { setValue, getValues } = methods
    let validationSchems = {}
    const ROUTES = '/purchasing/Trx/returnnote'



    yup.addMethod(yup.string, "setAuthDate",
        function authDate() {
            return this.test((value, values) => {


                // // console.log(getValues('authorized'))
                // setValue('authorized', '0', { shouldDirty: true })
                if (getValues('authorized') === '0;1') {
                    setValue('authorized', '0', { shouldDirty: true })
                }

                if (getValues('authorized') === '1') {
                    setValue('authorizedate', new Date(), { shouldDirty: true })
                }
                else {
                    setValue('authorizedate', null, { shouldDirty: true })

                }
                return true

            })
        }
    )
    yup.addMethod(yup.array, 'getSack', function (fields) {
        return this.test('getSack', 'getSack', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let errors = []

            let st = store.getState()

            //          console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)
                // console.log(v)
                // if (!_.isUndefined(v.emdek)){
                // if(v.emdek == 1){
// console.log(v.purchaseitemcode)

                if (!_.isUndefined(v.itemcode) && _.isUndefined(v.karung)) {
                        eplant.get(`${ROUTES}/getsack?itemcode=${v.itemcode}`).then(res => {
                            // console.log(res.data[0])
                            setValue(`${this.path}[${index}].sackdisplayonly`, _.get(res.data[0],'itemcode'), { shouldDirty: true })
                        })
                        // console.log(v.sackdisplayonly)
                        if(!_.isUndefined(v.sackdisplayonly)){
                            if (_.isUndefined(v.karung)){
                                errors.push(index)
                            }
                        }
                        // if (v.valemdekdisplayonly == 0) {
                        // } else if (v.valemdekdisplayonly == 2) {
                            // errors.push(index)
                        // }
                    // }
                }
                // }                 
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
            } else {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // if (getValues(`${this.path}[${errors[0]}].hadisplayonly`) == '0'){
                // if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 0) {
                    return this.createError(
                        { path: `${this.path}[${errors[0]}].karung`, message: `Required ` }
                    )
                // } else if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 2) {
                //     return this.createError(
                //         { path: `${this.path}[${errors[0]}].emdek`, message: `Jalur Tdk Standart ` }
                //     )
                // }
                // }
            }

        });

    })


    customSchema = formValidationSchema
        .concat(
            yup.object().shape({
                // authorized: yup.string().setAuthDate(),
                inputgrid: yup.array().getSack()
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
    //  // console.log(state)

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