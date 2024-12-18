import React, { useRef, useEffect } from "react"
import { useDispatch, connect } from 'react-redux'
import { Form as FormUI, Segment } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import { useNavigate, useLocation } from "react-router-dom";


import { toast } from 'react-toastify';

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, resetTransaction, ConfirmationApproved, ConfirmationApprovedWithReject } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroup from "../../../templates/forms/ComponentAdaptersGroup";
import { getFormComponent, InitValidation, UserInfo, useYupValidationResolver } from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { ACTION_LABEL, SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";


const alerta = (_TYPE, _message) => {
    const opts = {
        autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
        pauseOnHover: true,
        theme: 'colored'
    }
    switch (_TYPE) {
        case Appresources.STATUS.FAILED:
            toast.error(_message, opts)
            break;
        case Appresources.STATUS.SUCCESS:
            toast.success(_message, opts)
            break;

        default:
            break;
    }


}

const Form = ({ title, actions, formComps, initialValues, postdata, formValidationSchema, submitdata, docTitle, resetTrx }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const users = UserInfo()

    const formRefs = useRef();
    const postAction = loc.pathname.split('/').pop()


    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation

    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidation(postAction);

        dispatch({ type: ACTION_LABEL, payload: 'Action Process' })

        return () => {
            dispatch(resetLov())
        };

    }, [navigate])

    useEffect(() => {
        // // console.log('reset transaction', resetTrx, submitdata)

        console.log(resetTrx, submitdata)

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


    const submitHandler = () => {


        let _message, _status

        if (users.department === 'PROCUREMENT' || users.loginid === 'GCM ADMIN'
        ) {
            _message = `Procurement , Proses ${docTitle} ? `
            _status = getValues('verified')
        } else if (users.department === 'LEGAL'
        ) {
            _message = `Legal Dept. , Proses ${docTitle} ? `
            _status = getValues('legal_verified')
        }

        //// console.log(_status)

        if (_.isEmpty(_message)) {
            alerta(Appresources.STATUS.FAILED, Appresources.TRANSACTION_ALERT.UNAUTH_TRX)
        }
        else {
            if (_status !== 'APPROVED') {
                if (
                    ((users.department === 'PROCUREMENT' || users.loginid === 'GCM ADMIN')
                        && getValues('verified') === 'REJECTED'
                    ) || (users.department === 'LEGAL' && getValues('legal_verified') === 'REJECTED')
                ) {
                    dispatch(ConfirmationApproved(_message, Appresources.BUTTON_LABEL.LABEL_LANJUT, Appresources.BUTTON_LABEL.LABEL_LANJUT))
                } else {
                    dispatch(ConfirmationApprovedWithReject(_message, Appresources.BUTTON_LABEL.LABEL_LANJUT, Appresources.BUTTON_LABEL.LABEL_LANJUT))
                }
            } else {
                alerta(Appresources.STATUS.FAILED, 'Vendor Is Already Verified')
            }
        }
    }

    const Buttons = {
        btnIcon: 'signup',//'calendar check outline',
        addClickHandler: submitHandler
    }


    if (actions) {

        let data = []
        //        data.push(postdata)

        const submiting = '' // = { formComps, data }

        switch (actions) {

            case Appresources.BUTTON_LABEL.LABEL_SAVE:
                dispatch(createData(submiting))
                break;
            case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                dispatch(updateData(submiting))
                break;
            case Appresources.BUTTON_LABEL.LABEL_LANJUT_REJECT:
                dispatch(updateData(getValues(),
                    (v) => {

                        if (v.data?.status === 'success') {
                            alerta(Appresources.STATUS.SUCCESS, Appresources.TRANSACTION_ALERT.UPDATE_SUCCESS)

                            if (users.department === 'PROCUREMENT' || users.loginid === 'GCM ADMIN'
                            ) {
                                setValue('verified', 'REJECTED')
                            } else {
                                setValue('legal_verified', 'REJECTED')
                            }
                        } else {
                            alerta(Appresources.STATUS.FAILED, v.data.status)
                        }

                    }))
                break;
            case Appresources.BUTTON_LABEL.LABEL_LANJUT:
                dispatch(updateData(getValues(),
                    (v) => {

                        try {
                            let ret = v.data?.status

                            if (ret === 'success') {
                                alerta(Appresources.STATUS.SUCCESS, Appresources.TRANSACTION_ALERT.UPDATE_SUCCESS)

                                if (users.department === 'PROCUREMENT' // || users.loginid === 'GCM ADMIN'
                                ) {
                                    setValue('verified', 'APPROVED')
                                } else {
                                    setValue('legal_verified', 'APPROVED')
                                }
                            } else {
                                alerta(Appresources.STATUS.FAILED, ret)
                            }

                        } catch (error) {
                            alerta(Appresources.STATUS.FAILED, error)

                        }

                    }))

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

    return (
        <ContentHeader
            title={title}
            btn1={Buttons}
            children={<RenderForm />} />
    );

}

const mapStateToProps = (state) => {

    //// console.log(state.auth)

    return {
        actions: state.auth.modals.actionpick,
        formComps: getFormComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        resetTrx: state.auth.resetTrx,
        actionlabel: state.auth.actionlabel,
        docTitle: state.auth.documentTitle
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)