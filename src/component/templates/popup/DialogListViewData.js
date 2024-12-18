import React, { useEffect, useMemo, useRef } from "react"
import { Segment, Loader, Dimmer, Button, Table, TableHeader, TableHeaderCell, TableCell, TableRow, TableBody, Placeholder, Divider, Header, Icon, Container } from "semantic-ui-react"
import _ from 'lodash'
import { connect, useDispatch } from "react-redux"
import { Appresources } from "../ApplicationResources"
import '../../Public/CSS/App.css'
import { DataViewDetail, resetModalStates } from "../../../redux/actions"
import { getColumnView, getColumnViewDetail, getTitleView, getTitleViewDetail } from "../../../utils/FormComponentsHelpler"


const DialogListLinkedData = ({ modals, column, activeRow }) => {
    const searchRef = useRef(null);
    const dispatch = useDispatch()

    const columns = useMemo(() => _.map(getColumnView(), (v) => ({ header: v.prompt_ina, accessor: v.tablecomponent, className: v.itemclass })), [])
    const columnsDetail = useMemo(() => _.map(getColumnViewDetail(), (v) => ({ header: v.prompt_ina, accessor: v.tablecomponent, className: v.itemclass, formula: v.formula, itemtype: v.itemtype, table_visibility: v.table_visibility, default_value: v.default_value, lov_dependent_values: v.lov_dependent_values })), [])



    useEffect(() => {

        dispatch(DataViewDetail())

    }, [activeRow, dispatch])


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

    const Tbodydata = useMemo(() => {
        return _.map(modals.lovdata,
            (val, idx) => <TableRow
                key={`tr${idx}`}
            // active={idx === activeRow}
            // onClick={() => { setSelectedRow(idx) }}
            >
                {_.map(columns, ({ accessor }, ix) => <TableCell className="tbodyslim" key={`trc${ix}`}>{val[accessor]}</TableCell>)}

            </TableRow>
        )
    }, [modals.lovdata])

    const TbodyDetail = useMemo(() => {

        return _.map(modals.detaildata,
            (val, idx) => <TableRow key={`trd${idx}`}>
                {_.map(columnsDetail, ({ accessor }, ix) => <TableCell className="tbodyslim" key={`trc${ix}`}>{val[accessor]}</TableCell>)}
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
    const ListHeaderDetail = () => {
        // 
        return <Table celled singleLine compact sortable selectable size="small" >
            <TableHeader style={{ position: 'sticky', top: '0', zIndex: '1' }} >
                <TableRow>{(() => _.map(columnsDetail, (v, idx) => <TableHeaderCell className='theadslim' key={`thc${idx}`} style={{ padding: '0em !important' }}>{v.header}</TableHeaderCell>))()}
                </TableRow>
            </TableHeader >
            <TableBody>
                {(modals.contentLoading && <TablePlaceHolder />)}
                {(!modals.contentLoading && TbodyDetail)}
            </TableBody>
        </Table>


    }//, [modals.lovdata, activeRow])



    // // console.log(column)
    if (!_.isEmpty(searchRef.current))
        searchRef.current.focus();

    return (<Segment basic  >
        {
            (() => {
                if (modals.isloading)
                    return <Dimmer active inverted>
                        <Loader content={Appresources.TRANSACTION_ALERT.LOADING_STATUS} size="huge" />
                    </Dimmer>
                return <>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='unordered list' />
                            {`List ${getTitleView()}`}
                        </Header>
                    </Divider><Container style={{ backgroundColor: 'gainsboro', overflowY: 'scroll', display: 'block', height: '100px', maxHeight: '100px', marginTop: '0.5em', width: '86vw', paddingBottom: '5px' }}>
                        <ListHeader />
                    </Container>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='unordered list' />
                            {`List ${getTitleViewDetail()}`}
                        </Header>
                    </Divider>
                    <Container style={{ overflowY: 'scroll', display: 'block', height: '160px', maxHeight: '160px', /*height: '430px', maxHeight: '430px',*/ marginTop: '0.5em', width: '86vw', paddingBottom: '5px' }}>
                        {/* <Detail /> */}
                        {/* <ListDetail></ListDetail> */}
                        <ListHeaderDetail />
                    </Container>
                    {/* <Button positive floated="right" content='Submit' onClick={submitHandler} style={{ marginTop: '10px' }} /> */}
                    <Button negative floated="right" content='Close' onClick={() => dispatch(resetModalStates())} style={{ marginTop: '10px' }} />  </>
            })()
        }
    </Segment >)
}

const mapStateToProps = state => {

    //    // console.log(state.auth.modals.activeRow)
    return {
        // activeRow: state.auth.modals.activeRow,
        modals: state.auth.modals,
        column: state.auth.modals.lovdata,
    }
}


export default connect(mapStateToProps)(DialogListLinkedData) 