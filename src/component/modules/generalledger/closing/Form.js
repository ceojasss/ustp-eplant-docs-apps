import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, connect } from 'react-redux'
import { Step, Icon, Segment, Header, Message, Button, Popup, Label, Modal } from 'semantic-ui-react'
import _ from 'lodash'
import { useLocation, useParams } from "react-router-dom";
// *library imports placed above ↑
// *local imports placed below ↓
import reducer from "./FormReducer"

import '../../../Public/CSS/App.css'
import ContentHeader from '../../../templates/ContentHeader'
import { DialogConfirmation, ViewDataBasic, } from "../../../../redux/actions"
import { changeReducer, getData, parseDatetoString, periodHandler, QueryData, QueryDatePeriode, QueryReducerID } from "../../../../utils/FormComponentsHelpler";

import '../../../Public/CSS/App.css'
import { ROUTES, closeperiod, fetchDatas, startProcess, updateData } from "./FormAction";
import { RESET_ERROR_MODAL_STATE } from "../../../../redux/actions/types";
import LoadingStatus from "../../../templates/LoadingStatus";




const Form = ({ data, dataview, reducerid, activeRow, loadingdata, errorStatus, dateperiode, closingProcess, closingError }) => {

    const { route } = useParams();
    const loc = useLocation()
    const dispatch = useDispatch()

    const title = `Monthly Period Closing`


    const btnhandler = () => {
        dispatch(startProcess())
    }

    const closehandler = () => {
        dispatch(closeperiod())
    }

    console.log(dateperiode)

    let button = {
        btnIcon: 'unlock alternate',
        addClickHandler: closehandler,
        btnLabel: 'Period Transaction is',
        type: 'icon',
        color: 'green'
    }

    useEffect(() => {

        // // console.log('changes effect')

        changeReducer(loc.pathname.replaceAll('/', ''), reducer)


        if (!_.isEmpty(reducerid) || loc.pathname.replaceAll('/', '') === reducerid)
            dispatch(fetchDatas(route))

        return () => {
            dispatch({ type: RESET_ERROR_MODAL_STATE })
        };


    }, [route, reducerid, loc.pathname, dateperiode])


    /*     useEffect(() => {
            console.log('change')
        }, [dateperiode])
     */
    const handleClick = (v) => {

        //console.log(v)

        const periodparsed = dateperiode instanceof Date ? parseDatetoString(dateperiode) : parseDatetoString(new Date(dateperiode))

        const urls = `${ROUTES}/view?period=${periodparsed}&source=${v.code}`

        dispatch(ViewDataBasic(`Data GL Module ${v.description} - Periode ${[periodparsed.substring(3)]}`, urls, null))

    }


    const handleIcon = async (data, index, key) => {

        //   console.log(data, index, key)

        // dispatch(singleProcess(data, index, () => dispatch(updateData(index, { unlock: true }))))

    }


    const Steps = ({ v, idx, x }) => <Step
        key={`${x}.${idx}`}
        //  completed={v?.completed}
        active={v?.isActive}
        style={{ backgroundColor: (v?.isError ? (v?.status !== 'No Data To Process' ? 'linen' : 'ivory') : null) }}>
        <Icon name={(v?.isProcess ? 'sync alternate' : (v?.isError ? 'warning sign' : 'unlock alternate'))}
            loading={v?.isProcess}
            size="tiny"
            color={v?.isError ? 'red' : (v?.unlock || v?.completed ? 'green' : null)}
            link={(v?.gl ? true : false)}
        //           onClick={() => handleIcon(v, idx, x)}
        />
        <Step.Content style={{ width: '150px', color: (v?.isError ? 'red' : null) }}>
            <Step.Title>{v.description}</Step.Title>
            <Step.Description style={{ color: (v?.isError ? 'red' : null) }} >
                {(v?.isError && v?.status !== 'No Data To Process') ? 'See Error Below' : v?.status}
                {(v?.gl && !v?.isProcess) && <Label content={'View GL Data'} basic as='a' color='blue' icon='list ol' onClick={() => handleClick(v)} />}
            </Step.Description>
        </Step.Content>
    </Step>

    const Element = ({ data }) => {
        const arrComp = [1, 2, 3, 4]

        return _.map(arrComp, x => <Step.Group key={x} size='tiny' style={{ marginTop: (x > 1 ? '-0.9em' : '0.1em') }}>
            {_.map(data, (v, idx) => {
                if (Math.ceil((idx + 1) / 4) === x) {
                    return <Steps v={v} idx={idx} x={x} key={`k${x}.${idx}`} />
                }

            })}</Step.Group>
        )
    }


    const RenderForm = useMemo(() => {
        return <Segment raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px", height: '70vh' }}>
            <Header dividing content='Module Process List' />
            <Element data={dataview} />
            {!_.isEmpty(closingError) &&
                <Message error attached='bottom' size="mini">
                    <Message.Header>Error Message</Message.Header>
                    <Message.List items={_.split(closingError, '\\n')} />
                </Message>
            }
            <Button primary
                icon='play'
                content='Start Process'
                attached='bottom'
                size="large"
                loading={closingProcess}
                onClick={btnhandler} />

        </Segment >


    }, [dataview, closingError])


    if (_.isEmpty(data) || loc.pathname.replaceAll('/', '') !== reducerid)
        return (<LoadingStatus />)


    return (
        <ContentHeader
            title={title}
            btn1={button}
            periodaction={periodHandler({ dateperiode })}
            children={RenderForm} />
    );

}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        errorStatus: 'This is Error Message',
        data: QueryData(state),
        dataprocess: getData('dataprocess'),
        dataview: getData('dataview'),
        dateperiode: QueryDatePeriode(state),
        closingError: state[state.auth.activeRoute]?.closingerror,
        closingProcess: state[state.auth.activeRoute]?.process,
        reducerid: QueryReducerID(state),
        loadingdata: (!_.isUndefined(state[QueryReducerID(state)]) ? state[QueryReducerID(state)]['loading'] : false),
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)