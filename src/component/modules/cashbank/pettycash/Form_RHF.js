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

import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_GRID_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

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

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    const postAction = loc.pathname.split('/').pop()



    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype
    //    console.log('render form');

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

    useKey('save', () => {
        // console.log('click')
        submitHandler()
    })

    useEffect(() => {


        // console.log('reset transaction', resetTrx, submitdata)

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {


                const viewData = _.omit(submitdata, _.filter(_.keys(submitdata), x => (x.includes('displayonly'))))

                // console.log('masuk sini 2', viewData)

                setTimeout(() => {
                    methods.reset(viewData)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        // if (_.isEmpty(submitdata['inputgrid'])){

                        // } else {
                        //     doctype = 'MRSLR'
                        // }
                        // console.log(doctype)
                        dispatch(fetchLovUrlPreview('PC', '', initialValues['vouchercode']))
                    }
                }, 0.1);


            } else {
                console.log('masuk sini aja')

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
            // if (!_.isNull(submitdata)) {
                // if (!_.isNull(submitdata.approvedate))
                    // window.open(initialValues['v_url_preview'].replace('_DRAFT', ''))
            // } else {
                window.open(initialValues['v_url_preview'])
            // }
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }

    // if (!_.isNull(submitdata)){

    //     console.log(submitdata.approvedate)
    // }
    // console.log(initialValues['v_url_preview'].replace('_DRAFT',''))
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    let buttonReport
    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PETTY_CASH.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PETTY_CASH.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PETTY_CASH.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PETTY_CASH.RDF')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PETTY_CASH.rdf') : _.includes(initialValues['v_url_preview'], 'RPT_PETTY_CASH.rdf'))) {
        // console.log('1')
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
    yup.addMethod(yup.array, 'isReferenceLov', function (fields) {
        return this.test('isReferenceLov', '', function (array, v) {

            //console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0

            _.map(array, (x, index) => {
                if (isFieldLov([x.locationtype.code, x.locationcode.code, x.jobcode.code])) {
                    console.log(index)

                    return true;
                }
                //      console.log(x.jobcode, x.locationcode, x.locationtype)
            })

            return true;
        });

    })

    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'totalAmountCheck', function (fields) {
        return this.test('totalAmountCheck ', '', function (array, v) {

            //console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0
            const totalAmount = getValues('totalamount')

            _.map(array, (x, index) => {
                accum += x.amount
            })

            //    console.log(_.isNil(accum), _.isNil(totalAmount))
            //  console.log(accum, totalAmount)

            if (_.isNil(accum) || _.isNil(totalAmount)) {
                return true;
            } else {
                if (accum !== totalAmount) {
                    msg = 'Invalid Amount'//'Total Amount Not Match with Sum Amount'
                    return !_.isEmpty(msg) ? this.createError({ path: `totalamount`, message: msg }) : true;
                }
            }


            return true;
        });

    })
    yup.addMethod(yup.string, "checkCurrency",
        function checkCurrency() {
            return this.test((value, values) => {


                // console.log(getValues('authorization'))
                if (getValues('currency') == 'IDR') {
                    // console.log('1')
                    setValue(`rate`, 1, { shouldDirty: true })
                }
                else if (getValues('currency') !== 'IDR') {
                    if (getValues('rate') == 0) {
                        setValue('rate', null, { shouldDirty: true })
                    } else if (getValues('rate') == 1) {
                        setValue('rate', null, { shouldDirty: true })
                    }
                    //  console.log('2')
                    // setValue('rate', null, { shouldDirty: true })
                }
                return true

            })
        }
    )


    if (formValidationSchema) {
        customSchema = formValidationSchema
            .concat(
                yup.object().shape({
                    inputgrid: yup.array()
                        .totalAmountCheck(_.keys(_.pickBy(formComps, (x) => { return x.isunique }))),
                    currency: yup.string().checkCurrency()
                }))

    }

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