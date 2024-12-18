import React, { useEffect, useMemo, useRef } from "react"
import { Segment, Loader, Dimmer, Button, Table, TableHeader, TableHeaderCell, TableCell, TableRow, TableBody, Input, GridRow, Placeholder, Divider, Header, Icon, Container } from "semantic-ui-react"
import _ from 'lodash'
import { connect, useDispatch } from "react-redux"
import { Appresources } from "../ApplicationResources"
import { RESET_ACTIVE_ROW, SET_ACTIVE_ROW } from "../../../redux/actions/types"
import '../../Public/CSS/App.css'
import { DataLinkedDetail, resetModalStates, SearchDataLinked, submitlinkdata } from "../../../redux/actions"
import { EditableTable } from "../TableEditable"
import { getColumnLink, getColumnLinkDetail } from "../../../utils/FormComponentsHelpler"


const DialogListLinkedData = ({ modals, column, activeRow }) => {

    const searchRef = useRef(null);
    const dispatch = useDispatch()
    const thisRef = useRef();

    const columns = useMemo(() => _.map(getColumnLink(), (v) => ({ header: v.prompt_ina, accessor: v.tablecomponent, className: v.itemclass })), [column])

    const columnsDetail = useMemo(() => _.map(getColumnLinkDetail(), (v) => ({ header: v.prompt_ina, accessor: v.tablecomponent, className: v.itemclass, formula: v.formula, itemtype: v.itemtype, table_visibility: v.table_visibility, default_value: v.default_value, lov_dependent_values: v.lov_dependent_values, readonly:v.readonly })), [column])



    const setSelectedRow = (idx) => {

        dispatch({
            type: SET_ACTIVE_ROW, payload: {
                activeRow: idx
            }
        })
    }

    useEffect(() => {

        //   // console.log('fire', _.isUndefined(activeRow), _.isNil(activeRow))
        if (!_.isUndefined(activeRow) && !_.isNil(activeRow)) {
            const v = Object.values(modals.lovdata[activeRow])
            dispatch(DataLinkedDetail(v[0]))
        }

    }, [activeRow])


    const submitHandler = (d) => {
        //   // console.log('adadasdad')
        thisRef.current((data) => {

            //// console.log(data)

            const linkData = _.differenceBy(data, modals.detaildata, _.keys(data))


            // // console.log(linkData)

            dispatch(submitlinkdata(linkData))



        })
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

    // // console.log(columns)

    const Tbodydata = useMemo(() => {
        return _.map(modals.lovdata,
            (val, idx) => <TableRow
                key={`tr${idx}`}
                active={idx === activeRow}
                onClick={() => { setSelectedRow(idx) }}>
                {_.map(columns, ({ accessor }, ix) => <TableCell className="tbodyslim" key={`trc${ix}`}>{val[accessor]}</TableCell>)}

            </TableRow>
        )
    }, [modals.lovdata, activeRow])

    const TbodyDetail = useMemo(() => {

        return _.map(modals.detaildata,
            (val, idx) => <TableRow key={`trd${idx}`}>
                {_.map(columnsDetail, ({ accessor }, ix) => <TableCell className="tbodyslim" key={`trc${ix}`}>{val[accessor]}</TableCell>)}
                <TableCell >
                    <button>=</button>
                </TableCell>
                <TableCell>
                    <input></input>
                </TableCell>
            </TableRow>
        )
    }, [modals.detaildata])



    const ListHeader = () => {
        return <Table celled singleLine compact sortable selectable size="small" >
            <TableHeader style={{ position: 'sticky', top: '0', zIndex: '1' }} >
                <TableRow>{(() => _.map(columns, (v, idx) => <TableHeaderCell className='theadslim' key={`thc${idx}`} style={{ padding: '0em !important' }}>{v.header}</TableHeaderCell>))()}
                </TableRow>
            </TableHeader >
            <TableBody>
                {(modals.contentLoading && <TablePlaceHolder />)}
                {(!modals.contentLoading && Tbodydata)}
            </TableBody>
        </Table>


    }//, [modals.lovdata, activeRow])

    const Detail = () => {


        if (!_.isEmpty(modals.detaildata)) {
            return <EditableTable columns={columnsDetail} datas={modals.detaildata} tref={thisRef} />
        }

        return null
    }

    const ListDetail = () => {

        return <Container style={{ overflowY: 'scroll', display: 'block', /*paddingLeft: '0.5cm',*/  height: '46vh', width: '60vw' }}>
            <Table celled fixed compact selectable size="small" style={{ padding: '0em !important' }}>
                <TableHeader style={{ /* backgroundColor: 'gainsboro',  */position: 'sticky', top: '0', zIndex: '1' }}>
                    <TableRow>{(() => _.map(columnsDetail, (v, idx) => <TableHeaderCell className='theadslim' key={`thc${idx}`} style={{ padding: '0em !important' }}>{v.header}</TableHeaderCell>))()}
                        <TableHeaderCell  >
                            <button>=</button>
                        </TableHeaderCell >
                        <TableHeaderCell content='Pick' />
                    </TableRow>
                </TableHeader >
                <TableBody>
                    {(modals.detailLoading && <TablePlaceHolder />)}
                    {(!modals.detailLoading && TbodyDetail)}
                </TableBody>
            </Table>
        </Container>

    }//, [modals.lovdata, activeRow])


    if (!_.isEmpty(searchRef.current))
        searchRef.current.focus();

    return (<Segment basic  >
        <Input
            ref={searchRef}
            as={GridRow}
            focus
            fluid
            placeholder='Cari Data...'
            icon={'search'}
            onChange={_.debounce((e) => {
                dispatch(SearchDataLinked(e.target.value, () => {

                    // console.log('active row', activeRow)
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
                return <> <Container style={{ backgroundColor: 'gainsboro', overflowY: 'scroll', display: 'block', height: '100px', maxHeight: '100px', marginTop: '0.5em', width: '86vw', paddingBottom: '5px' }}>
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

    //    // console.log(state.auth.modals.activeRow)
    return {
        activeRow: state.auth.modals.activeRow,
        modals: state.auth.modals,
        column: state.auth.modals.lovdata,
    }
}


export default connect(mapStateToProps)(DialogListLinkedData) 