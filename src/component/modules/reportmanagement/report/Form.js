import React, { useState, useEffect, useMemo } from "react"
import { useDispatch, connect, useSelector } from 'react-redux'
import { Icon, Label, Loader, Popup, Progress, Segment, } from 'semantic-ui-react'
import { useForm } from "react-hook-form";
import _ from 'lodash'
import { useLocation, useParams } from "react-router-dom";
// *library imports placed above ↑
// *local imports placed below ↓
import reducer from "./FormReducer"

import '../../../Public/CSS/App.css'
import ContentHeader from '../../../templates/ContentHeader'
import { DialogConfirmation, } from "../../../../redux/actions"
import { changeReducer, filterHandler, getTitle, periodHandler, pickDateFromMillsec, QueryData, QueryDataDetail, QueryDatePeriode, QueryReducerID, QuerySearch, searchHandler } from "../../../../utils/FormComponentsHelpler";

import '../../../Public/CSS/App.css'
import { fetchDataDetails, fetchDatas, fetchfilter } from "./FormAction";
import { RESET_ERROR_MODAL_STATE } from "../../../../redux/actions/types";
import LoadingStatus from "../../../templates/LoadingStatus";

import { DownloadReportUrl } from "../../../../utils/DataHelper";
import { toast } from "react-toastify";

const Form = ({ data, reducerid, activeRow, search, dateperiode }) => {

    const { route } = useParams();
    const loc = useLocation()
    const dispatch = useDispatch()

    const sessions = useSelector(s => s.auth.menu.user)

    const [xlsRun, setXlsRun] = useState(null)



    const btnhandler = async (_type) => {

        if (route === 'kebun' && _.isEmpty(search)) {
            toast.error('Kebun Belum Dipilih', {
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); return;
        } else {
            setXlsRun(_type.registryid)


            let _obj = {}

            _obj['route'] = `managementreport/${_type.registryid}`
            _obj['reportdesc'] = _type.reportdesc


            //console.log('data ', _.remove(_.keys(_type), x => !_.includes(x, 'param#')))
            //  _obj.route
            // ? IF DATA KEY like  PARAM# -> set As param 

            let extras = ''

            _.mapKeys(_type, (value, key) => {

                if (_.includes(key, 'param#') && !_.isEmpty(value))
                    extras += `&${_.replace(key, 'param#', '')}=${value}`
            })


            let param

            if (route === 'kebun') {


                param = `p_year=${pickDateFromMillsec(dateperiode, 'YEAR')}&p_month=${pickDateFromMillsec(dateperiode, 'MONTH')}${extras}&p_kbn=${search}`
            }
            else {
                param = `p_year=${pickDateFromMillsec(dateperiode, 'YEAR')}&p_month=${pickDateFromMillsec(dateperiode, 'MONTH')}${extras}`
            }
            //            console.log(sessions.site)

            const downloadfilenames = `${_type.reportdesc}_${pickDateFromMillsec(dateperiode, 'PERIOD')}_${sessions.site}`

            try {
                await DownloadReportUrl(_type, _obj, param, downloadfilenames, (success) => {



                    if (!success) {
                        toast.error('No Data To Download.!', {
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }

                    setXlsRun('')
                })

            } catch (error) {
                setXlsRun('')
            }
        }
    }

    const methods = useForm({ mode: 'onBlur' })



    useEffect(() => {


        changeReducer(loc.pathname.replaceAll('/', ''), reducer)


        if (!_.isEmpty(reducerid) || loc.pathname.replaceAll('/', '') === reducerid) {
            dispatch(fetchDatas(route))
            dispatch(fetchfilter())
        }

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


    //    console.log(data)

    const RenderForm = useMemo(() => _.map(data[0], (x, s) => {
        return <Popup key={`psg${s} `} content={x.reportdesc} basic inverted pinned
            size="mini"
            trigger={<Segment.Group compact horizontal key={`sg${s} `}
                style={{
                    margin: '3px',
                    overflowX: 'auto'
                }} >
                {(xlsRun === x.registryid ?
                    <Label
                        basic
                        color="green"
                        style={{ width: '280px' }}
                    >
                        <Icon name='hourglass end' loading color="green" />
                        {'Downloading ' + (x.reportdesc?.length > 25 ? `${x.reportdesc.substring(0, 25)}...` : x.reportdesc)}
                    </Label> :
                    <Label
                        as='a' basic style={{ width: '280px' }}
                        onClick={() => _.isEmpty(xlsRun) && btnhandler(x)}
                    ><Icon name='file excel' />
                        {(x.reportdesc?.length > 35 ? `${x.reportdesc.substring(0, 35)}...` : x.reportdesc)}
                    </Label>
                )}

            </Segment.Group >}
        />

    }
    ), [data[0], xlsRun, dateperiode, search])


    if (_.isEmpty(data) || loc.pathname.replaceAll('/', '') !== reducerid)
        return (<LoadingStatus />)


    return (
        <ContentHeader
            title={getTitle(data) + (route !== 'costbook' ? ` - ${route} ` : '')}
            btn1={null}
            periodaction={periodHandler({ dateperiode })}
            filteraction={route === 'kebun' && { type: 'select', ...filterHandler({ search }) }}
            children={RenderForm} />
    );

}

const mapStateToProps = (state) => {

    return {
        data: QueryData(state),
        search: QuerySearch(state),
        dateperiode: QueryDatePeriode(state),
        reducerid: QueryReducerID(state),
        loadingdata: (!_.isUndefined(state[QueryReducerID(state)]) ? state[QueryReducerID(state)]['loading'] : false),
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)