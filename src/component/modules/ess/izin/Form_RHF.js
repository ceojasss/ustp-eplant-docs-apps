import React, { useRef, useState, useEffect } from "react"
import { useDispatch, connect } from 'react-redux'
import { Form as FormUI, Segment } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, resetTransaction } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroup from "../../../templates/forms/ComponentAdaptersGroup";
import { getFormComponent, InitValidation, useYupValidationResolver } from "../../../../utils/FormComponentsHelpler";
import { NEWS, STATUS_SAVED, STATUS_UPDATED } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_TRANSACTION_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";
import { useHotkeys } from "react-hotkeys-hook";
import { useKey } from "../../../../utils/ShortcutKeyHelper";
import store from "../../../../redux/reducers";
import eplant from "../../../../apis/eplant";

const Form = ({ title, actions, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()

    const formRefs = useRef();
    const postAction = loc.pathname.split('/').pop()
    
    // console.log('initial',initialValues)
    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation

    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidation(postAction,
            (obj) => {
                // customschema(obj,  formComps, methods)
            });

        return () => {
            dispatch(resetLov())
        };

    }, [navigate])

    useEffect(() => {
        // console.log('reset transaction', resetTrx, submitdata)
        if (resetTrx & !_.isUndefined(submitdata)) {
            methods.reset(submitdata)
        }
        return () => {
            resetTransaction(false)
        }
    }, [resetTrx])



    const resolver = useYupValidationResolver(formValidationSchema);

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })

    // console.log('methods',methods)
    // console.log('formcomp',formComps)

    const { setValue, getValues } = methods
    const onItemClickHandler = (lovroute, value) => dispatch(ShowLov(lovroute, value, (_.isNil(getValues(value)) ? '' : getValues(value))))
    
    const submitHandler = () => formRefs.current(
        (rowid, data, object) => {
            /*
              * 1. Set post Data. 
              *    Jika action UPDATE maka data ditambahkan rowid,
              * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
             */

            //   console.log('baru',rowid, data, object)
              
        
            
            let postObject = (actionlabel === NEWS ? object : { ROWIDS: rowid, ...object })


            dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, rowid, data))
        }
    )


    useKey('save', () => {
        // console.log('click')
        submitHandler()
    })

// console.log(actionlabel)

    const Buttons = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }


    if (actions) {

        let data = []
        data.push(postdata)
        const submiting = { formComps, data }
        // console.log('subm',submiting)
        switch (actions) {

            case Appresources.BUTTON_LABEL.LABEL_SAVE:
                dispatch(createData(submiting))

                break;
            case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                dispatch(updateData(submiting))
                break;
            default:
                break;

        }
    }

    const RenderForm = React.memo(() => {
        if (!formComps)
            return <LoadingStatus />

        return (
            <Segment raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px" }}>
                <FormUI as={'form'}>
                    <FormProvider {...methods} >
                        <ComponentAdaptersGroup
                            key="0.componentgroup"
                            OnClickRef={formRefs}
                            {...methods}
                            components={_.groupBy(formComps, 'grouprowsseq')}
                            itemClickHandler={onItemClickHandler}
                            postAction={postAction}
                        />
                    </FormProvider>
                </FormUI>
            </Segment>
        )
    })

    //console.log(formValidationSchema)
    return (
        <ContentHeader
            title={title}
            btn1={Buttons}
            children={<RenderForm />} />
    );

}
const customschema = (formValidationSchema, formComps, methods) => {

    let customSchema, response
    const { setValue, getValues } = methods
    let validationSchems = {}
    const ROUTES = '/hr/Trx/barangassets'

    // console.log(actions)

    yup.addMethod(yup.string, "setFacode",
        function setFacode() {
            return this.test('setFacode', 'setFacode',(value, values) => {
                // console.log(actionlabel)
                // console.log(getValues('authorized'))
                // setValue('authorized', '0', { shouldDirty: true })
                // console.log(getValues('berat_spikelet_sample_1'))
                // console.log(actionlabel)
                const st = store.getState()
                // console.log(st.auth.actionlabel)
                // if(_.isNull(actionlabel)){
                    if(st.auth.actionlabel === 'Save'){
                        if (!_.isUndefined(getValues('kategori')) && !_.isUndefined(getValues('tahunbeli'))){
                            // getValues('berat_spikelet_sample_1')
                            eplant.get(`${ROUTES}/facode?kategori=${getValues('kategori')}&tahunbeli=${getValues('tahunbeli')}`).then(res => {
                                setValue(`facode`, _.get(res.data[0],'facode'), { shouldDirty: true })
                            })
                            // setValue('facode', s, { shouldDirty: true })
                        }
                    }
                // }
                // console.log(getValues('facode'))
                return true

            })
        }
    )

    

    customSchema = formValidationSchema
        .concat(
            yup.object().shape({
                sample: yup.string().setFacode(),
            }))

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
        actions: state.auth.modals.actionpick,
        formComps: getFormComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        resetTrx: state.auth.resetTrx,
        actionlabel: state.auth.actionlabel,
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)