import React, { useEffect, useMemo, useRef, useState } from "react"
import {
    Segment, Loader, Dimmer, Button, Table,
    TableCell, TableRow, Input, GridRow, Placeholder, Divider, Header, Icon, Container
} from "semantic-ui-react"
import _ from 'lodash'
import { connect, useDispatch } from "react-redux"
import { Appresources } from "../ApplicationResources"
import { RESET_ACTIVE_ROW, SET_ACTIVE_ROW, SET_SELECTED_ROW } from "../../../redux/actions/types"
import '../../Public/CSS/App.css'
import { DataViewDetail, DataViewDetailAll, resetModalStates, SearchDataLinked, submitlinkdata } from "../../../redux/actions"
import { EditableTable } from "../TableEditable"
import { getColumnLink, getColumnLinkDetail } from "../../../utils/FormComponentsHelpler"
import store from "../../../redux/reducers"


const DialogListLinkedDataHeader = ({ modals, column, activeRow, selectedRows, keyColumn, detailData }) => {

    const searchRef = useRef(null);
    const dispatch = useDispatch()
    const thisRef = useRef();

    const [checkedAll, setCheckedall] = useState(false);


    const columns = useMemo(() => _.map(getColumnLink(), (v) => ({ header: v.prompt_ina, accessor: v.tablecomponent, className: v.itemclass })), [])

    const columnsDetail = useMemo(() => _.map(getColumnLinkDetail(), (v) => ({ header: v.prompt_ina, accessor: v.tablecomponent, className: v.itemclass, formula: v.formula, itemtype: v.itemtype, table_visibility: v.table_visibility, default_value: v.default_value, lov_dependent_values: v.lov_dependent_values })), [])

    const setActiveRow = (idx) => {

        dispatch({
            type: SET_ACTIVE_ROW,
            payload: {
                activeRow: idx
            }
        })
    }

    const setAllChecked = (v, cb) => {
        setCheckedall(v)

        if (cb)
            cb()
    }

    const setSelectedRow = (idx, i, cb) => {
        const st = store.getState()

        // console.log('selected', idx, i)

        let val = st.auth.modals.selectedRows
        //let ins = [idx]


        dispatch({
            type: SET_SELECTED_ROW,
            payload: {
                selectedRows: _.union([idx], val),
            }
        })

        if (cb)
            cb()

    }


    const selectedAll = (checked, cb) => {

        const _remainingArr = _.filter(modals.lovdata, x => !_.some(modals.detaildata, [keyColumn, x[keyColumn]]))

        // console.log('arr size', _.size(_remainingArr))

        if (checked && _.size(_remainingArr) !== 0) {
            dispatch(DataViewDetailAll(_.map(_remainingArr, (val, idx) => {
                return val[keyColumn]
            })))
        }


        if (cb)
            cb()



    }


    const deselectedRow = (idx, cb) => {
        const st = store.getState()

        let val = st.auth.modals.selectedRows



        dispatch({
            type: SET_SELECTED_ROW,
            payload: {
                selectedRows: _.pull(val, idx)
            }
        })

        if (cb)
            cb()


    }


    const fetchAllData = async (e, cb) => {
        await _.map(modals.lovdata,
            (val, idx) => {
                if (e.target.checked) {
                    setSelectedRow(val[keyColumn], idx)
                } else {
                    deselectedRow(val[keyColumn])
                }

            })

        if (cb)
            cb()

    }

    useEffect(() => {

        if (!_.isUndefined(activeRow) && !_.isNil(activeRow)) {
            if (_.isEmpty(modals.detaildata)) {

                const v = Object.values(modals.lovdata[activeRow])
                dispatch(DataViewDetail(v[0]))
            } else {

                if (!_.some(modals.detaildata, [keyColumn, modals.lovdata[activeRow][keyColumn]])) {
                    const v = Object.values(modals.lovdata[activeRow])

                    dispatch(DataViewDetail(v[0]))
                }
            }
        }
    }, [activeRow])


    const submitHandler = (d) => {
        /* 
                thisRef.current((data) => {
        
                    const linkData = _.filter(modals.detaildata, (e) => _.includes(selectedRows, e[keyColumn]))
        
                    dispatch(submitlinkdata(linkData))
                })
         */
        const linkData = _.filter(modals.detaildata, (e) => _.includes(selectedRows, e[keyColumn]))

        dispatch(submitlinkdata(linkData))



    }


    const TablePlaceHolder = () => {
        const Arr = Array(5).fill(0);

        return _.map(Arr,
            (x, index) => <TableRow key={`trpc${index}`}>

                {(() => _.map(columns, (v, idx) => <TableCell className="tbodyslim" key={`thcp${idx}`} > {<Placeholder
                    style={{ marginTop: '0.5em', marginBottom: '0.6em' }}
                    content={<Placeholder.Paragraph >
                        <Placeholder.Line />
                    </Placeholder.Paragraph>} />} </TableCell>))()}</TableRow>)
    }


    const Tbodydata = () => {
        return _.map(modals.lovdata,
            (val, idx) => {
                return <Table.Row
                    key={`tr${idx}`}
                    style={{ cursor: 'pointer' }}
                    active={idx === activeRow}
                    onClick={() => { setActiveRow(idx) }}
                >
                    <Table.Cell collapsing className="tbodyViewSlimCB">
                        <input type="checkbox"
                            style={{ cursor: 'pointer' }}
                            id={`${idx}.chk`}
                            checked={_.indexOf(selectedRows, val[keyColumn]) === -1 ? false : true}
                            onChange={async (e) => {
                                if (e.target.checked) {
                                    setSelectedRow(val[keyColumn], idx, () => setActiveRow(idx))

                                } else {
                                    deselectedRow(val[keyColumn], () => setCheckedall(false))
                                }
                            }} />
                    </Table.Cell>
                    {_.map(columns,
                        ({ accessor }, ix) => <Table.Cell key={`trc${ix}`} className="tbodyViewSlim">{val[accessor]}
                        </Table.Cell>)}

                </Table.Row>
            }
        )
    }



    const ListHeader = () => {
        return <Table compact celled //bordered //celled compact sortable selectable
            size="small" >
            <Table.Header style={{ position: 'sticky', top: '0', zIndex: '1' }} >
                <Table.Row>
                    <Table.HeaderCell className='theadslimCb' >
                        <input type="checkbox"
                            style={{ cursor: 'pointer' }}
                            checked={checkedAll}
                            onChange={async (e) => {

                                // setCheckedall(e.target.checked)
                                setAllChecked(e.target.checked, () =>
                                    selectedAll(e.target.checked,
                                        () => fetchAllData(e)
                                    ))

                            }}
                        />

                    </Table.HeaderCell>
                    {(() => _.map(columns, (v, idx) => <Table.HeaderCell className='theadslim'
                        key={`thc${idx}`}
                        style={{ padding: '0em !important' }}>{v.header}</Table.HeaderCell>))()}
                </Table.Row>
            </Table.Header >
            <Table.Body>
                {(modals.contentLoading && <TablePlaceHolder />)}
                {(!modals.contentLoading && <Tbodydata />)}
            </Table.Body>
        </Table>


    }//, [modals.lovdata, activeRow])


    const Detail = () => {
        if (!_.isNil(activeRow) && !_.isEmpty(modals.detaildata)) {
            return <EditableTable
                columns={columnsDetail}
                datas={_.filter(modals.detaildata, [keyColumn, modals.lovdata[activeRow][keyColumn]])}
                tref={thisRef} />
        } else {
            return null
        }
    }


    if (!_.isEmpty(searchRef.current))
        searchRef.current.focus();




    return (<Segment basic style={{ marginTop: '-40px' }}  >
        <Input
            ref={searchRef}
            as={GridRow}
            size="small"
            focus
            fluid
            placeholder='Cari Data...'
            icon={'search'}
            onChange={_.debounce((e) => {
                dispatch(SearchDataLinked(e.target.value, () => {
                    dispatch({
                        type: RESET_ACTIVE_ROW
                    })
                }))
            }, 1000)}
        />
        {
            (() => {
                if (modals.isloading)
                    return <Dimmer active inverted>
                        <Loader content={Appresources.TRANSACTION_ALERT.LOADING_STATUS} size="huge" />
                    </Dimmer>
                return <> <Container style={{ backgroundColor: 'gainsboro', overflowY: 'scroll', display: 'block', height: '20vh', maxHeight: '50vh', marginTop: '0.5em', width: '86vw', paddingBottom: '5px' }}>
                    <ListHeader />
                </Container>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='unordered list' />
                            {`${modals.content} - Details`}
                        </Header>
                    </Divider>
                    <Container style={{ overflowY: 'scroll', display: 'block', height: '160px', maxHeight: '160px', /*height: '430px', maxHeight: '430px',*/ marginTop: '0.5em', width: '86vw', paddingBottom: '5px' }}>
                        <Detail />
                    </Container>
                    <Button positive floated="right" content='Submit' onClick={submitHandler} style={{ marginTop: '10px' }} />
                    <Button negative floated="right" content='Cancel' onClick={() => dispatch(resetModalStates())} style={{ marginTop: '10px' }} />  </>
            })()
        }
    </Segment >)
}

const mapStateToProps = state => {

    //    // // console.log(state.auth.modals.activeRow)

    // console.log('STATE MODALS', state.auth.modals.detaildata)//, state.auth.modals.activeRow, state.auth.modals.selectedRows)

    return {
        keyColumn: state.auth.modals.keyColumn,
        activeRow: state.auth.modals.activeRow,
        selectedRows: state.auth.modals.selectedRows,
        modals: state.auth.modals,
        detailData: state.auth.modals.detaildata,
        column: state.auth.modals.lovdata,
    }
}


export default connect(mapStateToProps)(DialogListLinkedDataHeader) 