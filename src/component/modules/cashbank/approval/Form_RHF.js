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
    //  resetTransaction(false)

    // // console.log(initialValues,submitdata)

    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype
    //    // console.log('render form');

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


        // // console.log('reset transaction', resetTrx, submitdata)

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {

                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(submitdata.inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }
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
                        dispatch(fetchLovUrlPreview('PV', '', initialValues['vouchercode']))
                    }
                }, 0.1);


            } else {
                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(methods.getValues().inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }
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
                    dispatch(updateData(submiting))
                    // dispatch(updateData(submiting, (v) => {
                    //     //// console.log(v)
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


        //    // console.log(data, object)
        //      dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, object, data))


        //        let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })
        dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))
    })

    // // console.log(urlpreview)
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

    // if (!_.isNull(submitdata)){

    //     // console.log(submitdata.approvedate)
    // }
    // // console.log(initialValues['v_url_preview'].replace('_DRAFT',''))
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    let buttonReport
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

            //// console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0

            _.map(array, (x, index) => {
                if (isFieldLov([x.locationtype.code, x.locationcode.code, x.jobcode.code])) {
                    // console.log(index)

                    return true;
                }
                //      // console.log(x.jobcode, x.locationcode, x.locationtype)
            })

            return true;
        });

    })

    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'totalAmountCheck', function (fields) {
        return this.test('totalAmountCheck ', '', function (array, v) {

            //// console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0, total = 0
            const totalAmount = getValues('totalamount')
            const deletelist = store.getState().auth.deletelist
            _.map(deletelist, (v, i) => {
                // // console.log(_.get(v,'amount'))
                amount += _.get(v, 'amount')
            })
            _.map(array, (x, index) => {
                // if(!_.isEmpty(deletelist)){

                // accum += x.amount
                // } else {

                accum += x.amount
                // }
            })
            // // console.log(accum , totalAmount , amount)
            if (!_.isEmpty(deletelist)) {
                total = accum - totalAmount - amount
            } else {

                total = accum - totalAmount
            }
            //    // console.log(_.isNil(accum), _.isNil(totalAmount))
            //  // console.log(accum, totalAmount)
            // // console.log(total,accum)

            if (_.isNil(accum) || _.isNil(totalAmount)) {
                return true;
            } else {
                if (total < 1 && total > -1) {
                } else {
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


                // // console.log(getValues('authorization'))
                if (getValues('currency') == 'IDR') {
                    // // console.log('1')
                    setValue(`rate`, 1, { shouldDirty: true })
                }
                else if (getValues('currency') !== 'IDR') {
                    if (getValues('rate') == 0) {
                        setValue('rate', null, { shouldDirty: true })
                    } else if (getValues('rate') == 1) {
                        setValue('rate', null, { shouldDirty: true })
                    }
                    //  // console.log('2')
                    // setValue('rate', null, { shouldDirty: true })
                }
                return true

            })
        }
    )

    yup.addMethod(yup.array, 'location', function (fields) {
        return this.test('location ', '', function (array, v) {

            //// console.log('limitting', array)

            let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0, total = 0, errors = []
            const vouchertype = getValues('vouchertype')
            const suppcontcode = getValues('suppcontcode')

            // // console.log(suppcontcode)

            _.mapValues(v.originalValue, (v, index) => {
                // // // // console.log(v)

                //      // console.log(v.tid)

                //                // console.log('cek', v.tid, st.auth.deletelist, _.find(st.auth.deletelist, ['tid', v.tid]))

                // if (_.find(st.auth.deletelist, ['tid', v.tid]))
                //     return;

                // // console.log(_.get(v.locationtype,'locationtypecode'))
                if (!_.isUndefined(v.locationtype)) {
                    if ((!_.isUndefined(vouchertype) && vouchertype != 3)) {
                        if ((_.get(v.locationtype, 'locationtypecode') == 'AP' || _.get(v.locationtype, 'locationtypecode') == 'CA')) {
                            errors.push(index)
                        }
                        // return;
                    }
                }
            })

            if (errors.length === 0) {
                return true;
            } else {
                // // console.log('jhehe')
                if (vouchertype == 1) {
                    // // console.log(getValues(`${this.path}[${errors[0]}].locationtype`))
                    if (_.get(getValues(`${this.path}[${errors[0]}].locationtype`), 'locationtypecode') == 'AP') {
                        setValue(`${this.path}[${errors[0]}].locationcode`, suppcontcode, { shouldDirty: true })
                    } else {
                        setValue(`${this.path}[${errors[0]}].locationcode`, null, { shouldDirty: true })

                    }
                } else if (vouchertype == 2) {
                    if (_.get(getValues(`${this.path}[${errors[0]}].locationtype`), 'locationtypecode') == 'CA') {
                        setValue(`${this.path}[${errors[0]}].locationcode`, suppcontcode, { shouldDirty: true })
                    } else {
                        setValue(`${this.path}[${errors[0]}].locationcode`, null, { shouldDirty: true })

                    }
                }
            }


            return true;
        });

    })
    // yup.addMethod(yup.string, "checkdestination",
    //     function checkdestination() {
    //         return this.test((value, values) => {


    //             // // console.log(getValues('authorization'))
    //             // // console.log()
    //             if (!_.isUndefined(getValues('suppcontcode'))){
    //                 if (getValues('currency') == 'IDR') {
    //                     // // console.log('1')
    //                     setValue(`paymenttobank`, {code:'216-000-4558'}, { shouldDirty: true })
    //                 } 
    //                 return true
    //             }
    //             // else if (getValues('currency') !== 'IDR'){
    //             //     if(getValues('rate') == 0){
    //             //         setValue('rate', null, { shouldDirty: true })
    //             //     } else if (getValues('rate') == 1){
    //             //         setValue('rate', null, { shouldDirty: true })
    //             //     }
    //             //     //  // console.log('2')
    //             //     // setValue('rate', null, { shouldDirty: true })
    //             // }


    //         })
    //     }
    // )


    if (formValidationSchema) {
        customSchema = formValidationSchema
            .concat(
                yup.object().shape({
                    inputgrid: yup.array()
                        .totalAmountCheck(_.keys(_.pickBy(formComps, (x) => { return x.isunique }))).location(),
                    currency: yup.string().checkCurrency(),
                    // destination: yup.string().checkdestination()
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