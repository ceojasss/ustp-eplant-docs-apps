import React, { useRef, useEffect } from "react"
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
import { resetLov, DialogConfirmation, resetTransaction, fetchLovUrlPreview } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData, fetchDataGenerate } from "./FormAction";
import '../../../Public/CSS/App.css'
import { GENERATE_DATA, SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

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

const Forms = ({ title, periode, units, actions, formComp, formComps, initialValues, postdata, formValidationSchema,
    executegenerate, submitdata, actionlabel, resetTrx, urlpreview }) => {
    // console.log(initialValues)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    let buttonReport
    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)

    useEffect(() => {
        if (_.isEmpty(formComp))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationMixed(postAction,
            (obj) => {
                // if(actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE){
                    customschema(obj, formComp, formComps, methods)
                // }
            }
        );


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])
    const resolver = useYupValidationResolver(formValidationSchema);

    // console.log(initialValues)

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype



    const generateData = async (cb) => {

        const key_doc = methods.control._formValues.agreementcode
        const progressdate = methods.control._formValues.wipdate
        const progressno = methods.control._formValues.documentno


        //   if (_.isEmpty(key_doc)) {

        //  toast.warning("Request Code Is Required")


        //  return;
        //   }

        //   console.log(methods.getValues('requestno'))

        if (!_.isEmpty(key_doc) && _.size(methods.control._formValues.inputgrid) === 0) {

            // await dispatch(DialogLoading())

            // console.log( methods.control._formValues)

            await dispatch(fetchDataGenerate(key_doc,progressno,progressdate, () => {
                // dispatch(submitlinkdata(linkData))
            }))   



            if (cb) cb()

        }
    }



    useKey('save', () => {
        // console.log('click')
        submitHandler()
    })



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


        // console.log('reset transaction', resetTrx, submitdata)

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
                        dispatch(fetchLovUrlPreview('WP', initialValues['process_flag'], initialValues['documentno']))
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

            // \\ console.log('submit', submiting)


            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))

                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                     dispatch(updateData(submiting))
                    // dispatch(updateData(submiting, (v) => {
                    //     //console.log(v)
                    //     if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                    //         // dispatch({ type: SET_TRANSACTION_STATUS, payload: STATUS_SAVED })
                    //         resetTransaction(true)
                    //     }

                    // }))
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
// let test = 'http://10.20.10.35:8889/reports/rwservlet?EPMS_GCM&destype=CACHE&desformat=PDF&report=RPT_CONTRACT_PROGRESS.RDF&P_DOCNO=GCM/WP/2307/00793'
// console.log(initialValues['v_url_preview'],test.concat(`&P_AGREEMENT=${_.get(initialValues['agreementcode'],'code')}&P_CONTRACTOR=${_.get(initialValues['contractordisplayonly'],'code')}`))
// console.log(_.concat('http://10.20.10.35:8889/reports/rwservlet?EPMS_GCM&destype=CACHE&desformat=PDF&report=RPT_CONTRACT_PROGRESS.RDF&P_DOCNO=GCM/WPHO/2307/00300',`&P_AGREEMENT=${_.get(initialValues['agreementcode'],'code')}&P_CONTRACTOR=${_.get(initialValues['contractordisplayonly'],'code')}`))
    // console.log(urlpreview)
    const handlerReport = () => {
        // console.log(_.get(urlpreview[0],'v_url_preview'))
        // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview').concat(`&P_AGREEMENT=${_.get(methods.control._formValues['agreementcode'],'code')}&P_CONTRACTOR=${_.get(methods.control._formValues['contractordisplayonly'],'code')}`))
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
// console.log(methods.control._formValues)

    // console.log(!_.isUndefined(urlpreview) ? _.uniqWith(_.get(urlpreview[0],'v_url_preview'),'SOLAR') :'')
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }
    // console.log(!_.isUndefined(initialValues['v_url_preview']?initialValues['v_url_preview'].match('SOLAR'):''))

    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('rpt_contract_progress.rdf') : _.includes(initialValues['v_url_preview'], 'rpt_contract_progress.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_CONTRACT_PROGRESS.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_CONTRACT_PROGRESS.RDF'))) {
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

    // console.log(!_.isUndefined(postdata['inserts'])?(postdata['inserts'])[0]:'')
    //   console.log(actions, formComp, formComps, initialValues, postdata, formValidationSchema, submitdata)

    //  console.log('compss', formComp)

    const RenderForm = React.memo(() => {

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        //      let defaultDataValue = { ...initialValues }
        let defaultDataValue = { [documentkey]: initialValues[documentkey] }



        return (
            <Segment raised className="form-container">
                <FormUI as={'form'} style={{ marginTop: '0px', marginBottom: '50px' }}>

                    <ComponentAdaptersMixed
                        key="0.componentgroupheader"
                        formRefs={formRefs}
                        methods={methods}
                        defaultDataValue={defaultDataValue}
                        postAction={postAction}
                    />
                </FormUI>
            </Segment>
        )
    })


    return (
        <FormProvider {...methods}   >
            <ContentHeader
                title={title}
                btn1={button}
                btn2={buttonReport}
                children={<RenderForm />} />
        </FormProvider>
    );

}



