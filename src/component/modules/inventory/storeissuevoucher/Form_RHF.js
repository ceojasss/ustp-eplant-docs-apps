import React, { useRef, useEffect } from "react"
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
import { resetLov, DialogConfirmation, resetTransaction, ShowDataLinked, fetchLovUrlPreviewArray } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, parseDatetoString } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData, ROUTES } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";


import store from "../../../../redux/reducers";
import ComponentAdaptersLinked from "../../../templates/forms/ComponentAdaptersLinked";
import { MR } from "../../../Constants";
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

const Forms = ({ title, periode, units, actions, formComp, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx, urlpreview, busy }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)


    //let doctype
    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })

    //    console.log('render form');


    const ClickHandler1 = () => {

        // console.log(methods.getValues())
        if (methods.getValues('storecode')) {
            const sivcode = encodeURIComponent(methods.getValues('sivcode'))
            const sivdate = encodeURIComponent(parseDatetoString(methods.getValues('sivdate')))
            const storecode = encodeURIComponent(methods.getValues('storecode'))



            const urls = `${ROUTES}/link?sivcode=${sivcode}&sivdate=${sivdate}&storecode=${storecode}`
            dispatch(ShowDataLinked(MR, urls))
        } else {
            alert('Warehouse No. must required')
        }
    }

    useKey('save', () => {
        //console.log('click')
        submitHandler()
    })

    useEffect(() => {


        // console.log('reset transaction', resetTrx, submitdata)

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {
                // console.log('masuk sini')
                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        // dispatch(fetchLovUrlPreview('SIV',initialValues['process_flag'],initialValues['sivcode']))
                        // let doctype=  _.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'VH' || _.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'MA' ? 'SIVSL': 'SIV' && !_.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'VH' || !_.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') ? 'SIVLX': 'SIVSL'
                        // if (doctype == 'SIVSL'){
                        // } else if (doctype == 'SIV'){
                        dispatch(fetchLovUrlPreviewArray('SIV', initialValues['process_flag'], initialValues['sivcode']))
                        dispatch(fetchLovUrlPreviewArray('SIVSL', initialValues['process_flag'], initialValues['sivcode']))
                        // } else if (doctype == 'SIVLX'){
                        dispatch(fetchLovUrlPreviewArray('SIVLX', initialValues['process_flag'], initialValues['sivcode']))
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



    let buttonForm = {
        btnLabel: 'Pilih Material Request',
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
                //customschema(obj, formComp, formComps, methods)
            }
        );


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])




    useEffect(() => {
        if (actions) {

            let data = []
            data.push(postdata)

            const submiting = { formComp, formComps, data }

            //  console.log('submit', submiting)


            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:

                    if (_.isUndefined(busy) || !busy)
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
        if (!_.isUndefined(initialValues['v_url_preview_solar'])) {
            // console.log('hehe',initialValues['v_url_preview_solar'])
            window.open(initialValues['v_url_preview_solar'])
        } else {
            window.open(_.get(urlpreview[1], 'v_url_preview'))
        }
    }

    const handlerReportLx = () => {
        // console.log(_.get(urlpreview[0],'v_url_preview'))
        if (!_.isUndefined(initialValues['v_url_preview_lx'])) {
            // console.log('hehe',initialValues['v_url_preview_solar'])
            window.open(initialValues['v_url_preview_lx'])
        } else {
            window.open(_.get(urlpreview[2], 'v_url_preview'))
        }
    }



    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    let buttonReport
    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.includes(_.get(urlpreview[0], 'v_url_preview'), 'RPT_BMK.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_BMK.RDF')) || (!_.isEmpty(urlpreview) ? _.includes(_.get(urlpreview[0], 'v_url_preview'), 'rpt_bmk.RDF') : _.includes(initialValues['v_url_preview'], 'rpt_bmk.rdf'))) {
        // console.log('1')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReport,
        },
        {
            btnTitle: 'View Report Solar',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReportSolar,
            // hidden:'none'
        },
        {
            btnTitle: 'View Report LX',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReportLx,
            // hidden:'none'
        }
        ]
    } /*else 
    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && ( !_.isEmpty(urlpreview) ? _.get(urlpreview[0],'v_url_preview').match('SOLAR') : _.includes(initialValues['v_url_preview'],'SOLAR')) ){
            // console.log('2')
            
            buttonReport = [{
                btnTitle:'View Report',
                btnIcon: 'file pdf outline',
                reportHandler: handlerReport,
            },
            {
                btnTitle:'View Report Solar',
                btnIcon: 'file pdf outline',
                reportHandler: handlerReportSolar,
                // hidden:'none'
            },
            {
                btnTitle:'View Report LX',
                btnIcon: 'file pdf outline',
                reportHandler: handlerReportLx,
                // hidden:'none'
            }
            ]
        } 
        else {
            // console.log('3')
            buttonReport = [{
                btnTitle:'View Report',
                btnIcon: 'file pdf outline',
                hidden:'none'
            },
            {
                btnTitle:'View Report Solar',
                btnIcon: 'file pdf outline',
                hidden:'none'
                // hidden:'none'
            },
            {
                btnTitle:'View Report LX',
                btnIcon: 'file pdf outline',
                hidden:'none'
                // hidden:'none'
            }
            ]
    }*/



    const RenderForm = React.memo(() => {

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        //      let defaultDataValue = { ...initialValues }
        let defaultDataValue = { [documentkey]: initialValues[documentkey] }

        // console.log(defaultDataValue)


        return (
            <Segment raised className="form-container">
                <FormUI as={'form'} style={{ marginTop: '0px', marginBottom: '50px' }}>
                    <FormProvider {...methods} raised  >
                        <ComponentAdaptersLinked
                            key="0.componentgroupheader"
                            formRefs={formRefs}
                            methods={methods}
                            defaultDataValue={defaultDataValue}
                            postAction={postAction}
                            handler1={buttonForm}
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
            /* .concat(yup.object().shape({
                userrate: yup.number().min(2, 'lebih dari 1')
            })) */
            .concat(
                yup.object().shape({
                    inputgrid: yup.array()
                        .debitcreditCheck(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {
    // console.log(state.auth.urlpreviewarray)

    //   console.log(state.auth.modals)
    return {
        urlpreview: state.auth.urlpreviewarray,
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComp: getFormComponent(),
        formComps: getFormListComponent(),
        busy: state.auth.modals.busy,
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        formValidationSchema: state.auth.formValidationSchema,
        actionlabel: state.auth.actionlabel,
        resetTrx: state.auth.resetTrx,
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)