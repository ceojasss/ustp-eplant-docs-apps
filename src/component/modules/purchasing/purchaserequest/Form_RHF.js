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
import { resetLov, DialogConfirmation, resetTransaction, fetchLovUrlPreview } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed, UserInfo } from "../../../../utils/FormComponentsHelpler";

import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

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
    // // console.log(initialValues)
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

    useKey('save', () => {
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


        // // console.log('reset transaction', resetTrx, submitdata)

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {

                // console.log('masuk sini', submitdata)

                /* delete grid handler */
                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(submitdata.inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }

                setTimeout(() => {

                    methods.reset(submitdata)

                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        // if (_.isEmpty(submitdata['inputgrid'])){
                        doctype = UserInfo().loginid.match(/^.*HO$/) ? 'PR' : 'PRSO'

                        // } else {
                        //     doctype = 'MRSLR'
                        // }
                        // // console.log(doctype)
                        if (doctype == 'PR') {
                            dispatch(fetchLovUrlPreview(doctype, initialValues['process_flag'], initialValues['prcode']))
                        } else {
                            dispatch(fetchLovUrlPreview('PRSO', initialValues['process_flag'], initialValues['prcode']))
                        }
                    }
                }, 0.1);
            } else {

                /* delete grid handler */
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

            //  // console.log('submit', submiting)


            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))

                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting))
/*                     dispatch(updateData(submiting, (v) => {
                        // console.log(v)
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                            // dispatch({ type: SET_TRANSACTION_STATUS, payload: STATUS_SAVED })
                            dispatch(resetTransaction(true))
                        }

                    }))
 */                    break;
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


    const handlerReport = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        // // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }
    const handlerReportSolar = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            // // console.log('hehe',initialValues['v_url_preview_solar'])
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    let buttonReport

    //UPDATE BUTTON REPORT


    if (actionlabel === Appresources.BUTTON_LABEL.LABEL_UPDATE) {
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            reportHandler: handlerReport,
        },
        {
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
        }]

    } else {
        // // console.log('3')
        buttonReport = [{
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
        },
        {
            btnTitle: 'View Report',
            btnIcon: 'file pdf outline',
            hidden: 'none'
        }
        ]
    }


    /* if (actionlabel === Appresources.BUTTON_LABEL.LABEL_UPDATE &&
        (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PR_PRINT.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PR_PRINT.RDF'))
        // || ( !_.isEmpty(urlpreview) ? _.get(urlpreview[0],'v_url_preview').match('rpt_pr_print.rdf'):  _.includes(initialValues['v_url_preview'],'rpt_pr_print.rdf'))
    ) {
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
    } else
        if (actionlabel === Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('rpt_pr_print_so.rdf') : _.includes(initialValues['v_url_preview'], 'rpt_pr_print_so.rdf')) || (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_PR_PRINT_SO.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_PR_PRINT_SO.RDF'))) {
            // // console.log('2')

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
        }
        else {
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
 */

    const RenderForm = React.memo(() => {

        let documentkey = _.find(getFormComponent(), { 'tableparentkey': 'true' })['key']

        //      let defaultDataValue = { ...initialValues }
        let defaultDataValue = { [documentkey]: initialValues[documentkey] }

        // // console.log(defaultDataValue)


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
    //  // console.log(formValidationSchema, formComps)

    /* yup.addMethod(yup.array, 'checkUnique', function (fields) {
        return this.test('unique', '', function (array, field) {
            // console.log(array)
            let msg = checkDuplicateRows(array, fields, field)
            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });
    });
 */



    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'description', function (fields) {
        return this.test('description', 'description', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let errors = []

            let st = store.getState()

            //          console.log('data', st)

            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)

                if (!_.isUndefined(v.itemcode)) {
                    if (!_.isUndefined(_.get(v.itemcode, 'itemtype'))) {
                        if (_.get(v.itemcode, 'itemtype') != 0 && (!_.includes(_.get(v.itemcode, 'itemcode'), 'MED') && !_.includes(_.get(v.itemcode, 'itemcode'), 'Y') && !_.includes(_.get(v.itemcode, 'itemcode'), 'IT'))) {
                            // console.log(_.get(v.itemcode,'itemcode'))
                            if (_.isUndefined(v.itemdescription)) {
                                errors.push(index)
                            }
                        }
                    }
                }
                if (_.find(st.auth.deletelist, ['tid', v.tid]))
                    return;

                // console.log(v.hadisplayonly)
                // if (!_.isUndefined(v.hadisplayonly)){

                // }

            })
            if (errors.length === 0) {
                return true
            } else {
                setValue(`${this.path}[${errors[0]}].itemdescription`, null, { shouldDirty: true })
                setValue(`${this.path}[${errors[0]}].uomcode`, null, { shouldDirty: true })
            }

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
                        .description()
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {
    console.log(state.auth)

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
