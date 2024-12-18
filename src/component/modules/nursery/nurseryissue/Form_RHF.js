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


    const resolver = useYupValidationResolver(formValidationSchema);

    // console.log(initialValues)

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype



    const generateData = async (cb) => {

        const key_doc = methods.control._formValues.mrcode


        //   if (_.isEmpty(key_doc)) {

        //  toast.warning("Request Code Is Required")


        //  return;
        //   }

        //   console.log(methods.getValues('requestno'))

        if (!_.isEmpty(key_doc) && _.size(methods.control._formValues.inputgrid) === 0) {

            // await dispatch(DialogLoading())



            await dispatch(fetchDataGenerate(key_doc, () => {
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
                        dispatch(fetchLovUrlPreview('NI', initialValues['process_flag'], initialValues['sivcode']))
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


    // console.log(urlpreview)
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
    // console.log(!_.isUndefined(initialValues['v_url_preview']?initialValues['v_url_preview'].match('SOLAR'):''))

    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('rpt_nursery_issue.rdf') : _.includes(initialValues['v_url_preview'], 'rpt_nursery_issue.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_NURSERY_ISSUE.rdf') : _.includes(initialValues['v_url_preview'], 'RPT_NURSERY_ISSUE.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_NURSERY_ISSUE.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_NURSERY_ISSUE.RDF'))) {
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
    const { setValue, getValues } = methods

    let validationSchems = {}



    yup.addMethod(yup.string, "setendbalqty",
        function setendbalqty() {
            return this.test((value, values) => {


                // console.log(getValues('authorization'))

                if (!_.isUndefined(getValues('inputgrid[0]'))){
                    // console.log(_.size(getValues('inputgrid')))
                    // for (let i = 0; i < _.size(getValues('inputgrid')); i++) {
                        
                    // }
                    for (let i = 0; i < _.size(getValues('inputgrid')); i++) {
                        if (getValues(`inputgrid[${i}].quantity`) >= getValues(`qtyrequestdisplayonly`)) {
                            if (getValues(`inputgrid[${i}].quantity`) >= getValues(`inputgrid[${i}].begbalqty`) ){
                                const value = getValues(`inputgrid[${i}].begbalqty`)
                                setValue(`inputgrid[${i}].quantity`,value , { shouldDirty: true })
                            } else {
                            const value = getValues(`qtyrequestdisplayonly`)
                            setValue(`inputgrid[${i}].quantity`,value , { shouldDirty: true })

                        }
                        } else 
                        if (getValues(`inputgrid[${i}].quantity`) >= getValues(`inputgrid[${i}].begbalqty`) ){
                            // console.log('hehe')
                            const value = getValues(`inputgrid[${i}].begbalqty`)
                            setValue(`inputgrid[${i}].quantity`,value , { shouldDirty: true })
                        }

                        if (!_.isUndefined(getValues(`inputgrid[${i}].begbalqty`))){

                            const endbalqty = getValues(`inputgrid[${i}].begbalqty`) - getValues(`inputgrid[${i}].quantity`) 
                            // console.log(amount)
                            setValue(`inputgrid[${i}].endbalqty`, endbalqty, { shouldDirty: true })
                        } else {
                            setValue(`inputgrid[${i}].endbalqty`, 0, { shouldDirty: true })
                        }
                        // if (!_.isUndefined(getValues(`inputgrid[${i}].begbalqty`))){
                            // const endbalqty = getValues(`inputgrid[${i}].begbalqty`) - getValues(`inputgrid[${i}].quantity`) 
                            // console.log(amount)
                            // setValue(`inputgrid[${i}].endbalqty`, endbalqty, { shouldDirty: true })
                        // } else {
                            // setValue(`inputgrid[${i}].endbalqty`, 0, { shouldDirty: true })
                        // }
                    }
 
                }
                return true

            })
        }
    )



    customSchema = formValidationSchema
        .concat(
            yup.object().shape({
                endbalqty: yup.string().setendbalqty(),
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