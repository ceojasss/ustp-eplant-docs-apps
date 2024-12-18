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
import { resetLov, DialogConfirmation, DialogCrudConfirmation, resetTransaction, fetchLovUrlPreview } from "../../../../redux/actions"
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

const Forms = ({ title, periode, units, actions, formComp, formComps, initialValues, postdata, urlpreview, formValidationSchema, submitdata, actionlabel, resetTrx }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();
    let buttonReport
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
                customschema(obj, formComp, formComps, methods)
            }
        );


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])



    useEffect(() => {
        if (resetTrx) {
            if (!_.isEmpty(submitdata)) {
                // console.log('masuk sini')
                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(submitdata.inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }
                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        dispatch(fetchLovUrlPreview('JV', initialValues['process_flag'], initialValues['jvno']))

                    }
                }, 0.1);
            } else {
                // console.log('masuk sini aja')
                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(methods.getValues().inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }

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



    const handlerReport = () => {
        // console.log(_.get(urlpreview[0],'v_url_preview'))
        // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }
    const handlerReportSolar = () => {
        // console.log(_.get(urlpreview[0],'v_url_preview'))
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            // console.log('hehe',initialValues['v_url_preview_solar'])
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }


    // console.log(!_.isUndefined(urlpreview) ? _.uniqWith(_.get(urlpreview[0],'v_url_preview'),'SOLAR') :'')
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }
    // console.log(initialValues)
    // console.log(!_.isUndefined(initialValues['v_url_preview']?initialValues['v_url_preview'].match('SOLAR'):''))

    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('rpt_view_journal_voucher.rdf') : _.includes(initialValues['v_url_preview'], 'rpt_view_journal_voucher.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_VIEW_JOURNAL_VOUCHER.rdf') : _.includes(initialValues['v_url_preview'], 'RPT_VIEW_JOURNAL_VOUCHER.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_VIEW_JOURNAL_VOUCHER.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_VIEW_JOURNAL_VOUCHER.RDF'))) {
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

    yup.addMethod(yup.string, "settransdate",
        function settransdate() {
            return this.test((value, values) => {

                if (!_.isUndefined(getValues('transactiondate'))) {
                    let year = getValues('transactiondate').getFullYear();
                    let month = getValues('transactiondate').getMonth() + 1;
                    // console.log(parseInt(year.toString()) , getValues('financialyear'), month , getValues('periodno') ) 
                    // periodno,financialyear
                    // setValue('authorized', '0', { shouldDirty: true })
                    // if ((parseInt(year.toString()) != getValues('financialyear') || parseInt(year.toString()) == getValues('financialyear')) && (month != getValues('periodno') ||month == getValues('periodno')) ) {
                   if (getValues('periodno') != 13){

                   
                    if (parseInt(year.toString()) != getValues('financialyear')) {
                        if (month != getValues('periodno')) {
                            setValue('transactiondate', undefined, { shouldDirty: true })
                            // console.log('hehe')
                        }
                    }

                    else if (parseInt(year.toString()) == getValues('financialyear')) {
                        if (month != getValues('periodno')) {
                            setValue('transactiondate', undefined, { shouldDirty: true })
                            // console.log('hehe')
                        }
                    }
                }
                }
                // if (!_.isUndefined(getValues('batchno'))){
                //     let year = getValues('transactiondate').getFullYear();
                //     let month = getValues('transactiondate').getMonth()+1;
                //     console.log(parseInt(year.toString()) , getValues('financialyear'), month , getValues('periodno') ) 
                //     // periodno,financialyear
                //     // setValue('authorized', '0', { shouldDirty: true })
                //     // if ((parseInt(year.toString()) != getValues('financialyear') || parseInt(year.toString()) == getValues('financialyear')) && (month != getValues('periodno') ||month == getValues('periodno')) ) {
                //         if (parseInt(year.toString()) != getValues('financialyear')){
                //             if (month != getValues('periodno')){
                //                 setValue('transactiondate', null, { shouldDirty: true})
                //                 console.log('hehe')
                //             }
                //         }   
                // }
                return true

            })
        }
    )

    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'debitcreditCheck', function (fields) {
        return this.test('checkdebitCredit', '', function (array, v) {

            //console.log('limitting', array)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, debit = 0, credit = 0, accum = 0, delcredit = 0, deldebit = 0
                , accumdebit = 0, accumcredit = 0
            const deletelist = store.getState().auth.deletelist
            _.map(deletelist, (v, i) => {
                // // console.log(_.get(v,'amount'))
                // console.log(v)
                delcredit += _.get(v, 'credit')
                deldebit += _.get(v, 'debit')
            })
            _.map(array, (x, index) => {
                debit = x.debit
                credit = x.credit
                if (x.credit != 0 && x.debit != 0) {

                    setValue(`${this.path}[${index}].debit`, 0, { shouldDirty: true })
                    setValue(`${this.path}[${index}].credit`, 0, { shouldDirty: true })

                }

                /*   let z =  parseNumbertoString(debit) 
                   let dcm = z.indexOf('.')!== -1 && `0.${z.substring(z.indexOf('.')+1)}`
                   
                   let zAccum = parseNumbertoString(accumdebit)
                   let dcmAccum =  zAccum.indexOf('.')!== -1 && `0.${zAccum.substring(zAccum.indexOf('.')+1)}`
   
                   console.log( accumdebit,  _.floor(debit)  + parseNumber(dcm) ) 
   
                   accumdebit = _.floor(accumdebit) + parseNumber(dcmAccum) + _.floor(debit)  + parseNumber(dcm) 
    
                   console.log(accumdebit)*/
                // console.log(x.debit[index])
                accumdebit += debit
                accumcredit += credit
            })

            let totdebit = 0, totcredit = 0
            if (!_.isEmpty(deletelist)) {
                totdebit = accumdebit - deldebit
                // console.log('1',totdebit)
                totcredit = accumcredit - delcredit
                // console.log('2',totcredit,accumcredit)
                accum = totdebit - totcredit
                // console.log('3',accum)
                // accum = accumdebit - accumcredit
                // total = accum - amount
            } else {
                totdebit = accumdebit
                // console.log('1',totdebit)
                totcredit = accumcredit
                accum = accumdebit - accumcredit
            }
            // console.log(accum)
            // console.log(accum,parseFloat(accum.toFixed(3)))
            //           console.log(_.sumBy(array,(x)=>x.debit))

            // console.log(accum,accumdebit,accumcredit,parseFloat(accum.toFixed(3)))
            if (parseFloat(accum.toFixed(3)) != 0) {
                msg = `Total Debit ( ${accumdebit} ) Must be equal as Total Credit ( ${accumcredit} )`
                return !_.isEmpty(msg) ? this.createError({ path: `debitsummarydisplayonly`, message: msg }) : true;
            }

            //  console.log(getValues('totalamount'), accumdebit)
            //  console.log(getValues('totalamount')*1000000, accumdebit*1000000)

            // console.log(parseFloat(accumdebit.toFixed(3)) - getValues('totalamount'))
            if (parseFloat(accum.toFixed(3)) === 0 && parseFloat(totdebit.toFixed(3)) !== getValues('totalamount') && parseFloat(totdebit.toFixed(3)) !== 0) {
                msg = `Total Amount ( ${getValues('totalamount')} ) Must be equal as Total Debit Credit( ${totdebit} ||${totcredit}  )`
                return !_.isEmpty(msg) ? this.createError({ path: `totalamount`, message: msg }) : true;
            }

            return true;
        });

    })


    if (formValidationSchema) {
        customSchema = formValidationSchema
            /* .concat(yup.object().shape({
                userrate: yup.number().min(2, 'lebih dari 1')
            })) */
            .concat(
                yup.object().shape({
                    transdate: yup.string().settransdate(),
                    inputgrid: yup.array()
                        .debitcreditCheck(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {
    //console.log(state.auth.formValidationSchema)

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
        defaultValue: state.auth.formDefaultValue,
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)