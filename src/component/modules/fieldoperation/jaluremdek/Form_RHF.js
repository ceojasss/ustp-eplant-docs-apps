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
import { getFormListComponent, useYupValidationResolver, InitValidationList } from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { SAVE, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";

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

    //  // // console.log(initialValues)

    const methods = useForm({ mode: 'onBlur', resolver, defaultValues: initialValues && { inputgrid: initialValues } })

    /*  const methods = useForm({
         mode: 'onBlur',
         resolver,
         defaultValues: initialValues &&
             [{ inputgrid_2: initialValues },
             { inputgrid_1: initialValues }]
     })
 
  */
    //    // console.log('reset trx', resetTrx)
    useKey('save', () => {
        // // console.log('click')
        submitHandler()
    })
    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationList(postAction,
            (obj) => {
                // customschema(obj, formComps, methods, periode, initialValues)
            });


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])
   

    useEffect(() => {


        if (resetTrx) {
            // // // console.log('reset transaction', resetTrx, submitdata)

            // // console.log(methods.getValues())

            // console.log('reset dong', submitdata, methods.getValues())



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


                //   // console.log('udah reset dong', _.size(methods.getValues().inputgrid))

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
            //// // console.log(actions)


            let data = []

            data.push(postdata)

            const submiting = { formComps, data }



            //     // console.log(submiting, submitdata)

            switch (actions) {
                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))
                    // // console.log('save')
                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting, (v) => {
                        // // console.log(v)
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


    useKey('add', () => {
        // // console.log('click')
        addDataRef.current()
    })




    const submitHandler = async () => {
        //     // console.log('submitttt')
        //   await dispatch(DialogLoading())

        await formRefs.current((data, object) => {



            //   // // console.log('yeeay')

            //  // // console.log('submit object ', object)
            /*
              * 1. Set post Data. 
              *    Jika action UPDATE maka data ditambahkan rowid,
              * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
             */


            //   let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })

            // // // console.log(actionlabel)

            //  dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, data, object))
            //            // console.log(data, object)



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

    const defaultDataValue = { blockid: units[0] }
    console.log(units[0])


    const GroupView = () => <ComponentAdaptersGroupArray
        key="0.componentgroup"
        OnClickRef={formRefs}
        addRef={addDataRef}
        methods={methods}
        defaultDataValue={defaultDataValue}
        postAction={postAction}
    />

    const panes = [
        {
            menuItem: 'Tab 1', render: () => <Tab.Pane content={<ComponentAdaptersGroupArray
                key="0.componentgroup"
                OnClickRef={formRefs}
                addRef={addDataRef}
                methods={methods}
                defaultDataValue={defaultDataValue}
                postAction={postAction}
            />} />
        },
        {
            menuItem: 'Tab 2', render: () => <Tab.Pane content={<ComponentAdaptersGroupArray
                key="1.componentgroup"
                OnClickRef={formRefs}
                addRef={addDataRef}
                methods={methods}
                defaultDataValue={{}}
                postAction={postAction}
            />} />
        },
    ]



    const RenderForm2 = useMemo(
        () => {
            // // console.log('render lagi')
            /*         if (_.isEmpty(formValidationSchema) || !formComps)
                        return <LoadingStatus msg='Setup Validation Schema' />
             */
            return (
                <Segment raised className="form-container">
                    <Header dividing as='h4' icon='dashboard' content={`Block : ${units[0]}`} floated='left' />
                    <Header dividing as='h4' icon='calendar alternate outline' content={`Periode Transaksi : ${dateFormat(periode, " mmm yyyy")}`} floated='right' />

                    <FormUI as={'form'}  >
                        <FormProvider {...methods} raised style={{ marginBottom: '50px' }} >
                            <ComponentAdaptersGroupArray
                                key="0.componentgroup"
                                OnClickRef={formRefs}
                                addRef={addDataRef}
                                methods={methods}
                                defaultDataValue={defaultDataValue}
                                postAction={postAction}
                            />
                            {/* <Tab panes={panes} onTabChange={(e, data) => {
                                // console.log(methods.formState)

                            }} /> */}
                        </FormProvider>
                    </FormUI>
                </Segment>
            )
        }, [])


    if (!formComps || _.isEmpty(formValidationSchema))
        return <LoadingStatus />

    //// // console.log(formValidationSchema)

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

    yup.addMethod(yup.array, 'periodDoesntMatch', function (fields) {
        return this.test('periodDoesntMatch', 'Period Doesnt Match', function (array, val) {

            let errors = []

            //          console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)
                // console.log(v.vehdate, dateFormat(periode,'mm/yyyy'))


                // console.log(_.size(initialValues))
                if (_.size(initialValues) == 0) {

                    if (!_.isUndefined(v.vehdate)) {

                        if (dateFormat(v.vehdate, 'mm/yyyy') != dateFormat(periode, 'mm/yyyy')) {
                            errors.push(index)
                            // return;
                        }
                    }
                } else {
                    if (!_.isNull(v.vehdate)) {

                        if (dateFormat(v.vehdate, 'mm/yyyy') != dateFormat(periode, 'mm/yyyy')) {
                            errors.push(index)
                            // return;
                        }
                    }
                }
            })

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })

                return this.createError(
                    { path: `${this.path}[${errors[0]}].vehdate`, message: 'The input doesn`t match with transaction period' }
                )
            }

        });

    })


    yup.addMethod(yup.array, 'calculateHMKKM', function (fields) {
        return this.test('calculateHMKKM', 'invalid time value', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, awal = 0, akhir = 0, accum = 0, accumdebit = 0, errors = []

            let st = store.getState()

            //          console.log('data', st)


            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)

                //      console.log(v.tid)

                //                console.log('cek', v.tid, st.auth.deletelist, _.find(st.auth.deletelist, ['tid', v.tid]))

                if (_.find(st.auth.deletelist, ['tid', v.tid]))
                    return;



                if (v.from_time > v.to_time) {
                    errors.push(index)
                    // return;
                }
            })

            if (errors.length === 0) {
                return true
            } else {
                setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })

                return this.createError(
                    { path: `${this.path}[${errors[0]}].from_time`, message: 'invalid time' }
                )
            }

        });

    })


    if (formValidationSchema) {
        customSchema = formValidationSchema.concat(
            yup.object().shape({
                inputgrid: yup.array()
                    .calculateHMKKM(_.keys(_.pickBy(formComps, (x) => { return x.isunique }))).periodDoesntMatch()
                //  .test2(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))

            })
        )
    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}


const mapStateToProps = (state) => {

    console.log(state)

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