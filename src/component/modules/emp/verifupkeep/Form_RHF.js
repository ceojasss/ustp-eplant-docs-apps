import React, { useRef, useEffect, useMemo } from "react"
import { useDispatch, connect } from 'react-redux'
import { Form as FormUI, Header, Segment, Tab } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";
import dateFormat from "dateformat";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { resetLov, DialogConfirmation, resetTransaction, DialogLoading, DialogConfirmationOnly } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroupArray from "../../../templates/forms/ComponentAdaptersGroupArray";
import { getFormListComponent, useYupValidationResolver, InitValidationList, UserInfo } from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants"
import { updateData, createData, fetchDetailBydate } from "./FormAction";
import '../../../Public/CSS/App.css'
import { CHANGE_MODAL_ITEM_STATE, DATE_FILTER, SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

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

const Forms = ({ title, periode, units, actions, formComps, initialValues, postdata, formValidationSchema, resetTrx, submitdata, actionlabel }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();
    const addDataRef = useRef();

    const postAction = loc.pathname.split('/').pop()
    //const title = 'kiwkiw'

    const resolver = useYupValidationResolver(formValidationSchema);

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && { inputgrid: initialValues } })




    /*  const methods = useForm({
         mode: 'onBlur',
         resolver,
         defaultValues: initialValues &&
             [{ inputgrid_2: initialValues },
             { inputgrid_1: initialValues }]
     })
 
  */
    //    // // // console.log('reset trx', resetTrx)

    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationList(postAction,
            (obj) => {
                customschema(obj, formComps, methods, periode, initialValues)
            });


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])



    useKey('save', () => {
        // // // // console.log('click')
        submitHandler()
    })

    useEffect(() => {


        if (resetTrx) {
            // // // // // console.log('reset transaction', resetTrx, submitdata)

            // // // // console.log(methods.getValues())

            // // // console.log('reset dong', submitdata, methods.getValues())



            if (!_.isEmpty(submitdata)) {

                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(submitdata.inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }
                setTimeout(() => {
                    methods.reset(submitdata)
                }, 0.1);

            } else {



                if (!_.isEmpty(postdata.deletes)) {
                    _.remove(methods.getValues().inputgrid, (v) => {
                        return _.find(postdata.deletes, ['rowid', v.rowid])
                    })

                }


                //   // // // console.log('udah reset dong', _.size(methods.getValues().inputgrid))

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
    // // // console.log(methods.control)

    useEffect(() => {
        if (actions) {
            if (actions === Appresources.TRANSACTION_ALERT.CHANGE_DATE_FILTER) {
                dispatch(fetchDetailBydate(units, v => {




                    const st = store.getState()


                    //                    // // console.log(initialValues, st.auth.datatoedit)

                    methods.reset({ inputgrid: st.auth.datatoedit })


                    dispatch({ type: DATE_FILTER, payload: { datefilter: v } })

                    dispatch({
                        type: CHANGE_MODAL_ITEM_STATE,
                        payload: { actionpick: null, actionvalue: null }
                    })
                }))

            }
            else {

                let data = []

                data.push(postdata)

                const submiting = { formComps, data }





                switch (actions) {

                    case Appresources.BUTTON_LABEL.LABEL_SAVE:
                        dispatch(createData(submiting))
                        // // // // console.log('save')
                        break;
                    case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                        dispatch(updateData(submiting, (v) => {
                            // // // // console.log(v)
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
        }

    }, [actions])


    useKey('add', () => {
        // // // // console.log('click')
        addDataRef.current()
    })




    const submitHandler = async () => {
        //     // // // console.log('submitttt')
        //  await dispatch(DialogLoading())

        await formRefs.current((data, object) => {



            //   // // // // console.log('yeeay')

            //  // // // // console.log('submit object ', object)
            /*
              * 1. Set post Data. 
              *    Jika action UPDATE maka data ditambahkan rowid,
              * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
             */


            //   let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })

            // // // // // console.log(actionlabel)

            //  dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, data, object))
            //            // // // console.log(data, object)



            dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))


        })
    }


    const openDialog = () => {
        //dispatch({ type: MODAL_TRX_OPEN })

        dispatch(DialogConfirmationOnly((postAction === NEWS ? SAVE : UPDATE), null, null, null))
    }


    let button = {
        //   btnLabel: (postAction.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE),
        btnIcon: (postAction.match(NEWS) ? 'save' : 'edit'),
        addClickHandler: submitHandler//openDialog/

    }

    const defaultDataValue = { gangcode: units[0] }





    const RenderForm2 = useMemo(
        () => {
            // // // // console.log('render lagi')
            /*         if (_.isEmpty(formValidationSchema) || !formComps)
                        return <LoadingStatus msg='Setup Validation Schema' />
             */
            return (
                <Segment raised className="form-container">
                    <Header dividing as='h4' icon='dashboard' content={`Unit : ${units[0]} / ${units[1]}`} floated='left' />
                    <Header dividing as='h4' icon='calendar alternate outline' content={`Periode Transaksi : ${dateFormat(periode, " mmm yyyy")}`} floated='right' />

                    <FormUI as={'form'}  >
                        <FormProvider {...methods} raised style={{ marginBottom: '50px' }} >
                            <ComponentAdaptersGroupArray
                                key="0.componentgroup"
                                OnClickRef={formRefs}
                                // addRef={addDataRef}
                                methods={methods}
                                defaultDataValue={defaultDataValue}
                                postAction={postAction}
                            />
                            {/* <Tab panes={panes} onTabChange={(e, data) => {
                                // // // console.log(methods.formState)

                            }} /> */}
                        </FormProvider>
                    </FormUI>
                </Segment>
            )
        }, [initialValues])


    if (!formComps || _.isEmpty(formValidationSchema))
        return <LoadingStatus />

    //// // // // console.log(formValidationSchema)

    return (
        <ContentHeader
            title={title}
            btn1={button}
        >
            {RenderForm2}
        </ContentHeader>
    );

}

const customschema = (formValidationSchema, formComps, methods, periode, initialValues) => {

    let customSchema
    const { setValue, getValues } = methods

    yup.addMethod(yup.array, 'checkVerif', function (fields) {
        return this.test('checkVerif', 'checkVerif', function (array, val) {

            let errors = []
            let errors2 = []

            //          // // console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // // // console.log(v)
                // // // console.log(v.vehdate, dateFormat(periode,'mm/yyyy'))


                // // // console.log(_.size(initialValues))
                // console.log(methods.control)
                if (!_.isNil(methods.control._formState.touchedFields.inputgrid)){
                    if(_.get(_.find(methods.control._formState.touchedFields.inputgrid,'checkmandor'),'checkmandor') == true){
                        // console.log(_.get(_.find(methods.control._formState.dirtyFields.inputgrid,'checkmandor'),'checkmandor'))
                        // console.log('hehe tes')
                        // console.log((methods.control._formState.touchedFields.inputgrid))
                        // setValue(`${this.path}[${index}].verified1`,  UserInfo().loginid, { shouldDirty: true })
                        errors.push(_.findLastIndex(methods.control._formState.touchedFields.inputgrid))
                        // console.log(index)
                    }

                    // if(_.get(_.find(methods.control._formState.dirtyFields.inputgrid,'checkmandor'),'checkmandor') == true){
                    //     // console.log(_.get(_.find(methods.control._formState.dirtyFields.inputgrid,'checkmandor'),'checkmandor'))
                    //     // console.log('hehe tes')
                    //     // setValue(`${this.path}[${index}].verifieddate1`,  dateFormat(new Date(),'dd-mm-yyyy'), { shouldDirty: true })
                    //     errors.push(index)
                    // }
                    if(_.get(_.find(methods.control._formState.touchedFields.inputgrid,'checkkerani'),'checkkerani') == true){
                        // console.log(_.get(_.find(methods.control._formState.dirtyFields.inputgrid,'checkmandor'),'checkmandor'))
                        // console.log('hehe tes')
                        // setValue(`${this.path}[${index}].verifieddate2`, dateFormat(new Date(),'dd-mm-yyyy'), { shouldDirty: true })
                        errors2.push(_.findLastIndex(methods.control._formState.touchedFields.inputgrid))
                    }

                    // if(_.get(_.find(methods.control._formState.dirtyFields.inputgrid,'checkkerani'),'checkkerani') == true){
                    //     // console.log(_.get(_.find(methods.control._formState.dirtyFields.inputgrid,'checkmandor'),'checkmandor'))
                    //     // console.log('hehe tes')
                    //     // setValue(`${this.path}[${index}].verified2`,  UserInfo().loginid, { shouldDirty: true })
                    //     errors.push(index)
                    // }
                }
                // if (){

                // } else {

                // }
              
            })

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                if(!_.isNil(getValues(`${this.path}[${errors[0]}].checkmandor`))){
                    setValue(`${this.path}[${errors[0]}].verified1`,  UserInfo().loginid, { shouldDirty: true })
                    setValue(`${this.path}[${errors[0]}].verifieddate1`,new Date(), { shouldDirty: true })
                }
                if(!_.isNil(getValues(`${this.path}[${errors2[0]}].checkkerani`))){
                    setValue(`${this.path}[${errors2[0]}].verifieddate2`, new Date(), { shouldDirty: true })
                    setValue(`${this.path}[${errors2[0]}].verified2`,  UserInfo().loginid, { shouldDirty: true })
                }
                return true
                // return this.createError(
                //     // { path: `${this.path}[${errors[0]}].vehdate`, message: 'The input doesn`t match with transaction period' }
                // )
            }

        });

    })






    if (formValidationSchema) {
        customSchema = formValidationSchema.concat(
            yup.object().shape({
                inputgrid: yup.array().checkVerif()
                // inputgrid: yup.array()
                //     .calculateHMKKM(_.keys(_.pickBy(formComps, (x) => { return x.isunique }))).periodDoesntMatch().requiredReason()
                //  .test2(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))

            })
        )
    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}


const mapStateToProps = (state) => {

    return {
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComps: getFormListComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        actionlabel: state.auth.actionlabel,
        resetTrx: state.auth.resetTrx,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
    }

}

export default connect(mapStateToProps, { DialogConfirmation, DialogLoading })(Forms)