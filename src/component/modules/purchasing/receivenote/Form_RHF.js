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
import { resetLov, DialogConfirmation, DialogCrudConfirmation, resetTransaction, ShowData, ShowDataLinked, fetchLovUrlPreview, fetchLovUrlPreviewArray } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, parseDatetoString } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData, ROUTES } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";



import store from "../../../../redux/reducers";
import ComponentAdaptersLinked from "../../../templates/forms/ComponentAdaptersLinked";
import { PO, PR, PREFIX_EDIT, VH } from "../../../Constants";
import { useKey } from "../../../../utils/ShortcutKeyHelper";


/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Andi Firdana Setiawan
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


    // console.log(actions)
    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype
    const ClickHandler1 = () => {

        if (methods.getValues('pocode') && methods.getValues('suppliercode')) {
            const receivenotecode = methods.getValues('receivenotecode')
            // const pocode = encodeURIComponent(methods.getValues('pocode'))
            const pocode = methods.getValues('pocode')
            //   // console.log(pocode)
            const urls = `${ROUTES}/link?pocode=${pocode}&receivenotecode=${receivenotecode}`
            dispatch(ShowDataLinked(PR, urls))
        } else {
            alert('Purchase Order Or Supplier must required')
        }
    }



    let buttonForm = {
        btnLabel: 'Pilih Purchase Request',
        btnIcon: 'copy outline',
        addClickHandler: ClickHandler1
    }


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


    useKey('save', () => {
        // console.log('click')
        submitHandler()
    })

    useEffect(() => {


        ///// console.log('reset transaction', resetTrx, submitdata)
        // // console.log(initialValues['v_url_preview']);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      bbbbbbbbb

        if (resetTrx) {
            if (!_.isEmpty(submitdata)) {
                // // console.log('masuk sini')
                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        dispatch(fetchLovUrlPreviewArray('GRN', initialValues['process_flag'], initialValues['receivenotecode']))
                        dispatch(fetchLovUrlPreviewArray('GRNR', initialValues['process_flag'], initialValues['receivenotecode']))

                    }
                }, 0.1);
            } else {
                // // console.log('masuk sini aja')

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

            // // console.log('submit', submiting)


            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))

                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting, (v) => {
                        // // console.log(v)
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


        // // console.log(data, object)
        //      dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, object, data))


        //        let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })
        dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))
    })

    // useKey('save', () => {
    //     // // console.log('click')
    //     submitHandler()
    // })
    const handlerReport = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        // // console.log(initialValues['v_url_preview'])
        // // console.log(urlpreview)
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }
    const handlerReportBPB = () => {
        // // console.log(urlpreview)
        // // console.log(initialValues['v_url_preview_bpb'])
        if (!_.isUndefined(initialValues['v_url_preview_bpb'])) {
            window.open(initialValues['v_url_preview_bpb'])
        } else {
            window.open(_.get(urlpreview[1], 'v_url_preview'))
        }
    }

    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }
    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_BPB_SIGN.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_BPB_SIGN.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[1], 'v_url_preview').match('rpt_bpb_sign.RDF') : _.includes(initialValues['v_url_preview'], 'rpt_bpb_sign.RDF'))) {
        // // console.log('1')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReport,
        },
        {
            btnTitle: 'View Report BPB',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReportBPB,
            // hidden: 'none'
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

    let validationSchems = {}
    const ROUTES = '/purchasing/Trx/receivenote'


    yup.addMethod(yup.string, "setAmount",
        function authAmount() {
            return this.test((value, values) => {
                // // console.log(control)
                // // console.log(getValues('inputgrid[0].quantity'))
                // // console.log(getValues('authorized'))
                if (!_.isUndefined(getValues('inputgrid[0]'))) {
                    // // console.log(_.size(getValues('inputgrid')))
                    for (let i = 0; i < _.size(getValues('inputgrid')); i++) {
                        const amount = getValues(`inputgrid[${i}].quantity`) * getValues(`inputgrid[${i}].unitpricedisplayonly`)
                        // // console.log(amount)
                        setValue(`inputgrid[${i}].amountreceived`, amount, { shouldDirty: true })
                    }

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

                if (!_.isUndefined(v.purchaseitemcode) && _.isUndefined(v.karung)) {
                        eplant.get(`${ROUTES}/getsack?itemcode=${v.purchaseitemcode}`).then(res => {
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
                amountreceived: yup.string().setAmount(),
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
    //  // console.log(state.auth)

    return {
        urlpreview: state.auth.urlpreviewarray,
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