import React, { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, connect, useSelector } from 'react-redux'
import { Form as FormUI, Label, Header, Segment, SegmentGroup, Button, Grid, Select } from 'semantic-ui-react'
import { useForm, FormProvider, appendErrors } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation } from "react-router-dom";
import dateFormat, { masks } from "dateformat";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { Appresources } from "../../../templates/ApplicationResources";
import { ShowLov, resetLov, DialogConfirmation, populateList, resetTransaction } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroupArray from "../../../templates/forms/ComponentAdaptersGroupArray";
import { getFormListComponent, getFormComponent, UniquePropertyTest, useYupValidationResolver, FormDefaultValidation, clearCacheData, checkDuplicateRows, getFormComponentv2, InitValidation, InitValidationList, getFilterComponent } from "../../../../utils/FormComponentsHelpler";
import { NEWS } from "../../../Constants"
import { updateData, createData } from "./FormAction";
import '../../../Public/CSS/App.css'
import { HIDDEN_LIST, RESET_DELETE_LIST, RESET_HIDDEN_LIST, SAVE, SET_TRANSACTION_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";
import store from "../../../../redux/reducers";
import ComponentAdaptersMixed from "../../../templates/forms/ComponentAdaptersMixed";

const Forms = ({ filterComps, title, periode, units, actions, formComps, initialValues, postdata, formValidationSchema, resetTrx, submitdata, actionlabel, hidden }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();
    let filters = initialValues
    // // console.log(_.get(_.findLast(hidden,'vehiclegroupcode1'),'vehiclegroupcode1'))
    // let filters = _.get(_.findLast(hidden,'vehiclegroupcode1'),'vehiclegroupcode1') == "ALL" ? initialValues :_.filter(initialValues,_.findLast(hidden,'vehiclegroupcode1'))
    // let filters = _.filter(initialValues,_.findLast(hidden,'vehiclegroupcode2'))
    const postAction = loc.pathname.split('/').pop()

    useEffect(() => {
        // if (_.isEmpty(formComps))
        //     navigate('../')

        /** initialized default validation schema form */
        InitValidationList(postAction,
            (obj) => {
                customschema(obj, formComps, methods)
            });


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])
    // let g
    _.map(filterComps, (v, i) => {
        // // console.log(_.get(_.findLast(hidden,v.registername),'vehiclegroupcode1displayonly'))
        // // console.log(filterComps[i])
        if (_.get(_.findLast(hidden, v.registername), 'vehiclegroupcode1displayonly') == 'ALL') {
            filters = _.filter(initialValues, _.findLast(hidden, 'vehiclegroupcode2displayonly'))
        } else {
            filters = _.filter(filters, _.findLast(hidden, v.registername))
            // g=_.findLast(hidden,v.registername)
        }
        // // console.log(v.registername,filters)
    })
    // // console.log(filters)
    const resolver = useYupValidationResolver(formValidationSchema);
    // // console.log(_.findLast(hidden,'vehiclegroupcode2displayonly'))
    // // console.log(_.filter(initialValues,{vehiclegroupcode1 : 'DT'}))
    // // console.log(_.filter(initialValues,{vehiclegroupcode1 : 'DT'}))
    const methods = useForm({ mode: 'onBlur', resolver, values: /*filters &&*/ { inputgrid: filters, vehiclegroupcode2displayonly: _.find(_.findLast(hidden, 'vehiclegroupcode2displayonly')), vehiclegroupcode1displayonly: _.find(_.findLast(hidden, 'vehiclegroupcode1displayonly')) } })
    // // console.log(control)
    //   filters = _.filter(initialValues,_.findLast(control._formValues.vehiclegroupcode1,'vehiclegroupcode1'))
    // // console.log(control._formValues.vehiclegroupcode1)
    // const tes = _.filter(initialValues,{vehiclegroupcode1 : 'DT'})
    // // console.log(filters,methods)


    // useEffect(() => {
    // let s = control._formState.dirtyFields
    // // console.log(_.get(control._formValues.filter[1],'vehiclegroupcode1'),control._formValues.filter)
    // initialValues = _.filter(initialValues,_.findLast(control._formValues.vehiclegroupcode1,'vehiclegroupcode1'))

    // if (!_.isUndefined(_.get(control._formValues.filter[1],'vehiclegroupcode1'))) {
    //     // // console.log(control._formValues.filter)
    //     _.map(control._formValues.filter,(v,i)=>{
    //         filters = _.filter(initialValues,v)

    //     })
    //     // // console.log(_.filter(initialValues,))
    //     // // console.log('1',filters)
    // } else {
    //     filters = initialValues
    //     // // console.log('2')
    // }
    // // console.log(filters)
    // else {
    //         filters = initialValues
    //     }
    // // console.log('hehe')
    //     // // console.log(filters)
    // }, [filters])
    // // console.log(initialValues)

    const submitHandler = () => formRefs.current((data, object) => {

        //   // console.log('yeeay')

        //  // console.log('submit object ', object)
        /*
          * 1. Set post Data. 
          *    Jika action UPDATE maka data ditambahkan rowid,
          * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
         */
        // let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })
        // dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, data, object))
        dispatch(DialogConfirmation((actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? SAVE : UPDATE), null, data, object))



    })

    let button = {
        // btnLabel: (postAction.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE),
        btnIcon: (postAction.match(NEWS) ? 'save' : 'edit'),
        addClickHandler: submitHandler
    }

    useEffect(() => {


        if (resetTrx) {
            // // // console.log('reset transaction', resetTrx, submitdata)

            // // console.log(methods.getValues())

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

            const submiting = { formComps, data }

            //  // console.log('submit', submiting)


            switch (actions) {

                case Appresources.BUTTON_LABEL.LABEL_SAVE:
                    dispatch(createData(submiting))

                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    // dispatch(updateData(submiting))    
                    dispatch(updateData(submiting, (v) => {
                        // // console.log('hehe',v)
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                            // console.log('hehe')
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

    /* 
        if (actions) {
    
            let data = []
            data.push(postdata)
    
            const submiting = { formComps, data }
    
            switch (actions) {
    
                case Appresources.BUTTON_LABEL.LABEL_SAVE:
    
                    // // console.log('masuuk')
                    dispatch(createData(submiting, (v) => {
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
                            //    setTimeout(navigate(-1), 1000);
    
                        }
                    }))
    
                    break;
                case Appresources.BUTTON_LABEL.LABEL_UPDATE:
                    dispatch(updateData(submiting, (v) => {
                        // console.log(submiting)
                        if (v === Appresources.TRANSACTION_ALERT.SAVE_SUCCESS) {
    
                        }
                        //navigate(-1)
                    }))
                    break;
                default:
                    break;
            }
    
        }
     */
    // // console.log(_.findLast(hidden,'vehiclegroupcode1'))
    // const select= useSelector((state) => state.auth.hiddenlist)
    const defaultDataValue = { tdate: units[0] }

    // const locationOption= [
    //     { key: 'Kebun', value: 'Kebun', text: 'Kebun' },
    //     { key: 'PKS', value: 'PKS', text: 'PKS' },
    // ]

    // const groupOptions = [
    //     { key: 'DT', value: 'DT', text: 'Dump Truck' },
    //     { key: 'SM', value: 'SM', text: 'Sepeda Motor' },
    //     { key: 'AM', value: 'AM', text: 'Ambulance' },
    //     { key: 'BS', value: 'BS', text: 'Bus Sekolah' },
    //   ]
    //     const LabelFilter= () =>{
    //         return (
    //             <Grid style={{zIndex: '100000'}} columns='equal'>
    //     <Grid.Column>
    //     <Select placeholder='Select Your Location' options={locationOption} 
    //     // defaultValue='Kebun'
    //     // value={hidden[0]}
    //      onChange={(e,data) => {
    //         dispatch({ type:HIDDEN_LIST, payload: {vehiclegroupcode2:data.value} })
    //     }}
    //     />
    //     </Grid.Column>
    //     <Grid.Column >
    //     <Select placeholder='Select your Group' options={groupOptions} 
    //     //  defaultValue='DT'
    //     // value={hidden[1]}
    //      onChange={(e,data) => {
    //         // // console.log(data)
    //         dispatch({ type:HIDDEN_LIST, payload: {vehiclegroupcode1:data.value} })
    //     }}/>
    //     </Grid.Column>
    //   </Grid>
    //         )
    //     }
    //// console.log(customSchema)
    // const RenderForm2 = useMemo(
    //     () => {
    const RenderForm = useMemo(
        () => {
            if (!formComps)
                return <LoadingStatus />

            return (
                <Segment raised className="form-container">
                    <Header dividing as='h4' icon='dashboard' content={`Tanggal : ${units[0]}`} floated='left' />
                    <Header dividing as='h4' icon='calendar alternate outline' content={`Periode Transaksi : ${dateFormat(periode, " mmm yyyy")}`} floated='right' />
                    <FormUI as={'form'}  >
                        <FormProvider {...methods} raised style={{ marginBottom: '50px' }} >
                            <ComponentAdaptersMixed
                                key="0.componentgroupheader"
                                formRefs={formRefs}
                                methods={methods}
                                defaultDataValue={defaultDataValue}
                                postAction={postAction}
                            />
                        </FormProvider>
                    </FormUI>
                </Segment>
            )
        }, [filters])
    return (
        <ContentHeader
            title={title}
            btn1={button}
        // children={<RenderForm />} 
        >
            {RenderForm}
        </ContentHeader>
    );

}

const customschema = (formValidationSchema, formComps, methods) => {

    let customSchema
    const { setValue, getValues } = methods

    yup.addMethod(yup.array, 'setHour', function (fields) {
        return this.test('setHour', 'value', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, awal = 0, akhir = 0, accum = 0, accumdebit = 0, errors = []

            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)
                total = v.jam_standby + v.jam_breakdown
                if (total > 7) {
                    errors.push(index)
                    // return;
                }
            })

            if (errors.length === 0) {
                return true
            } else {
                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })

                return this.createError(
                    {
                        // path: `${this.path}[${errors[0]}].jam_standby`, message: 'invalid time' ,
                        path: `${this.path}[${errors[0]}].jam_breakdown`, message: 'Stand By / Breakdown Hour, exceeds a value of 7'
                    }
                )
            }

        });

    })
    yup.addMethod(yup.array, 'setStandby', function (fields) {
        return this.test('setStandby', 'Required', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, jam_standby = 0, jam_breakdown = 0, accum = 0, accumdebit = 0, errors = []

            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)

                // // console.log(v.jam_standby)
                jam_standby = v.jam_standby
                jam_breakdown = v.jam_breakdown
                total = v.jam_standby + v.jam_breakdown
                if (!_.isNull(v.jam_standby)) {
                    if (v.jam_breakdown != 0) {
                        if (_.isNull(v.reason_standby)) {
                            errors.push(index)
                        }
                    }
                    // return;
                }
            })

            if (errors.length === 0) {
                return true
            } else {

                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // // console.log(jam_standby,jam_breakdown)
                return this.createError(
                    {
                        // path: `${this.path}[${errors[0]}].jam_standby`, message: 'invalid time' ,
                        path: `${this.path}[${errors[0]}].reason_standby`, message: 'Required'
                    }
                )
            }

        });

    })
    yup.addMethod(yup.array, 'setBreakdown', function (fields) {
        return this.test('setBreakdown', 'Required', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, total = 0, jam_standby = 0, jam_breakdown = 0, accum = 0, accumdebit = 0, errors = []

            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)

                // // console.log(v.jam_standby)
                jam_standby = v.jam_standby
                jam_breakdown = v.jam_breakdown
                total = v.jam_standby + v.jam_breakdown
                // // console.log(jam_breakdown)
                if (!_.isNull(v.jam_breakdown)) {
                    if (v.jam_breakdown != 0) {
                        if (_.isNull(v.reason_breakdown)) {
                            errors.push(index)
                        }
                    }
                    // return;
                }
            })

            if (errors.length === 0) {
                return true
            } else {

                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // // console.log(jam_standby,jam_breakdown)
                return this.createError(
                    {
                        // path: `${this.path}[${errors[0]}].jam_standby`, message: 'invalid time' ,
                        path: `${this.path}[${errors[0]}].reason_breakdown`, message: 'Required'
                    }
                )
            }

        });

    })

    yup.addMethod(yup.array, 'setReasonStandby', function (fields) {
        return this.test('setReasonStandby', 'Required', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, errors = []

            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)
                // // console.log(v.reason_standby)

                // // console.log(v.jam_standby)
                // if (!_.isNull(v.jam_standby)) {
                // if (v.jam_breakdown != 0 ){
                // // console.log(v.reason_standby)
                if (!_.isNull(v.reason_standby) && !_.isNull(v.jam_standby)) {
                    if (v.reason_standby !== 'N/A ') {
                        if (_.isNull(v.jam_standby) || v.jam_standby == 0) {
                            errors.push(index)
                        }
                    } else {
                        // // console.log(v.tid)
                        setValue(`${this.path}[${[index]}].jam_standby`, null, { shouldDirty: true })
                    }
                    // else if (v.reason_standby == 'N/A ') {
                    //     // // console.log(index)
                    //     error.push(index)
                    // }
                    // }
                    // }
                    // return;
                }
            })

            if (errors.length === 0) {
                return true
            } else {

                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // // console.log(jam_standby,jam_breakdown)
                return this.createError(
                    {
                        // path: `${this.path}[${errors[0]}].jam_standby`, message: 'invalid time' ,
                        path: `${this.path}[${errors[0]}].jam_standby`, message: 'Required'
                    }
                )
            }

        });

    })
    yup.addMethod(yup.array, 'setReasonBreakdown', function (fields) {
        return this.test('setReasonBreakdown', 'Required', function (array, val) {

            //// // console.log('limitting', this)

            //let msg = checkDuplicateRows(array, fields, field)
            //   return true;

            let msg, errors = []

            _.mapValues(val.originalValue, (v, index) => {
                // // // console.log(v)

                // // console.log(v.jam_standby)
                // if (!_.isNull(v.jam_standby)) {
                // if (v.jam_breakdown != 0 ){
                if (!_.isNull(v.reason_breakdown) && !_.isNull(v.jam_breakdown)) {
                    if (v.reason_breakdown !== 'N/A') {
                        if (_.isNull(v.jam_breakdown) || v.jam_breakdown == 0) {
                            errors.push(index)
                        }
                    } else {
                        setValue(`${this.path}[${index}].jam_breakdown`, null, { shouldDirty: true })
                    }
                    // }
                    // }
                    // return;
                }
            })

            if (errors.length === 0) {
                return true
            } else {

                // setValue(`${this.path}[${errors[0]}].to_qty`, 999, { shouldDirty: true })
                // // console.log(jam_standby,jam_breakdown)
                return this.createError(
                    {
                        // path: `${this.path}[${errors[0]}].jam_standby`, message: 'invalid time' ,
                        path: `${this.path}[${errors[0]}].jam_breakdown`, message: 'Required'
                    }
                )
            }

        });

    })




    if (formValidationSchema) {
        customSchema = formValidationSchema.concat(
            yup.object().shape({
                inputgrid: yup.array()
                    .setHour().setStandby().setBreakdown().setReasonStandby().setReasonBreakdown(),
                // inputgrid : yup.array().
                //  .test2(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))

            })
        )
    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}


const mapStateToProps = (state) => {
    return {
        hidden: state.auth.hiddenlist,
        periode: state.auth.tableDynamicControl.dateperiode,
        units: state.auth.transactionInfo,
        actions: state.auth.modals.actionpick,
        formComps: getFormListComponent(),
        filterComps: getFilterComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        resetTrx: state.auth.resetTrx,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        actionlabel: state.auth.actionlabel,
    }

}

export default connect(mapStateToProps, { DialogConfirmation })(Forms)