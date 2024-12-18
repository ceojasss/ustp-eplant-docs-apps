import React, { useRef, useEffect } from "react"
import { useDispatch, connect } from 'react-redux'
import * as yup from 'yup'

import { Form as FormUI, Segment } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import { useNavigate, useLocation } from "react-router-dom";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { resetLov, DialogConfirmation, resetTransaction, fetchLovUrlPreviewArray, ShowDataLinkedHeader, fetchLovUrlPreview } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, parseDatetoString } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData, ROUTES } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";


import store from "../../../../redux/reducers";
import ComponentAdaptersLinked from "../../../templates/forms/ComponentAdaptersLinked";
import { PC, PR } from "../../../Constants";

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

    //    console.log('render form');


    const ClickHandler1 = () => {


        const agreementcode = encodeURIComponent(methods.getValues('agreementcode'))
        // const approvedate = encodeURIComponent(parseDatetoString(methods.getValues('approvedate')))
        // const urls = `${ROUTES}/link?vouchercode=${vouchercode}&approvedate=${approvedate}`

        const urls = `${ROUTES}/link?agreementcode=${agreementcode}`

        dispatch(ShowDataLinkedHeader('Contract Invoice', urls, 'progressno'))
    }



    let buttonForm = {
        btnLabel: 'Pilih Document',
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
                customschema(obj, formComp, formComps, methods)
            }
        );


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])



    useEffect(() => {


        // console.log('reset transaction', resetTrx, submitdata)

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {

                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(submitdata.inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }
                const viewData = _.omit(submitdata, _.filter(_.keys(submitdata), x => (x.includes('displayonly'))))

                // console.log('masuk sini 2', viewData)

                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {

                        // doctype=  _.get(submitdata['inputgrid'][0]['itemcode'],'code').match('06010002') ? 'POSLR':'PO'
                        // if (doctype == 'POSLR' ){
                            dispatch(fetchLovUrlPreview('PV', '', initialValues['vouchercode']))
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
        // // console.log('hehe',initialValues['v_url_preview'])
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        // // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            // // console.log('1')
            if (!_.isEmpty(submitdata)) {
                // // console.log('2')
                if (!_.isNull(submitdata.approvedate)) {
                    window.open(initialValues['v_url_preview'].replace('_DRAFT', ''))
                } else {
                    window.open(initialValues['v_url_preview'])
                }
            } else {
                window.open(initialValues['v_url_preview'])
            }
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }

    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PAYMENT_VOUCHER_R01_DRAFT.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PAYMENT_VOUCHER_R01_DRAFT.rdf') : _.includes(initialValues['v_url_preview'], 'RPT_PAYMENT_VOUCHER_R01_DRAFT.rdf'))) {
        // // console.log('1')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReport,
        },
        {
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            // reportHandler: handlerReport,
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

const customschema = (formValidationSchema, formComp, formComps, methods) => {

    let customSchema
    const { setValue, getValues } = methods

    let validationSchems = {}

    /*  customSchema = formValidationSchema
         .concat(
             yup.object().shape({            })) */

    //  console.log(customSchema.fields.concat.setAuthDate())

    /* if (formValidationSchema) {
    
        console.log('customSchema')
    
        customSchema = formValidationSchema
            .concat(yup.object().setAuthDate())
    } */
    //
    // console.log(customSchema)

    if (!_.isEmpty(customSchema))
        store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {

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