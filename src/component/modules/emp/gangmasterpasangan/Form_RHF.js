import React, { useRef, useState, useEffect, useCallback } from "react"
import { useDispatch, connect } from 'react-redux'
import { Form as FormUI, Label, Header, Segment, SegmentGroup, Button } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";
import dateFormat, { masks } from "dateformat";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, populateList } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroupArray from "../../../templates/forms/ComponentAdaptersGroupArray";
import { getFormListComponent, getFormComponent, useKeyPress, useYupValidationResolver, FormDefaultValidation, clearCacheData } from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, UPDATE } from "../../../../redux/actions/types";


const Forms = ({ title, periode, units, actions, formComp, formComps, formSubmit, initialValues, postdata, defaultValue }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const [validationSchema, setValidationSchema] = useState({});

    const formRefs = useRef();

    const postAction = loc.pathname.split('/').pop()


    const initForm = (formComps) => {

        let _validationSchema = {};
        formComps = _.mapKeys(formComps, 'key')


        for (var key of Object.keys(formComps)) {

            // !Set Validasi Default
            _validationSchema[key] = FormDefaultValidation(formComps[key], methods)

        }

        //   console.log(_validationSchema)

        setValidationSchema(yup.object().shape({ inputgrid: yup.array().of(yup.object().shape({ ..._validationSchema })) }));
    }


    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        initForm(formComps);

        return () => {
            reset()

            dispatch(resetLov())
        };

    }, [navigate])


    const resolver = useYupValidationResolver(validationSchema);
    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })
    const { setValue, getValues, reset } = methods

    const onItemClickHandler = (lovroute, value) => {
        console.log(value)
        dispatch(ShowLov(lovroute, value, (_.isNil(getValues(value)) ? '' : getValues(value))))
    }

    const submitHandler = () => formRefs.current((rowid, object) => {

        //   console.log('yeeay')

        console.log('submit object ', rowid, object)
        /*
          * 1. Set post Data. 
          *    Jika action UPDATE maka data ditambahkan rowid,
          * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
         */
        let postObject = (postAction === NEWS ? object : { ROWIDS: rowid, ...object })
        dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, postObject))
    })

    const button = {
        btnLabel: Appresources.BUTTON_LABEL.LABEL_SAVE,
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    if (actions) {

        let data = []
        data.push(postdata)

        const submiting = { formComps, data }

        switch (actions) {

            case Appresources.BUTTON_LABEL.LABEL_SAVE:

                console.log('masuuk')
                dispatch(createData(submiting, (v) => {
                    if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                        //    setTimeout(navigate(-1), 1000);
                    }
                }))

                break;
            case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                dispatch(updateData(submiting, (v) => {
                    console.log(submiting)
                    if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {

                    }
                    //navigate(-1)
                }))
                break;
            default:
                break;
        }

    }

    const defaultDataValue = {
        gangcode: units[0]
    }

    const RenderForm = React.memo(() => {
        if (!formComps)
            return <LoadingStatus />

        return (
            <Segment raised className="form-container">
                <Header dividing as='h4' icon='dashboard' content={`Unit : ${units[0]} / ${units[1]}`} floated='left' />
                <Header dividing as='h4' icon='calendar alternate outline' content={`Periode Transaksi : ${dateFormat(periode, " mmm yyyy")}`} floated='right' />
                <FormUI as={'form'}  >
                    <FormProvider {...methods} raised style={{ marginBottom: '50px' }} >
                        <ComponentAdaptersGroupArray
                            key="0.componentgroup"
                            OnClickRef={formRefs}
                            {...methods}
                            components={_.groupBy(formComps, 'grouprowsseq')}
                            itemClickHandler={onItemClickHandler}
                            defaultDataValue={defaultDataValue}
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
            btn1={button}
            children={<RenderForm />} />
    );

}

const mapStateToProps = (state) => {


    return {
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComp: getFormComponent(state),
        formComps: getFormListComponent(state),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)