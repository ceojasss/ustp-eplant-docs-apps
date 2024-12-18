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

        const nomorspb = methods.control._formValues.nomorspb
        // const progressdate = methods.control._formValues.wipdate
        // const progressno = methods.control._formValues.documentno


        //   if (_.isEmpty(key_doc)) {

        //  toast.warning("Request Code Is Required")


        //  return;
        //   }

        //   // console.log(methods.getValues('requestno'))

        if (!_.isEmpty(nomorspb) && _.size(methods.control._formValues.inputgrid) === 0) {

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
                        // dispatch(fetchLovUrlPreview('PV', '', initialValues['vouchercode']))
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
            if (!_.isNull(submitdata)) {
                if (!_.isNull(submitdata.approvedate))
                    window.open(initialValues['v_url_preview'].replace('_DRAFT', ''))
            } else {
                window.open(initialValues['v_url_preview'])
            }
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
    yup.addMethod(yup.array, 'disabledCom', function (fields) {
        return this.test('disabledCom', 'disabledCom', function (array, val) {

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
                        // console.log(v)
                        if (v.uomdisplayonly == 'JJG'){
                            setValue(`${this.path}[${[index]}].berat`, null,{ shouldDirty: true })
                        } else if (v.uomdisplayonly == 'KG'){
                            setValue(`${this.path}[${[index]}].jumlah`, null,{ shouldDirty: true })
                        }
                        // setValue(`${this.path}[${[index]}].spbdisplayonly`, getValues('nomorspb'),{ shouldDirty: true })
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

    yup.addMethod(yup.array, 'spbno', function (fields) {
        return this.test('spbno', 'spbno', function (array, val) {

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
                        setValue(`${this.path}[${[index]}].spbdisplayonly`, getValues('nomorspb'),{ shouldDirty: true })
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




    if (formValidationSchema) {
        customSchema = formValidationSchema
            .concat(
                yup.object().shape({
                    inputgrid: yup.array().spbno().disabledCom(),
                    // destination: yup.string().checkdestination()
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {
    // console.log(state.auth)
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