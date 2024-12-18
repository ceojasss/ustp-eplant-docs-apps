import React, { useRef, useState, useEffect } from "react"
import { useDispatch, connect } from 'react-redux'
import { Button, Form as FormUI, Label, Segment } from 'semantic-ui-react'
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, resetTransaction, ViewData, fetchLovUrlPreview } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroup from "../../../templates/forms/ComponentAdaptersGroup";
import { getFormComponent, InitValidation, useYupValidationResolver } from "../../../../utils/FormComponentsHelpler";
import { NEWS, STATUS_SAVED, STATUS_UPDATED } from "../../../Constants"
import { updateData, createData, ROUTES } from "./FormAction";
import '../../../Public/CSS/App.css'
import { MODAL_STATE, SAVE, SET_TRANSACTION_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";
import store from "../../../../redux/reducers";


const Form = ({ title, actions, formComp, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx, urlpreview }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef()

    const postAction = loc.pathname.split('/').pop()

    let buttonReport

    // ? 1st hooks check if component present 
    // ?     then initialized component to genereate form & object schema validation



    //// console.log(formValidationSchema)


    const resolver = useYupValidationResolver(formValidationSchema);

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && initialValues })

    const { setValue, getValues, control } = methods

    const onItemClickHandler = (lovroute, value) => dispatch(ShowLov(lovroute, value, (_.isNil(getValues(value)) ? '' : getValues(value))))

    const submitHandler = () => formRefs.current(
        (rowid, data, object) => {
            /*
              * 1. Set post Data. 
              *    Jika action UPDATE maka data ditambahkan rowid,
              * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
             */

            let postObject = (actionlabel === NEWS ? object : { ROWIDS: rowid, ...object })

            //    // console.log(postObject)


            dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, rowid, data))
        }
    )

    const Buttons = {
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    const ClickHandler1 = () => {

        // // console.log('hahaha',_.get(getValues('workorderno'),'code'),getValues())
        const workorder = (_.get(getValues('workorderno'), 'code'))
        // const podate = encodeURIComponent(parseDatetoString(methods.getValues('podate')))

        const urls = `${ROUTES}/view?workorder=${workorder}`
        dispatch(ViewData('Work Order Completion', urls, workorder))
    }
    const buttonForm = () => {
        return <Button
            positive
            // color='green'
            // disabled={_.isUndefined(methods.getValues('workorderno'))  ? true : false}
            // icon={}
            className="btnControlAdd"
            content={'View Material & Mekanik'}
            onClick={ClickHandler1}
            // size="mini"
            // disabled={buttons.disabled}
            labelposition="right"
        />
    }


    useEffect(() => {
        if (_.isEmpty(formComp))
            navigate('../')

        /** initialized default validation schema form */
        InitValidation(postAction, (obj) => {
            customschema(obj, {}, {}, methods)
        });

        return () => {
            dispatch(resetLov())
        };

    }, [navigate])

    useEffect(() => {
        if (resetTrx) {

            if (!_.isEmpty(submitdata)) {

                const viewData = _.omit(submitdata, _.filter(_.keys(submitdata), x => (x.includes('displayonly'))))

                setTimeout(() => {
                    methods.reset(viewData)
                    if (_.isUndefined(initialValues['v_url_preview'])) {
                        dispatch(fetchLovUrlPreview('WO', initialValues['process_flag'], initialValues['workorderno']))
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
            resetTransaction(false)
        }
    }, [resetTrx])

    if (actions) {

        let data = []
        data.push(postdata)

        const submiting = { formComp, data }

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

    const handlerReport = () => {
        // // console.log(_.get(urlpreview[0],'v_url_preview'))
        // // console.log(initialValues['v_url_preview'])
        if (!_.isUndefined(initialValues['v_url_preview'])) {
            window.open(initialValues['v_url_preview'])
        } else {
            window.open(_.get(urlpreview[0], 'v_url_preview'))
        }
    }



    if (actionlabel == Appresources.BUTTON_LABEL.LABEL_UPDATE &&
        (!_.isEmpty(urlpreview) ? _.get(urlpreview[0], 'v_url_preview').match('RPT_WORKORDER.RDF') : _.includes(initialValues['v_url_preview'], 'RPT_WORKORDER.RDF'))
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

    const RenderForm = React.memo(() => {
        if (!formComp)
            return <LoadingStatus />

        return (
            <Segment raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px" }}>
                <FormUI as={'form'}>
                    <ComponentAdaptersGroup
                        key="0.componentgroup"
                        OnClickRef={formRefs}
                        {...methods}
                        components={_.groupBy(formComp, 'grouprowsseq')}
                        itemClickHandler={onItemClickHandler}
                        postAction={postAction}
                        btn={buttonForm()}
                    />
                </FormUI>
            </Segment>
        )
    })
    return (
        <FormProvider {...methods} >
            <ContentHeader
                title={title}
                btn1={Buttons}
                btn2={buttonReport}
                children={<RenderForm />} />
        </FormProvider>
    );

}

const customschema = (formValidationSchema, formComp, formComps, methods, title) => {

    let customSchema
    const { setValue, getValues } = methods


    // ? add custom validation to default schema validation 
    /*  yup.addMethod(yup.number, 'totalbiaya',
         function totalbiaya() {
             return this.test(`checkamount`, '',
                 function (value) {
                     const { path, createError } = this;
 
                     // console.log('test')
 
                     let errorMsg;
                     let msg, debit = 0, credit = 0, accum = 0, accumdebit = 0, amount = 0
 
                     const actual = getValues('biaya_actual')
                     const kamar = getValues('biaya_kamar')
                     const obat = getValues('biaya_obat')
                     const kategori = getValues('kategori')
                     const plafon = getValues('plafon')
 
 
                     // console.log(actual)
 
                     if (kategori === 'RI' && kamar > plafon) {
                         setValue('biaya', actual)
                     } else {
                         setValue('biaya', actual)
                     }
 
                     return true;
                 });
         }
     ) */
    /* 
        yup.addMethod(yup.string, "totalbiaya",
            function totalbiaya({ errorMessage }) {
                return this.test((value, values) => {
                    // console.log('test')
                    return true
    
                })
            }
        )
     */


    const totalbiaya = (v) => {
        //      // console.log('total biaya', v)
        let val = 0

        if (v.kategori === 'RI' && v.biaya_kamar > v.plafon) {
            val = (((v.biaya_actual - v.biaya_obat) / v.biaya_kamar) * v.plafon) + v.biaya_obat;

        } else {
            val = v.biaya_actual
        }

        //    // console.log(val)

        setValue('biaya', val)
        /*
                if :kategori = 'RI' and nvl(:biaya_kamar,0) > :PLAFON
                THEN
           -- 		ntemp := nvl(:biaya_actual,0) - nvl(:biaya_obat ,0);
                    
              :biaya := ((( :biaya_actual - :biaya_obat ) / :biaya_kamar) * :plafon ) + :biaya_obat ;
                   
            ELSE 
                :BIAYA := :BIAYA_ACTUAL;
           END IF;*/

    }

    if (formValidationSchema) {
        customSchema = formValidationSchema
            .concat(
                yup.object().test('totalbiaya', 'global', function (value) {
                    totalbiaya(value)

                    return true
                }))

    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}

const mapStateToProps = (state) => {
    // // console.log(state)
    return {
        urlpreview: state.auth.urlpreview,
        actions: state.auth.modals.actionpick,
        units: state.auth.transactionInfo,
        periode: state.auth.tableDynamicControl.dateperiode,
        formComp: getFormComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        resetTrx: state.auth.resetTrx,
        actionlabel: state.auth.actionlabel,
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)