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

import { updateData, createData } from "./FormAction";
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

const Forms = ({ title, periode, units, actions, formComp, formComps, initialValues, postdata, formValidationSchema
    , submitdata, actionlabel, resetTrx }) => {
    // // console.log(initialValues)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();

    // let buttonReport
    const postAction = loc.pathname.split('/').pop()
    //  resetTransaction(false)


    const resolver = useYupValidationResolver(formValidationSchema);

    // // console.log(initialValues)

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    let doctype







    useKey('save', () => {
        // // console.log('click')
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
                // // console.log('masuk sini')
                setTimeout(() => {
                    methods.reset(submitdata)

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

            // \\ // console.log('submit', submiting)


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



    // // console.log(!_.isUndefined(urlpreview) ? _.uniqWith(_.get(urlpreview[0],'v_url_preview'),'SOLAR') :'')
    let button = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }
    // // console.log(!_.isUndefined(initialValues['v_url_preview']?initialValues['v_url_preview'].match('SOLAR'):''))



    // // console.log(!_.isUndefined(postdata['inserts'])?(postdata['inserts'])[0]:'')
    //   // console.log(actions, formComp, formComps, initialValues, postdata, formValidationSchema, submitdata)

    //  // console.log('compss', formComp)

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
                children={<RenderForm />} />
        </FormProvider>
    );

}



const customschema = (formValidationSchema, formComp, formComps, methods) => {

    let customSchema
    const { setValue, getValues } = methods

    let validationSchems = {}


    yup.addMethod(yup.array, 'wipdate', function (fields) {
        return this.test('wipdate', 'wipdate', function (array, val) {

            //// // // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, awal = 0, akhir = 0, accum = 0, accumdebit = 0, errors = []

            let st = store.getState()

            //          // console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // // console.log(v)

                //      // console.log(v.tid)

                //                // console.log('cek', v.tid, st.auth.deletelist, _.find(st.auth.deletelist, ['tid', v.tid]))

                // if (_.find(st.auth.deletelist, ['tid', v.tid]))
                //     return;
                // // console.log(getValues('wipdate'))


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



    customSchema = formValidationSchema
        .concat(
            yup.object().shape({
                inputgrid: yup.array()
                    .wipdate()
                // wipdate: yup.string().wipdate(),
            }))

    if (!_.isEmpty(customSchema))
        store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {

    // // console.log(state)

    return {
        // urlpreview: state.auth.urlpreview,
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