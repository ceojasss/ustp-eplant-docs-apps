import React, { useMemo, useRef } from "react";
import _ from 'lodash'
import { Dimmer, Grid, Header, Input, Label, Loader, Modal, Select } from "semantic-ui-react";
import { useFormContext } from "react-hook-form";


import "react-datepicker/dist/react-datepicker.css"

import { IsInsert, getFilterDateTrx, getFormComponent, getFormListComponent, getFormTitle, isFilterDateLimited } from "../../../utils/FormComponentsHelpler";

import ComponentAdaptersGrids from "./ComponentAdaptersGrids";
import ComponentAdaptersGrid from "./ComponentAdaptersGrid";

import { connect, useDispatch } from "react-redux";
import { ADD_NUMBER_COUNT, CHANGE_MODAL_ITEM_STATE, GENERATE_DATA, GRID_MAXIMIZE, GRID_MINIMIZE, SINGLE_LOAD_FALSE, SINGLE_LOAD_TRUE } from "../../../redux/actions/types";
import DatePicker from "react-datepicker";
import { Appresources } from "../ApplicationResources";

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


const ComponentAdaptersGroupArray = ({ defaultDataValue, OnClickRef, postAction, masterdetail, singleload, filteradd,
    gridMax, addCount, viewHeight, createButton = true, masterdetailtype, Listlabel, filteraddComps, isDataDateLimited, datefilterone, datefiltertwo, dateTrxList }) => {
    const dispatch = useDispatch()
    const isMasterdetail = (_.isUndefined(masterdetail) ? false : masterdetail)

    const arrayRef = useRef(null);


    const { getValues, trigger } = useFormContext()



    const addedCount = [
        { key: '1', value: 1, text: '1' },
        { key: '5', value: 5, text: '5' },
        { key: '10', value: 10, text: '10' },]



    const GroupArray = useMemo(() => {

        const formver = (_.isEmpty(filteraddComps) ? filteradd.formversion : filteraddComps.formversion)

        if (formver === 'D') {
            return <ComponentAdaptersGrid
                key="0.componentgroup"
                OnClickRef={OnClickRef}
                arrayrefs={arrayRef}
                defaultDataValue={defaultDataValue && { inputgrid: defaultDataValue }}
                postAction={postAction}
                masterdetail={masterdetail}
                viewHeight={_.isEmpty(viewHeight) ? (gridMax ? '80vh' : '40vh') : viewHeight}
            />
        } else {
            return <ComponentAdaptersGrids
                key="0.componentgroup"
                OnClickRef={OnClickRef}
                arrayrefs={arrayRef}
                defaultDataValue={defaultDataValue && { inputgrid: defaultDataValue }}
                postAction={postAction}
                masterdetail={masterdetail}
                viewHeight={_.isEmpty(viewHeight) ? (gridMax ? '80vh' : '40vh') : viewHeight}
            />
        }
    }, [])


    const GroupArrayunMemo = () => {

        const formver = (_.isEmpty(filteraddComps) ? filteradd.formversion : filteraddComps.formversion)

        if (formver === 'D') {
            return <ComponentAdaptersGrid
                key="0.componentgroup"
                OnClickRef={OnClickRef}
                arrayrefs={arrayRef}
                defaultDataValue={defaultDataValue && { inputgrid: defaultDataValue }}
                postAction={postAction}
                masterdetail={masterdetail}
                viewHeight={_.isEmpty(viewHeight) ? (gridMax ? '80vh' : '40vh') : viewHeight}
            />
        } else {
            return <ComponentAdaptersGrids
                key="0.componentgroup"
                OnClickRef={OnClickRef}
                arrayrefs={arrayRef}
                defaultDataValue={defaultDataValue && { inputgrid: defaultDataValue }}
                postAction={postAction}
                masterdetail={masterdetail}
                viewHeight={_.isEmpty(viewHeight) ? (gridMax ? '80vh' : '40vh') : viewHeight}
            />
        }
    }

    const clickhandler = async () => {

        if (masterdetailtype === 'FORM_MASTER_DETAIL_GENERATED') {

            dispatch({ type: GENERATE_DATA, payload: true })


        } else {
            if (_.size(getValues().inputgrid) < 30) {
                arrayRef.current();
            }
            else {
                await dispatch({ type: SINGLE_LOAD_TRUE })

                setTimeout(() => {
                    arrayRef.current((v) => {
                        dispatch({ type: SINGLE_LOAD_FALSE })
                        trigger()
                    })
                }, 1);

            }
        }
    }

    const ShowLoader = () => <Dimmer active><Loader size='large'>Processing..</Loader></Dimmer>

    const Labels = (() => {
        if (['FORM_GRID', 'FORM_MASTER_DETAIL'].includes(masterdetailtype)) {
            return (<Grid columns={2} style={{ maxWidth: '15cm', paddingBottom: '5px' }} >
                <Grid.Row>
                    <Grid.Column >{!_.isUndefined(IsInsert(filteradd)) ? IsInsert(filteradd) !== 'Y' ? true :
                        <Input type='text' size="mini" >
                            <Label
                                content={(singleload === true ?
                                    <Loader inverted inline="centered" size="tiny" active={singleload} /> : `Tambah Data ${isMasterdetail ? 'Detail' : ''} `)}
                                style={{ marginLeft: '10px', width: (isMasterdetail ? '4cm' : '3cm'), cursor: 'pointer',/*  marginLeft: '-0.01cm', */ paddingTop: '0.3cm' }}
                                color="green"
                                icon={(!singleload && 'plus')}
                                size="small"
                                onClick={clickhandler} />
                            <Select compact options={addedCount}
                                defaultValue={addCount}
                                style={{ fontSize: '10pt', zIndex: 10020 }}
                                onChange={(e) => {
                                    dispatch({ type: ADD_NUMBER_COUNT, payload: _.toNumber(e.target.innerText) })
                                }} />
                        </Input > : !_.isUndefined(_.get(filteraddComps, 'isinsert')) ? _.get(filteraddComps, 'isinsert') === 'N' ? true :
                            <Input type='text' size="mini" >
                                <Label
                                    content={(singleload === true ?
                                        <Loader inverted inline="centered" size="tiny" active={singleload} /> : `Tambah Data ${isMasterdetail ? 'Detail' : ''} `)}
                                    style={{ marginLeft: '10px', width: (isMasterdetail ? '4cm' : '3cm'), cursor: 'pointer', /* marginLeft: '-0.01cm', */ paddingTop: '0.3cm' }}
                                    color="green"
                                    icon={(!singleload && 'plus')}
                                    size="small"
                                    onClick={clickhandler} />
                                <Select compact options={addedCount}
                                    defaultValue={addCount}
                                    style={{ fontSize: '10pt', zIndex: 10020 }}
                                    onChange={(e) => {
                                        dispatch({ type: ADD_NUMBER_COUNT, payload: _.toNumber(e.target.innerText) })
                                    }} />
                            </Input > : !_.isUndefined(_.get(filteradd, 'isinsert')) ? _.get(filteradd, 'isinsert') !== 'Y' ? true :
                                <Input type='text' size="mini" >
                                    <Label
                                        content={(singleload === true ?
                                            <Loader inverted inline="centered" size="tiny" active={singleload} /> : `Tambah Data ${isMasterdetail ? 'Detail' : ''} `)}
                                        style={{ marginLeft: '10px', width: (isMasterdetail ? '4cm' : '3cm'), cursor: 'pointer', /* marginLeft: '-0.01cm',  */paddingTop: '0.3cm' }}
                                        color="green"
                                        icon={(!singleload && 'plus')}
                                        size="small"
                                        onClick={clickhandler} />
                                    <Select compact options={addedCount}
                                        defaultValue={addCount}
                                        style={{ fontSize: '10pt', zIndex: 10020 }}
                                        onChange={(e) => {
                                            dispatch({ type: ADD_NUMBER_COUNT, payload: _.toNumber(e.target.innerText) })
                                        }} />
                                </Input > : null
                    }
                    </Grid.Column>
                    {(isDataDateLimited) &&
                        <Grid.Column>
                            <div className="ui mini left icon right input">
                                <DatePicker
                                    portalId="root-portal"
                                    selected={datefilterone}
                                    includeDates={dateTrxList}
                                    onChange={(async (date) => {
                                        // console.log('test', date)
                                        dispatch({
                                            type: CHANGE_MODAL_ITEM_STATE,
                                            payload: { actionpick: Appresources.TRANSACTION_ALERT.CHANGE_DATE_FILTER, actionvalueone: date }
                                        })
                                    })}
                                //selected={startDate} onChange={(date) => setStartDate(date)}
                                />
                                <DatePicker
                                    portalId="root-portal"
                                    // disabled
                                    selected={datefiltertwo}
                                    includeDates={dateTrxList}
                                    onChange={(async (date) => {
                                        //// console.log('test', date)
                                        dispatch({
                                            type: CHANGE_MODAL_ITEM_STATE,
                                            payload: { actionpick: Appresources.TRANSACTION_ALERT.CHANGE_DATE_FILTER, actionvaluetwo: date }
                                        })
                                    })}
                                //selected={startDate} onChange={(date) => setStartDate(date)}
                                />
                                {/* <div className="ui blue tag label label">Filter Tanggal</div> */}
                                <Label color='blue' tag>
                                    Filter Tanggal
                                </Label>
                            </div>
                        </Grid.Column>
                    }
                </Grid.Row>
            </ Grid>)
        } else if (['FORM_GRID_DIRECT'].includes(masterdetailtype)) {
            //todo
        } else {
            if (masterdetailtype === 'FORM_MASTER_DETAIL_GENERATED') {
                return (
                    <Label as={Header}
                        color='blue'
                        floated="left"
                        style={{ marginLeft: '10px', cursor: 'pointer',/*  marginLeft: '-0.01cm',  */marginBottom: '0.2cm' }}
                        content='Process Data'
                        icon='copy'
                        labelposition="right"
                        size="small"
                        onClick={clickhandler} />)
            }
        }

    })()


    console.log()

    if (singleload)
        return <ShowLoader />




    return <>
        <Label as={Header}
            color='blue'
            floated="right"
            style={{ marginLeft: '10px', cursor: 'pointer',/*  marginLeft: '-0.01cm',  */marginBottom: '0.2cm' }}
            content='Fullscreen Detail'
            icon='expand'
            labelposition="right"
            size="small"
            onClick={() => dispatch({ type: GRID_MAXIMIZE })} />
        {
            (() => {
                if (gridMax) {
                    return (<Modal
                        style={{ marginLeft: '30px' }}
                        open={gridMax}
                        size={"fullscreen"}
                        onClose={() => dispatch({ type: GRID_MINIMIZE })}
                        onOpen={() => dispatch({ type: GRID_MAXIMIZE })} >
                        <Modal.Content >
                            <Modal.Header>
                                {Labels}
                                <Label as={Header}
                                    color='blue'
                                    floated="right"
                                    content='Minimize Detail'
                                    icon='expand'
                                    labelposition="right"
                                    size="small"
                                    onClick={() => dispatch({ type: GRID_MINIMIZE })} style={{ marginBottom: '5px', cursor: 'pointer' }} />
                                <Header as={'h3'}
                                    floated='right'
                                    textAlign='left'
                                    content={getFormTitle('Details')}
                                    style={{ marginBottom: '0.05cm', marginRight: '35vw' }} />
                            </Modal.Header>
                            {GroupArray}
                        </Modal.Content>
                    </Modal>)
                }
                else {
                    return (<>
                        {Labels}
                        {/* <GroupArrayunMemo /> */}
                        {GroupArray}
                    </>)
                }
            })()
        }
    </>
}

const mapStateToProps = (state) => {

    //console.log(state.auth)

    return {
        singleload: state.auth.singleload,
        //resetTrx: state.auth.resetTrx,
        isDataDateLimited: isFilterDateLimited(),
        masterdetailtype: _.get(getFormListComponent()[0], 'masterdetailtype'),
        filteradd: getFormListComponent()[0],
        filteraddComps: getFormComponent()[0],
        addCount: state.auth.fieldAddNumber,
        gridMax: state.auth.gridwindowmax,
        datefilterone: getFilterDateTrx('single'),
        datefiltertwo: getFilterDateTrx('two'),
        dateTrxList: getFilterDateTrx('array'),
    }
}

export default connect(mapStateToProps)(ComponentAdaptersGroupArray)