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
import eplant from '../../../../apis/eplant'
import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { resetLov, DialogConfirmation, DialogCrudConfirmation, resetTransaction, fetchLovUrlPreview, fetchLovUrlPreviewArray } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import { getFormListComponent, useYupValidationResolver, getFormComponent, InitValidationMixed } from "../../../../utils/FormComponentsHelpler";

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
    // console.log(initialValues)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)



    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype
    // console.log(doctype.match('DA002001')?'haha':'hehe')

    //    console.log('render form');

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



    useEffect(() => {


        console.log('reset transaction', resetTrx, submitdata)

        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {
                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(submitdata.inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }
                // console.log('masuk sini', submitdata)
                // setTimeout(() => {
                //     methods.reset(submitdata)
                //     if (_.isUndefined(initialValues['v_url_preview'])){
                //         // if (_.isEmpty(submitdata['inputgrid'])){
                //             doctype=  _.get(submitdata['inputgrid'][0]['itemcode'],'code').match('DA002001') && (_.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'VH' || _.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'MA') ? 'MRSLR':'MR'

                //     // } else {
                //     //     doctype = 'MRSLR'
                //     // }
                //     // console.log(doctype)
                //     if (doctype == 'MRSLR' ){
                //         dispatch(fetchLovUrlPreview(doctype,initialValues['process_flag'],initialValues['mrcode']))
                //     } else {
                //         dispatch(fetchLovUrlPreview('MR',initialValues['process_flag'],initialValues['mrcode']))
                //     }
                //     }
                // }, 0.1);
                setTimeout(() => {
                    methods.reset(submitdata)
                    if (_.isUndefined(initialValues['v_url_preview'])) {

                        // doctype=  _.get(submitdata['inputgrid'][0]['itemcode'],'code').match('06010002') ? 'POSLR':'PO'
                        // if (doctype == 'POSLR' ){
                        dispatch(fetchLovUrlPreviewArray('MR', initialValues['process_flag'], initialValues['mrcode']))
                        dispatch(fetchLovUrlPreviewArray('MRSLR', initialValues['process_flag'], initialValues['mrcode']))
                        // } else {
                        // }
                    }
                }, 0.1);
            } else {
                // console.log('masuk sini aja', methods.getValues())
                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(methods.getValues().inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }
                setTimeout(() => {
                    methods.reset(methods.getValues())
                }, 0.1);
            }
            // console.log(initialValues)
            // methods.reset(submitdata)
            // console.log(methods)
            // console.log(_.get(submitdata['inputgrid'][0]['itemcode'],'code'))
            // console.log(initialValues)
            // if (_.isUndefined(initialValues['v_url_preview'])){
            //     // if (_.isEmpty(submitdata['inputgrid'])){
            //         doctype=  _.get(submitdata['inputgrid'][0]['itemcode'],'code').match('DA002001') && (_.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'VH' || _.get(submitdata['inputgrid'][0]['locationtype'],'locationtypecode') == 'MA') ? 'MRSLR':'MR'

            // // } else {
            // //     doctype = 'MRSLR'
            // // }
            // // console.log(doctype)
            // if (doctype == 'MRSLR' ){
            //     dispatch(fetchLovUrlPreview(doctype,initialValues['process_flag'],initialValues['mrcode']))
            // } else {
            //     dispatch(fetchLovUrlPreview('MR',initialValues['process_flag'],initialValues['mrcode']))
            // }
            // }
            // console.log('hahaha')
            // dispatch(fetchLovUrlPreview(doctype,initialValues['process_flag'],initialValues['mrcode']))
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

    // document.addEventListener('keydown', function (event) {
    //     if (event.ctrlKey && event.key === 's') {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         event.stopImmediatePropagation();
    //         submitHandler()
    //         // console.log('save')

    //     }
    // });



    // console.log(urlpreview)
    // const handlerReport = () => {
    //     // console.log(_.get(urlpreview[0],'v_url_preview'))
    //     // console.log(initialValues['v_url_preview'])
    //     if(!_.isUndefined(initialValues['v_url_preview'])){
    //         window.open(initialValues['v_url_preview'])
    //     } else {
    //         window.open(_.get(urlpreview[0],'v_url_preview'))
    //     }
    // }
    // const handlerReportSolar = () => {
    //     // console.log(_.get(urlpreview[0],'v_url_preview'))
    //     if(!_.isUndefined(initialValues['v_url_preview'])){
    //         // console.log('hehe',initialValues['v_url_preview_solar'])
    //         window.open(initialValues['v_url_preview'])
    //     } else {
    //         window.open(_.get(urlpreview[0],'v_url_preview'))
    //     }
    // }
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
    // console.log(!_.isUndefined(urlpreview) ? _.uniqWith(_.get(urlpreview[0],'v_url_preview'),'SOLAR') :'')
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }
    // console.log(!_.isUndefined(initialValues['v_url_preview']?initialValues['v_url_preview'].match('SOLAR'):''))

    let buttonReport
    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('MR_PRINT.RDF') : _.includes(initialValues['v_url_preview'], 'MR_PRINT.RDF')/*!_.isUndefined(urlpreview) ? _.get(urlpreview[0],'v_url_preview').match('MR_PRINT.RDF'):'' || !_.isUndefined(initialValues['v_url_preview'])? _.includes(initialValues['v_url_preview'],'MR_PRINT.RDF') :''*/)) {
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
        }
        ]
    }
    // else 
    // if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE && ( !_.isEmpty(urlpreview) ? _.get(urlpreview[0],'v_url_preview').match('SOLAR') : _.includes(initialValues['v_url_preview'],'SOLAR')) /*|| !_.isUndefined(urlpreview) ? _.get(urlpreview[0],'v_url_preview').match('SOLAR') :''  || !_.isUndefined(initialValues['v_url_preview_solar'])? _.includes(initialValues['v_url_preview_solar'],'SOLAR'):'')*/){
    //         // console.log('2')

    //         buttonReport = [{
    //             btnTitle:'View Report Solar',
    //             btnIcon: 'file pdf outline',
    //             reportHandler: handlerReportSolar,
    //         },
    //         {
    //             btnTitle:'View Report',
    //             btnIcon: 'file pdf outline',
    //             // reportHandler: handlerReport,
    //             hidden:'none'
    //         }
    //     ]
    //     } 
    else {
        // console.log('3')
        buttonReport = [{
            btnTitle: 'View Report Solar',
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

        // console.log(defaultDataValue)


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
    const ROUTES = '/stores/Trx/materialrequest'
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
    yup.addMethod(yup.array, 'Destination', function (fields) {
        return this.test('Destination', 'Destination', function (array, val) {

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
                // console.log(getValues('mr_storecode'))
                if (!_.isNil(getValues('mr_storecode'))){
                    setValue(`${this.path}[${index}].destination`, getValues('mr_storecode'), { shouldDirty: true })
                    // errors.push(index)
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

                // }
            }

        });

    })


    // ? add custom validation to default schema validation 
    yup.addMethod(yup.array, 'getEmdek', function (fields) {
        return this.test('getEmdek', 'luas CR > area statement', function (array, val) {

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


                if (!_.isUndefined(v.locationcode) && !_.isUndefined(v.emdek)) {
                    if (_.get(v.locationtype, 'locationtypecode') == 'OP' && v.emdek == 1) {
                        eplant.get(`${ROUTES}/emdek?fieldcode=${_.get(v.locationcode, 'locationcode')}`).then(res => {
                            setValue(`${this.path}[${index}].valemdekdisplayonly`, _.get(res.data[0], 'valemdekdisplayonly'), { shouldDirty: true })
                        })
                        if (v.valemdekdisplayonly == 0) {
                            errors.push(index)
                        } else if (v.valemdekdisplayonly == 2) {
                            errors.push(index)
                        }
                    }
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
                if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 0) {
                    return this.createError(
                        { path: `${this.path}[${errors[0]}].emdek`, message: `Tdk Ada Jalur ` }
                    )
                } else if (getValues(`${this.path}[${errors[0]}].valemdekdisplayonly`) == 2) {
                    return this.createError(
                        { path: `${this.path}[${errors[0]}].emdek`, message: `Jalur Tdk Standart ` }
                    )
                }
                // }
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
                        .getEmdek().Destination()
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {
    //  console.log(state)

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