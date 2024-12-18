import React, { useMemo, useRef } from "react";
import _ from 'lodash'
import { Dimmer, Header, Input, Label, Loader, Modal, Select } from "semantic-ui-react";



import "react-datepicker/dist/react-datepicker.css"
import { getFormListComponent, getFormTitle } from "../../../utils/FormComponentsHelpler";

import ComponentAdaptersGrids from "./ComponentAdaptersGrids";
import { connect, useDispatch } from "react-redux";
import { ADD_NUMBER_COUNT, GENERATE_DATA, GRID_MAXIMIZE, GRID_MINIMIZE, SINGLE_LOAD_FALSE, SINGLE_LOAD_TRUE } from "../../../redux/actions/types";

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


const ComponentAdaptersGroupArrays = ({ defaultDataValue, methods, OnClickRef, postAction, masterdetail, singleload,
    gridMax, addCount, viewHeight, createButton = true, masterdetailtype, Listlabel }) => {
    const dispatch = useDispatch()
    const isMasterdetail = (_.isUndefined(masterdetail) ? false : masterdetail)

    const arrayRef = useRef(null);


    const addedCount = [
        { key: '1', value: 1, text: '1' },
        { key: '5', value: 5, text: '5' },
        { key: '10', value: 10, text: '10' },]


    const GroupArray = useMemo(() => {

        return <ComponentAdaptersGrids
            key="0.componentgroup"
            OnClickRef={OnClickRef}
            arrayrefs={arrayRef}
            {...methods}
            defaultDataValue={defaultDataValue && { inputgrid: defaultDataValue }}
            postAction={postAction}
            masterdetail={masterdetail}
            viewHeight={_.isEmpty(viewHeight) ? (gridMax ? '80vh' : '40vh') : viewHeight}
        />
    }, [])

    const clickhandler = async () => {

        if (masterdetailtype === 'FORM_MASTER_DETAIL_GENERATED') {

            // console.log('run generate')

            dispatch({ type: GENERATE_DATA, payload: true })


        } else {
            if (_.size(methods.getValues().inputgrid) < 30) {
                // // console.log('masuk sini')
                arrayRef.current();
            }
            else {
                //    // console.log('masuk sinisss')
                await dispatch({ type: SINGLE_LOAD_TRUE })

                setTimeout(() => {
                    arrayRef.current(() => {
                        dispatch({ type: SINGLE_LOAD_FALSE })
                    })
                }, 0.1);

            }
        }
    }

    const ShowLoader = () => <Dimmer active><Loader size='large'>Processing..</Loader></Dimmer>

    const Labels = (() => {
        if (['FORM_GRID', 'FORM_MASTER_DETAIL'].includes(masterdetailtype)) {
            return (
                <Input type='text' size="mini">
                    <Label
                        content={(singleload === true ?
                            <Loader inverted inline="centered" size="tiny" active={singleload} /> : `Tambah Data ${isMasterdetail ? 'Detail' : ''} `)}
                        style={{ marginLeft: '10px', width: (isMasterdetail ? '4cm' : '3cm'), cursor: 'pointer', marginLeft: '-0.01cm', paddingTop: '0.3cm' }}
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
                </Input>)
        } else {
            if (masterdetailtype === 'FORM_MASTER_DETAIL_GENERATED') {
                return (
                    <Label as={Header}
                        color='blue'
                        floated="left"
                        style={{ marginLeft: '10px', cursor: 'pointer', marginLeft: '-0.01cm', marginBottom: '0.2cm' }}
                        content='Process Data'
                        icon='copy'
                        labelposition="right"
                        size="small"
                        onClick={clickhandler} />)
            }
        }

    })()



    if (singleload)
        return <ShowLoader />


    return <>
        <Label as={Header}
            color='blue'
            floated="right"
            style={{ marginLeft: '10px', cursor: 'pointer', marginLeft: '-0.01cm', marginBottom: '0.2cm' }}
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
                    //   return <GroupArray />
                    return (<>
                        {Labels}
                        {GroupArray}</>)
                }
            })()
        }
    </>
}

const mapStateToProps = (state) => {

    console.log(state.auth)

    return {
        singleload: state.auth.singleload,
        //resetTrx: state.auth.resetTrx,
        masterdetailtype: _.get(getFormListComponent()[0], 'masterdetailtype'),
        addCount: state.auth.fieldAddNumber,
        gridMax: state.auth.gridwindowmax
    }
}

export default connect(mapStateToProps)(ComponentAdaptersGroupArrays)