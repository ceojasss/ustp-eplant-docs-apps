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
import { useKey } from "../../../../utils/ShortcutKeyHelper";
import store from "../../../../redux/reducers";
import format from "dateformat"

const Form = ({ title, actions, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()


    const formRefs = useRef();
    const postAction = loc.pathname.split('/').pop()


    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation

    useKey('save', () => {
        // console.log('click')
        submitHandler()
    })
    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidation(postAction,
            (obj) => {
                customschema(obj, formComps, methods)
            });

        return () => {
            dispatch(resetLov())
        };

    }, [navigate])

    useEffect(() => {
        if (resetTrx & !_.isUndefined(submitdata)) {
            methods.reset(submitdata)
        }
        return () => {
            resetTransaction(false)
        }
    }, [resetTrx])


    const resolver = useYupValidationResolver(formValidationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    const { setValue, getValues } = methods
    const onItemClickHandler = (lovroute, value) => dispatch(ShowLov(lovroute, value, (_.isNil(getValues(value)) ? '' : getValues(value))))

    const submitHandler = () => formRefs.current(
        (rowid, data, object) => {
            /*
              * 1. Set post Data. 
              *    Jika action UPDATE maka data ditambahkan rowid,
              * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
             */

            //console.log(actionlabel)

            let postObject = (actionlabel === NEWS ? object : { ROWIDS: rowid, ...object })


            dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, rowid, data))
        }
    )

    const Buttons = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }


    if (actions) {

        let data = []
        data.push(postdata)

        const submiting = { formComps, data }

        switch (actions) {

            case Appresources.BUTTON_LABEL.LABEL_SAVE:
                dispatch(createData(submiting))
                /*                 dispatch(createData(submiting, (v) => {
                                    if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                                        dispatch({ type: SET_TRANSACTION_STATUS, payload: STATUS_SAVED })
                                    }
                                }))
                 */
                break;
            case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                dispatch(updateData(submiting))
/*                 dispatch(updateData(submiting, (v) => {
                    console.log('status', v)
                    if (v === Appresources.TRANSACTION_ALERT.UPDATE_SUCCESS) {
                        dispatch({ type: SET_TRANSACTION_STATUS, payload: STATUS_UPDATED })
                    }
                }))
 */                break;
            default:
                break;

        }
    }

    const RenderForm = React.memo(() => {
        if (!formComps)
            return <LoadingStatus />

        return (
            <Segment className="bg-rhf" raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px" }}>
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

    return (
        <ContentHeader
            title={title}
            btn1={Buttons}
            children={<RenderForm />} />
    );

}

const customschema = (formValidationSchema,  formComps, methods) => {

    let customSchema
    const { setValue, getValues } = methods
    // const ROUTES = '/stores/Trx/materialrequest'
    //  console.log(formValidationSchema, formComps)

    /* yup.addMethod(yup.array, 'checkUnique', function (fields) {
        return this.test('unique', '', function (array, field) {
            console.log(array)
            let msg = checkDuplicateRows(array, fields, field)
            return msg ? this.createError({ path: `${this.path}`, message: msg }) : true
        });
    });
 */

    yup.addMethod(yup.string, "setTdate",
    function setTdate() {
        return this.test((value, values) => {

            // console.log(getValues("startdatesivdisplayonly"))
            let startdate = getValues("startdatesivdisplayonly")
            // console.log(startdate.getMonth(),startdate.getFullYear())
            if (!_.isNil(startdate)){
                startdate = format(startdate,'dd-mm-yyyy')
                startdate = new Date(startdate)
                setValue('tdate', startdate, { shouldDirty: true })
            }
            // console.log(getValues('tdate'))
            // console.log(getValues('authorized'))
            // setValue('authorized', '0', { shouldDirty: true })
            // if (getValues('authorized') === '0;1'){
            //     setValue('authorized', '0', { shouldDirty: true })
            // }

            // if (getValues('authorized') === '1') {
            //     setValue('authorizedate', new Date(), { shouldDirty: true })
            // }
            // else {
            //     setValue('authorizedate', null, { shouldDirty: true })

            // }
            return true

        })
    }
)

    // ? add custom validation to default schema validation 
    yup.addMethod(yup.string, 'Referenceno', function (fields) {
        return this.test('Referenceno', 'Reference & SIV Code Tidak Boleh Sama ', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let  errors = []

            let st = store.getState()

            //          console.log('data', st)
            // console.log('hehe')

            // console.log(_.get(getValues('referenceno'),'sivcode'))

            // if(!_.isUndefined(getValues('referenceno'))){
            //     if (_.get(getValues('referenceno'),'sivcode') == _.get(getValues('sivcode'),'sivcode')){
            //         errors.push(1)
            //     } else {
            //         var date = _.split(_.get(getValues('referenceno'),'sivdate'),'-')
            //         // console.log(new Date(date[2], date[1] - 1, date[0]))
            //         // console.log()
            //         setValue('tdate',new Date(date[2], date[1] - 1, date[0]),{ shouldDirty: true })
            //         // console.log(new Date(_.get(getValues('referenceno'),'sivdate')))
            //     }
            // } else {
            //     if(!_.isUndefined(getValues('tdate'))){
            //         if(!_.isUndefined(getValues('sivdatedisplayonly'))){
            //             var date1 = _.split(new Date(getValues('tdate')).toLocaleDateString('en-GB'),'/')
            //             var date2 = _.split(getValues('sivdatedisplayonly'),'-')
            //             if (date1[1]+'-'+date1[2] != date2[1]+'-'+date2[2]){
            //                 setValue('tdate',null,{ shouldDirty: true })
            //             }
            //             // console.log('heh',date1[1]+'-'+date1[2],date2[1]+'-'+date2[2])
            //         }
            //     }
            // }

          
            if (errors.length === 0) {
                return true
            } else  {
                return this.createError(
                        { path: `referenceno`, message: `Reference & SIV Code Tidak Boleh Sama ` }
                    )
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // if (getValues(`${this.path}[${errors[0]}].hadisplayonly`) == '0'){
                    // const r = getValues(`${this.path}[${errors[0]}].hectplanteddisplayonly`)
                    // return this.createError(
                    //     { path: `${this.path}[${errors[0]}].request_vol`, message: `Luas CR > ${r} ` }
                    // )
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
                    // inputsiv: yup.string().Referenceno().setTdate()
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {

    // console.log(state)
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