const customschema = (formValidationSchema, formComp, formComps, methods) => {

    let customSchema
    const { setValue, getValues,formState } = methods

    let validationSchems = {}


    yup.addMethod(yup.array, 'wipdate', function (fields) {
        return this.test('wipdate', 'wipdate', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, awal = 0, akhir = 0, accum = 0, accumdebit = 0, errors = []

            let st = store.getState()

            //          console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)

                //      console.log(v.tid)

                //                console.log('cek', v.tid, st.auth.deletelist, _.find(st.auth.deletelist, ['tid', v.tid]))

                // if (_.find(st.auth.deletelist, ['tid', v.tid]))
                //     return;
                // console.log(getValues('wipdate'))


                if (_.isUndefined(v.wipdate)) {
                    // errors.push(index)
                    setValue(`${this.path}[${[index]}].wipdate`, getValues('wipdate'), { shouldDirty: true })
                    // return;
                }
            })

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].wipdate`, getValues('wipdate'), { shouldDirty: true })

                return this.createError(
                    // { path: `${this.path}[${errors[0]}].from_time`, message: 'invalid time' }
                )
            }

        });

    })


    yup.addMethod(yup.array, 'description', function (fields) {
        return this.test('description', 'description', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, awal = 0, akhir = 0, accum = 0, accumdebit = 0, errors = []

            let st = store.getState()

            //          console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)

                //      console.log(v.tid)

                //                console.log('cek', v.tid, st.auth.deletelist, _.find(st.auth.deletelist, ['tid', v.tid]))

                // if (_.find(st.auth.deletelist, ['tid', v.tid]))
                //     return;
                // console.log(getValues('wipdate'))

                // console.log(formState.isDirty)
                
                // if (_.isUndefined(v.wipdate)) {
                    // if(formState.isDirty == true){

                        // errors.push(index)
                        // console.log('1')
                        setValue(`${this.path}[${[index]}].description`, getValues('description'),{ shouldDirty: true })
                    // }
                    // return;
                // }
            })

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].wipdate`, getValues('wipdate'), { shouldDirty: true })

                return this.createError(
                    // { path: `${this.path}[${errors[0]}].from_time`, message: 'invalid time' }
                )
            }

        });

    })

    yup.addMethod(yup.array, 'volcurrent', function (fields) {
        return this.test('volcurrent', 'volcurrent', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, awal = 0, akhir = 0, accum = 0, accumdebit = 0, errors = [], totalFix=[]

            let st = store.getState()

            //          console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)
                total = v.volumedisplayonly-v.unitdisplayonly
                // console.log(total)
                //      console.log(v.tid)

                //                console.log('cek', v.tid, st.auth.deletelist, _.find(st.auth.deletelist, ['tid', v.tid]))

                // if (_.find(st.auth.deletelist, ['tid', v.tid]))
                //     return;
                // console.log(getValues('wipdate'))

                // console.log(formState.isDirty)
                
                if (v.qty > total.toFixed(3)) {
                    // if(formState.isDirty == true){

                    setValue(`${this.path}[${index}].qty`, total, { shouldDirty: true })
                        // errors.push(index)
                        // totalFix.push(total)
                        // console.log('1',totalFix)
                        // console.log('1')
                        // setValue(`${this.path}[${[index]}].description`, getValues('description'))
                    }
                    // return;
                // }
            })
            // console.log('2',_.find(totalFix))
            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].qty`, _.find(totalFix), { shouldDirty: true })

                return this.createError(
                    // { path: `${this.path}[${errors[0]}].from_time`, message: 'invalid time' }
                )
            }

        });

    })


    yup.addMethod(yup.array, 'qtyreq', function (fields) {
        return this.test('qtyreq', 'qtyreq', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, awal = 0, akhir = 0, accum = 0, accumdebit = 0, errors = []

            let st = store.getState()

            //          console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)
                // console.log(v.qty)
                // total = v.volumedisplayonly-v.unitdisplayonly
                //      console.log(v.tid)

                //                console.log('cek', v.tid, st.auth.deletelist, _.find(st.auth.deletelist, ['tid', v.tid]))

                // if (_.find(st.auth.deletelist, ['tid', v.tid]))
                //     return;
                // console.log(getValues('wipdate'))

                // console.log(formState.isDirty)
                
                if (_.isUndefined(v.qty) || _.isNull(v.qty)) {
                    // if(formState.isDirty == true){

                        errors.push(index)
                        // console.log('1')
                        // setValue(`${this.path}[${[index]}].description`, getValues('description'))
                    }
                    // return;
                // }
            })

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].qty`, total, { shouldDirty: true })

                return this.createError(
                    { path: `${this.path}[${errors[0]}].qty`, message: 'Required' }
                )
            }

        });

    })


    customSchema = formValidationSchema
        .concat(
            yup.object().shape({
                inputgrid: yup.array()
                    .wipdate().description().volcurrent().qtyreq()
                // wipdate: yup.string().wipdate(),
            }))

    if (!_.isEmpty(customSchema))
        store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {

    // console.log(state)

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