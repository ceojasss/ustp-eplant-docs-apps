import React, { useRef, useState, useEffect, useCallback } from "react"
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
import { HIDDEN_LIST, RESETFILTER, RESET_DELETE_LIST, SAVE, SET_TRANSACTION_STATUS, SET_VALIDATION_SCHEMA, UPDATE } from "../../../../redux/actions/types";
import store from "../../../../redux/reducers";

const Forms = ({ filter, filterComps, title, periode, units, actions, formComps, initialValues, postdata, formValidationSchema, resetTrx, submitdata, actionlabel, hidden }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const formRefs = useRef();
    let filters = _.filter(initialValues, _.findLast(hidden, 'vehiclegroupcode1'))
    const postAction = loc.pathname.split('/').pop()

    useEffect(() => {
        if (_.isEmpty(formComps))
            navigate('../')

        /** initialized default validation schema form */
        InitValidationList(postAction,
            (obj) => {
                customschema(obj, formComps, methods)
            });


        return () => {
            dispatch(resetLov())
        };

    }, [navigate])


    const resolver = useYupValidationResolver(formValidationSchema);
    // // console.log(formValidationSchema)
    // // console.log(_.filter(initialValues,{vehiclegroupcode1 : 'DT'}))
    // // console.log(_.filter(initialValues,{vehiclegroupcode1 : 'DT'}))
    const methods = useForm({ mode: 'onChange', resolver, values: filters && { inputgrid: filters } })
    // const {control} = methods
    // const tes = _.filter(initialValues,{vehiclegroupcode1 : 'DT'})
    // // console.log(filters,methods)



    // useEffect(() => {
    //     // let s = control._formState.dirtyFields
    //     // // console.log(_.get(control._formValues.filter[1],'vehiclegroupcode1'),control._formValues.filter)
    //     dispatch({type:RESETFILTER,payload:false})
    //     if (!_.isUndefined(_.get(control._formValues.filter[1],'vehiclegroupcode1'))) {
    //         // // console.log(control._formValues.filter)
    //         _.map(control._formValues.filter,(v,i)=>{
    //             filters = _.filter(initialValues,v)

    //         })
    //         // // console.log(_.filter(initialValues,))
    //         // // console.log('1',filters)
    //     } else {
    //         filters = initialValues
    //         // // console.log('2')
    //     }
    //     // // console.log(filters)
    //     // else {
    // //         filters = initialValues
    // //     }
    // // // console.log('hehe')
    // //     // // console.log(filters)
    // }, [filter])
    // // // console.log(filters)

    const submitHandler = () => formRefs.current((data, object) => {

        //   // console.log('yeeay')

        //  // console.log('submit object ', object)
        /*
          * 1. Set post Data. 
          *    Jika action UPDATE maka data ditambahkan rowid,
          * 2. Dispatch ke Redux untuk mengisi postdata & action insert/update 
         */
        let postObject = (actionlabel === Appresources.BUTTON_LABEL.LABEL_SAVE ? object : { ...object })
        dispatch(DialogConfirmation((postAction === NEWS ? SAVE : UPDATE), null, data, object))



    })

    let button = {
        btnLabel: (postAction.match(NEWS) ? Appresources.BUTTON_LABEL.LABEL_SAVE : Appresources.BUTTON_LABEL.LABEL_UPDATE),
        btnIcon: 'save',
        addClickHandler: submitHandler
    }

    useEffect(() => {


        if (resetTrx) {
            // // // console.log('reset transaction', resetTrx, submitdata)
            dispatch({ type: RESET_DELETE_LIST })
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
    const select = useSelector((state) => state.auth.hiddenlist)
    const defaultDataValue = { tdate: units[0] }

    const locationOption = [
        { key: 'Kebun', value: 'Kebun', text: 'Kebun' },
        { key: 'PKS', value: 'PKS', text: 'PKS' },
    ]

    const groupOptions = [
        { key: 'DT', value: 'DT', text: 'Dump Truck' },
        { key: 'SM', value: 'SM', text: 'Sepeda Motor' },
        { key: 'AM', value: 'AM', text: 'Ambulance' },
        { key: 'BS', value: 'BS', text: 'Bus Sekolah' },
    ]
    const LabelFilter = () => {
        return (
            <Grid style={{ zIndex: '100000' }} columns='equal'>
                <Grid.Column>
                    <Select placeholder='Select Your Location' options={locationOption}
                        // defaultValue='Kebun'
                        // value={hidden[0]}
                        onChange={(e, data) => {
                            dispatch({ type: HIDDEN_LIST, payload: { vehiclegroupcode2: data.value } })
                        }}
                    />
                </Grid.Column>
                <Grid.Column >
                    <Select placeholder='Select your Group' options={groupOptions}
                        //  defaultValue='DT'
                        // value={hidden[1]}
                        onChange={(e, data) => {
                            // // console.log(data)
                            dispatch({ type: HIDDEN_LIST, payload: { vehiclegroupcode1: data.value } })
                        }} />
                </Grid.Column>
            </Grid>
        )
    }

    //// console.log(customSchema)

    const RenderForm = React.memo(() => {
        if (!formComps)
            return <LoadingStatus />

        return (
            <Segment raised className="form-container">
                <Header dividing as='h4' icon='dashboard' content={`Tanggal : ${units[0]}`} floated='left' />
                <Header dividing as='h4' icon='calendar alternate outline' content={`Periode Transaksi : ${dateFormat(periode, " mmm yyyy")}`} floated='right' />
                <FormUI as={'form'}  >
                    <FormProvider {...methods} raised style={{ marginBottom: '50px' }} >
                        <ComponentAdaptersGroupArray
                            key="0.componentgroup"
                            OnClickRef={formRefs}
                            methods={methods}
                            defaultDataValue={defaultDataValue}
                            postAction={postAction}
                            customfilter={LabelFilter()}
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
                if (total > 8) {
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
                        path: `${this.path}[${errors[0]}].jam_breakdown`, message: 'Hour Stand By / Breakdown exceeds value of 8'
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
                    if (_.isNull(v.reason_standby)) {
                        errors.push(index)
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
                if (!_.isNull(v.jam_breakdown)) {
                    if (_.isNull(v.reason_breakdown)) {
                        errors.push(index)
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


    if (formValidationSchema) {
        customSchema = formValidationSchema.concat(
            yup.object().shape({
                inputgrid: yup.array()
                    .setHour().setStandby().setBreakdown(),
                // inputgrid : yup.array().
                //  .test2(_.keys(_.pickBy(formComps, (x) => { return x.isunique })))

            })
        )
    }

    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: customSchema })


}


const mapStateToProps = (state) => {

    // console.log(state)
    return {
        filter: state.auth.datafilter,
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