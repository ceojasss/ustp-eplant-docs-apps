import React, { useState, useEffect, useMemo } from "react"
import { useDispatch, connect } from 'react-redux'
import { Button, Dimmer, Divider, Form as FormUI, Grid, Header, Icon, Loader, Message, Search, Segment, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react'
import { useForm, FormProvider, Controller } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
// *library imports placed above ↑
// *local imports placed below ↓
import reducer from "./FormReducer"

import '../../../Public/CSS/App.css'
import ContentHeader from '../../../templates/ContentHeader'
import { DialogConfirmation, setupSpreadsheet, } from "../../../../redux/actions"
import { changeReducer, getColumn, parseDatetoString, QueryData, QueryDataDetail, QueryReducerID } from "../../../../utils/FormComponentsHelpler";

import '../../../Public/CSS/App.css'
import { fetchDataDetails, fetchDatas } from "./FormAction";
import { RESET_ERROR_MODAL_STATE, SET_ACTIVE_DATA_ROW } from "../../../../redux/actions/types";
import LoadingStatus from "../../../templates/LoadingStatus";
import FormComponentParam from "../../../templates/forms/FormComponentParam";
import { VIEW_EXCEL, VIEW_EXCEL_NEW, VIEW_PDF } from "../../../Constants";
import { LegacyReportURL, openXLSView, ReportUrl } from "../../../../utils/DataHelper";

import RenderTable from "../../../templates/Tablev8";

const Form = ({ data, reducerid, activeRow, datadetail, loadingdata }) => {

    const { route } = useParams();
    const loc = useLocation()
    const dispatch = useDispatch()


    const navigate = useNavigate()

    const [xlsRun, setXlsRun] = useState(false)


    const [errMessage, setErrMessage] = useState('')


    const methods = useForm({ mode: 'onBlur' })

    const title = `Report Parameter - ${route.toLocaleUpperCase()}`

    const columns = useMemo(() => _.map(getColumn(data), (v) => ({ header: v.prompt_ina, accessor: v.tablecomponent, className: v.itemclass })), [data])

    const setSelectedRow = (val, idx) => {
        //// console.log('ceck')
        setErrMessage('')
        dispatch({ type: SET_ACTIVE_DATA_ROW, payload: _.assign(val, { index: idx }) })

    }


    const btnhandler = async (_type) => {

        const reportDetail = datadetail[0]

        let params = '', reportUrls = '';
        setErrMessage(``)

        let halt = false;


        _.map(reportDetail, (k, v) => {
            //console.log(k.param_display)

            //console.log(k.param_code)

            if (methods.control._fields[k.param_code]?._f.required && _.isNil(methods.getValues(k.param_code))) {

                //          console.log(v)

                setErrMessage(`Parameter ${k.param_display} Tidak Boleh Kosong`)
                halt = true;
                return;
            }

        })

        /*   _.map(methods.getValues(), (k, v) => {
  
              //    console.log(v, methods.control._fields[v]?._f.required, _.isNil(methods.getValues(v)))
  
              if (methods.control._fields[v]?._f.required && _.isNil(methods.getValues(v))) {
  
                  //          console.log(v)
  
                  setErrMessage(`${v} Tidak Boleh Kosong`)
                  halt = true;
                  return;
              }
          }) */



        if (halt || _.isUndefined(reportDetail))
            return;


        _.map(reportDetail, (v) => {
            let val = methods.getValues(v.param_code)
            let param = v.param_code

            if (val instanceof Object) {


                if (val instanceof Date) {
                    if (v.itemtype === 'yearpicker') {
                        val = val.getFullYear()
                    }
                    else if (v.itemtype = 'datepicker') {
                        val = parseDatetoString(val)
                    }
                } else {
                    val = Object.values(val)[0]
                }
            }
            else {
                if (v.itemtype === 'radiogroup') {

                    if (v.isvalueasreport === 'Y') {
                        param = 'report'
                    }

                }
            }

            val = _.isUndefined(val) ? '' : val

            params += `&${param}=${val}`
        })


        // console.log(activeRow)

        if (_.isEmpty(activeRow.route)) {


            console.log('masuk sini')


            if (activeRow.reportname_status === 'MULTIPLE') {
                reportUrls = LegacyReportURL(_type) + params
            }
            else {

                reportUrls = LegacyReportURL(_type) + `&report=${activeRow.reportname + params} `

            }


            window.open(reportUrls, `${activeRow.reportdesc}_${_type}`)
        }
        else {
            if (_type === VIEW_PDF) {
                reportUrls = LegacyReportURL(_type) + `&report=${activeRow.reportname + params} `
                window.open(reportUrls, `${activeRow.reportdesc}_${_type}`)
            } else if (_type === VIEW_EXCEL) {
                setXlsRun(true)

                await ReportUrl(_type, activeRow, params, () => {
                    setXlsRun(false)

                })
            } else {

                const obj = { ...activeRow, parameters: params, url: 'executivesummary/generate' }

                const doc = JSON.stringify({ ...activeRow, parameters: params, url: 'executivesummary/generate' })

                const str = btoa(doc)


                //console.log(obj, str)

                const newTab = window.open(`/preview?doc=${str}`, '_blank');
                newTab.focus(); // Optional: Focus on the new tab



            }

        }

    }




    useEffect(() => {

        // // console.log('changes effect')

        changeReducer(loc.pathname.replaceAll('/', ''), reducer)


        if (!_.isEmpty(reducerid) || loc.pathname.replaceAll('/', '') === reducerid)
            dispatch(fetchDatas(route))

        setErrMessage('')

        return () => {
            dispatch({ type: RESET_ERROR_MODAL_STATE })
        };


    }, [route, reducerid, loc.pathname])


    useEffect(() => {
        //  // // console.log(activeRow, activeRow.index)

        if (!_.isUndefined(activeRow)) {

            methods.reset()
            dispatch(fetchDataDetails(route, activeRow.registryid))

        }

    }, [activeRow])


    const FormParams = useMemo(() => {


        return <FormProvider {...methods}>
            {_.map(datadetail[0],
                (v, i) => {
                    return <Controller
                        key={`cts${i} `}
                        {...methods}
                        name={v.param_code}
                        rules={{
                            required: v.isrequired === 'Y',
                        }}
                        render={(field) => <FormComponentParam
                            key={`cts${i} `}
                            {...field}
                            {...v}
                            comp={datadetail[0]} />}
                    />
                })
            }
        </FormProvider >
    }, [datadetail])

    const RenderForm = useMemo(() => {
        return <Segment raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px", height: '80vh' }}>
            <Grid columns={2} divided /*  textAlign='center' */>
                {/* <Divider vertical>Or</Divider> */}
                <Grid.Row  >
                    <Grid.Column >
                        <Header content="List Report" />
                        {/* <ListHeader /> */}
                        <RenderTable
                            data={data}
                            activeRow={activeRow}
                            setSelectedRow={setSelectedRow}
                        />
                    </Grid.Column> {loadingdata ? <Grid.Column  > <Segment basic loading style={{ height: '55vh' }} />
                    </Grid.Column> :
                        <Grid.Column >
                            <Header content={`${(!_.isEmpty(activeRow) ? activeRow.reportdesc + " - " : '')} Parameters`} />
                            <FormUI size="small"> {FormParams} </FormUI>
                            {errMessage && <Message size='small' content={errMessage} error />}
                            <Divider />
                            <Button.Group widths='3' size="tiny">
                                <Button color='red'
                                    size='tiny'
                                    floated="left"
                                    fluid
                                    icon='file pdf outline'
                                    content='Run PDF'
                                    style={{ marginRight: '0.1cm' }}
                                    labelPosition="left" onClick={() => btnhandler(VIEW_PDF)} />
                                <Button color='green'
                                    size='tiny'
                                    floated="right"
                                    style={{ marginLeft: '0.1cm' }}
                                    fluid
                                    icon='file excel outline'
                                    content='Run Excel'
                                    loading={xlsRun}
                                    labelPosition="left" onClick={() => btnhandler(VIEW_EXCEL)} />
                                {activeRow?.route && <Button color='green'
                                    size='tiny'
                                    floated="right"
                                    style={{ marginLeft: '0.1cm' }}
                                    fluid
                                    icon='file excel outline'
                                    content='Run Excel New'
                                    loading={xlsRun}
                                    labelPosition="left" onClick={() => btnhandler(VIEW_EXCEL_NEW)} />}
                            </Button.Group>
                        </Grid.Column>
                    }
                </Grid.Row>
            </Grid>
        </Segment >
    }, [data, xlsRun, errMessage])


    // // console.log('row active', activeRow)

    if (_.isEmpty(data) || loc.pathname.replaceAll('/', '') !== reducerid)
        return (<LoadingStatus />)



    return (
        <ContentHeader
            title={title}
            btn1={null}
            children={RenderForm} />
    );

}

const mapStateToProps = (state) => {

    return {
        data: QueryData(state),
        datadetail: QueryDataDetail(state),
        reducerid: QueryReducerID(state),
        loadingdata: (!_.isUndefined(state[QueryReducerID(state)]) ? state[QueryReducerID(state)]['loading'] : false),
        activeRow: !_.isUndefined(state[QueryReducerID(state)]) && state[QueryReducerID(state)]['dataActiveRow']
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)