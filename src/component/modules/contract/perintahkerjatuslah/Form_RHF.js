import '../../../Public/CSS/App.css'
import React, { useRef, useEffect, useMemo } from "react"
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
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, parseFullDatetoString, getFormSubListComponent, InitValidationMixedSub } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData, fetchDataGenerate, isiBBM } from "./FormAction";

import { GENERATE_DATA, GENERATE_SUBDETAIL, RESET_MODAL, SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";



import store from "../../../../redux/reducers";
import { useKey } from "../../../../utils/ShortcutKeyHelper";
import { randomIds } from '../../../../utils/DataHelper';
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

const Forms = ({ title, actions, formComp, formComps, formSubComps, initialValues, postdata, formValidationSchema,
    executegenerate, submitdata, actionlabel, resetTrx, urlpreview, modalsstate }) => {
    // console.log(initialValues)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();
    const actionDetailRef = useRef();
    const postAction = loc.pathname.split('/').pop()

    //console.log(formValidationSchema);

    const resolver = useYupValidationResolver(formValidationSchema);

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })

    let buttonReport

    const generateData = async (cb) => {

        const key_doc = methods.control._formValues.requestno

        if (!_.isEmpty(key_doc) && _.size(methods.control._formValues.inputgrid) === 0) {


            await dispatch(fetchDataGenerate(key_doc, () => {
                // dispatch(submitlinkdata(linkData))
            }))

            if (cb) cb()
        }
    }


    const generateDetail = async (v, cb) => {
        await dispatch(isiBBM(v))

        if (cb)
            cb()
    }

    useKey('save', () => { submitHandler() })

    useEffect(() => {
        if (_.isEmpty(formComp))
            navigate('../')

        InitValidationMixedSub(postAction,
            (obj) => {
                customschema(obj, formComp, formComps, methods)
            }
        );

        return () => {
            dispatch(resetLov())
        };

    }, [navigate])


    useEffect(() => {

        if (executegenerate)
            generateData(() => { dispatch({ type: GENERATE_DATA, payload: false }) })

        return () => {
            dispatch({ type: GENERATE_DATA, payload: false })
        }
    }, [executegenerate])



    useEffect(() => {

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {

                setTimeout(() => {
                    methods.reset(submitdata)

                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        dispatch(fetchLovUrlPreview('CAT', initialValues['process_flag'], initialValues['agreementcode']))
                    }
                }, 0.1);
            } else {
                setTimeout(() => { methods.reset(methods.getValues()) }, 0.1);
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

            const submiting = { formComp, formComps, formSubComps, data }

            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))

                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting, (v) => {
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                            resetTransaction(true)
                        }
                    }))
                    break;
                default:
                    break;
            }

        }
    }, [actions])

    useEffect(() => {

        if (modalsstate.contentType && modalsstate.contentType === Appresources.TRANSACTION_ALERT.INPUT_ON_DIALOG) {

            const { item } = modalsstate.lovdata

            const minVal = methods.getValues('pricebbm_start')
            const maxVal = methods.getValues('pricebbm_end')
            const range = methods.getValues('pricerange')

            let minLoopVal = minVal

            let ranges = []

            if (_.isEmpty(item.agreementcode)) {
                //  alert('error')

                toast.error('Terjadi Kesalahan, Refresh Atau Kembali Ke Halaman Utama', {
                    onOpen: () => dispatch({ type: RESET_MODAL }),
                    autoClose: 2000,
                    hideProgressBar: false,
                    position: toast.POSITION.TOP_CENTER,
                    pauseOnHover: true,
                    theme: 'colored'
                    // and so on ...
                })


            }
            else {



                if (_.size(item.inputgriddetail) === 0) {

                    while (minLoopVal < maxVal) {

                        ranges.push({
                            agreementcode: item.agreementcode,
                            lineno: item.lineno,
                            tid: randomIds(),
                            mulai: minLoopVal,
                            akhir: minLoopVal + range,
                            hargaavg: Math.floor(((minLoopVal + range) + minLoopVal) / 2)

                        })

                        minLoopVal += range + 1
                    }

                    generateDetail(ranges,/*() => { dispatch({type: GENERATE_SUBDETAIL, payload: false})} */)


                }
            }
        }

        return () => {
            dispatch({
                type: GENERATE_SUBDETAIL, payload: false
            })
        }
    }, [modalsstate])


    const RenderForm = () => {

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
    }


    if (!formComp || formComp.length === 0)
        return <LoadingStatus />


    const submitHandler = () => formRefs.current((data, object) => {

        /*
         * 1. Set post Data. 
         *    Jika action UPDATE maka data ditambahkan rowid,
         * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
        */


        //  console.log(methods.control._formValues)
        //      dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, object, data))


        //        let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })


        dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))
    })


    // console.log(urlpreview)
    const handlerReport = () => {

        if (!_.isUndefined(initialValues['v_url_preview'])) {
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


    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('contractorder.rdf') : _.includes(initialValues['v_url_preview'], 'contractorder.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('CONTRACTORDER.RDF') : _.includes(initialValues['v_url_preview'], 'CONTRACTORDER.RDF'))) {
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


    yup.addMethod(yup.string, "setAuthDate",
        function authDate() {
            return this.test((value, values) => {


                // console.log(getValues('authorization'))

                if (getValues('authorization') === '1') {
                    setValue('authorizationdate', new Date(), { shouldDirty: true })
                }
                else {
                    setValue('authorizationdate', null, { shouldDirty: true })

                }
                return true

            })
        }
    )


    yup.addMethod(yup.number, 'checkRangeHarga', function (fields) {
        return this.test('checkRangeHarga', '', function (valus, v) {
            let start = getValues('pricebbm_start')
            let end = getValues('pricebbm_end')



            if (end < start) {
                let msg = 'Invalid Range'

                return this.createError({ path: v.path, message: msg })
            }

            return true
        });

    })


    //    console.log('custom schema test', formValidationSchema)



    customSchema = formValidationSchema
        .concat(
            yup.object().shape(
                {
                    pricebbm_start: yup.number().checkRangeHarga(),
                    pricebbm_end: yup.number().checkRangeHarga(),
                }
            ))




    if (!_.isEmpty(customSchema))
        store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {

    // console.log(state.auth.submitdata)

    return {
        urlpreview: state.auth.urlpreview,
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComp: getFormComponent(),
        formComps: getFormListComponent(),
        formSubComps: getFormSubListComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        formValidationSchema: state.auth.formValidationSchema,
        actionlabel: state.auth.actionlabel,
        resetTrx: state.auth.resetTrx,
        executegenerate: state.auth.generate_execute,
        modalsstate: state.auth.modals

    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)