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
import { resetLov, DialogConfirmation, DialogCrudConfirmation, resetTransaction,fetchLovUrlPreview } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";
import { useKey } from "../../../../utils/ShortcutKeyHelper";


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

const Forms = ({ title, periode, units, actions, formComp, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx,urlpreview }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();
    
    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)



    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onSubmit', resolver, defaultValues: initialValues && initialValues })

    //    console.log('render form');

    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation

    useKey('save', () => {
        // console.log('click')
        submitHandler()
    })

    useEffect(() => {
        if (_.isEmpty(formComp))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationMixed(postAction,
            (obj) => {
                //customschema(obj, formComp, formComps, methods)
            }
        );


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])


    useEffect(() => {


        ///console.log('reset transaction', resetTrx, submitdata)
        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {
                // console.log('masuk sini')
                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        //         doctype=  _.get(submitdata,'spk_type').match('0') ? 'CRMIN':'CR'
                        // if (doctype == 'CRMIN' ){
                        //     dispatch(fetchLovUrlPreview(doctype,initialValues['process_flag'],initialValues['requestcode']))
                        // } else {
                        dispatch(fetchLovUrlPreview('NR', initialValues['process_flag'], initialValues['mrcode']))
                        // }
                    }
                }, 0.1);
            } else {
                // console.log('masuk sini aja')

                setTimeout(() => {
                    methods.reset(methods.getValues())
                }, 0.1);
            }
            // console.log(initialValues)
            // methods.reset(submitdata)
            // console.log(methods)
            // console.log(_.get(submitdata['inputgrid'][0]['itemcode'],'code'))
            // console.log(initialValues)
            // if (_.isUndefined(initialValues['v_url_preview'])){
            //     // if (_.isEmpty(submitdata['inputgrid'])){
            //         doctype=  _.get(submitdata['inputgrid'][0]['itemcode'],'code').match('DA002001') && (_.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'VH' || _.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'MA') ? 'MRSLR':'MR'

            // // } else {
            // //     doctype = 'MRSLR'
            // // }
            // // console.log(doctype)
            // if (doctype == 'MRSLR' ){
            //     dispatch(fetchLovUrlPreview(doctype,initialValues['process_flag'],initialValues['mrcode']))
            // } else {
            //     dispatch(fetchLovUrlPreview('MR',initialValues['process_flag'],initialValues['mrcode']))
            // }
            // }
            // console.log('hahaha')
            // dispatch(fetchLovUrlPreview(doctype,initialValues['process_flag'],initialValues['mrcode']))
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




    if (!formComp || formComp.length === 0)
        return <LoadingStatus />


    const submitHandler = () => formRefs.current((data, object) => {

        /*
         * 1. Set post Data. 
         *    Jika action UPDATE maka data ditambahkan rowid,
         * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
        */


        //    console.log(data, object)
        //      dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, object, data))


        //        let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })
        dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))
    })

console.log(initialValues)
    const handlerReport = () => {
        // console.log(_.get(urlpreview[0],'v_url_preview'))
        // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }
    let buttonReport
    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_nursery_matrequest.rdf') : _.includes(initialValues['v_url_preview'], 'RPT_nursery_matrequest.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_NURSERY_MATREQUEST.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_NURSERY_MATREQUEST.RDF'))) {
        // console.log('1')
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
        // console.log('3')
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

    //   console.log(formValidationSchema)

    //  console.log('compss', formComp)


    const RenderForm = React.memo(() => {

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        //      let defaultDataValue = { ...initialValues }
        let defaultDataValue = { [documentkey]: initialValues[documentkey] }

        // console.log(defaultDataValue)


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



    //console.log('render forms')
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
    //  console.log(formValidationSchema, formComps)

    /* yup.addMethod(yup.array, 'checkUnique', function (fields) {
        return this.test('unique', '', function (array, field) {
            console.log(array)
            let msg = checkDuplicateRows(array, fields, field)
            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });
    });
 */




    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'debitcreditCheck', function (fields) {
        return this.test('checkdebitCredit', '', function (array, v) {

            //console.log('limitting', array)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0

            _.map(array, (x, index) => {
                debit = x.debit
                credit = x.credit

                if (x.credit != 0 && x.debit != 0) {

                    setValue(`${this.path}[${index}].debit`, 0, { shouldDirty: true })
                    setValue(`${this.path}[${index}].credit`, 0, { shouldDirty: true })

                }

                accumdebit += debit

                accum += debit - credit

            })

            if (accum != 0) {
                msg = 'Debit Credit Unbalance'
                return !_.isEmpty(msg) ? this.createError({ path: `debitsummarydisplayonly`, message: msg }) : true;
            }

            //console.log(getValues('totalamount'), accumdebit)

            if (accum === 0 && accumdebit != getValues('totalamount')) {
                msg = 'Total Amount Not Match with Total Debit credit'
                return !_.isEmpty(msg) ? this.createError({ path: `totalamount`, message: msg }) : true;
            }

            return true;
        });

    })


    if (formValidationSchema) {
        customSchema = formValidationSchema
            .concat(
                yup.object().shape({
                    inputgrid: yup.array()
                        .debitcreditCheck(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {

       console.log(state)
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