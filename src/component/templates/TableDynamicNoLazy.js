import React from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useTable, usePagination, useExpanded, useSortBy } from 'react-table'
import { Button, Table, Input, Select, Container, Icon, Popup, Label } from "semantic-ui-react"
import { FETCH_COUNT, FETCH_PAGESIZE, FETCH_PAGEINDEX, UPDATE_NAV, UPDATE, DELETE, PROCESS } from '../../redux/actions/types'
import { ActionDisable, ApproveAuthorized, DeleteAuthorized, UpdateResultHeader, runReport } from '../../utils/DataHelper'

const renderCell = (v) => {
    const _still = ['UNVERIFIED', 'PROCESS', 'CHECKED']

    if (v.props.column.table_visibility === 'STYLED') {

        const _val = v.props.value

        if (_val.indexOf('UNVERIFIED') > -1) {
            return <Label content={v} basic color='red' size='small' />
        }
        else if (_val.indexOf('APPROVED') > -1) {
            return <Label content={v} color='green' size='small' icon='check' />
        }
        else if (_val.indexOf('REJECTED') > -1) {
            return <Label content={v} color='red' size='small' icon='exclamation' />
        }
        else {
            return <Label content={v} color='blue' size='small' icon='check' />
        }
    } else {
        return v
    }


}

const RenderTable = ({ columns, data, dateperiode, search, Controlled, queryPageIndex, queryPageSize, onRowClick }) => {
    // Use the state and functions returned from useTable to build your UI
    const rowcontrol = {
        Header: 'Actions',
        accessor: 'progress',
        Cell: ({ cell: { row, value } }) => {
            return (
                <div style={{ textAlign: "center" }}>
                    {
                /*!_.isUndefined(row.original.approveaction) &&*/ row.original.actions
                && <Popup
                    content={row.original.actions}
                    position='top center'
                    color='green'
                    trigger={
                        <Icon.Group style={{ marginRight: '10px', cursor: 'pointer' }}                            >
                            <Icon name={row.original.actions}
                                color={(ApproveAuthorized(row) ? 'grey' : 'green')}
                                disabled={ApproveAuthorized(row)}
                                onClick={() => onRowClick(PROCESS, row)} />
                            <Icon corner name='checkmark' color='green' />
                        </Icon.Group>} />}
                    <Popup
                        content='Run Report'
                        position='top center'
                        trigger={
                            <Icon color='red' name='file pdf outline' style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => runReport(row)} />
                        } />
                    <Popup
                        content='Edit Data'
                        position='top center'
                        trigger={
                            <Icon color='blue' name='edit' style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => onRowClick(UPDATE, row)} disabled={ActionDisable(row)} />} />
                    <Popup
                        content='Delete Data'
                        position='top center'
                        trigger={
                            <Icon color='red' name='delete' style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => onRowClick(DELETE, row)} disabled={DeleteAuthorized(row)} />} />
                </div>
            )
        }
    }
    columns = React.useMemo(() => (_.concat(columns.map((v) => { return { Header: v['prompt_ina'], accessor: (data) => { return (_.size(_.get(data, v['tablecomponent'])) > 40 ? <Popup content={_.get(data, v['tablecomponent'])} trigger={<div>{`${_.get(data, v['tablecomponent']).substring(0, 40)} ...`}</div>} /> : _.get(data, v['tablecomponent'])) }, table_visibility: v['table_visibility'] } }), rowcontrol)), [columns])
    data = React.useMemo(() => UpdateResultHeader(data), [data]);
    const dispatch = useDispatch()
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        visibleColumns,
        state: { pageIndex, pageSize, expanded },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: queryPageIndex, pageSize: queryPageSize },
            manualPagination: true,
            pageCount: Math.ceil(Controlled / queryPageSize)
        },
        useSortBy,
        useExpanded // We can useExpanded to track the expanded state
        // for sub components too!
        ,
        usePagination
    )

    React.useEffect(() => {
        //   // console.log('test table dynamic')
        if (data[0]?.total_rows) {
            dispatch({
                type: FETCH_COUNT,
                payload: data[0].total_rows,
            });
        }
        else if (_.isEmpty(data[0])) {
            dispatch({
                type: FETCH_COUNT,
                payload: 0,
            });
        }
    }, [data[0]?.total_rows]);

    React.useEffect(() => {
        //dispatch({ type: FETCH_PAGEINDEX, payload: pageIndex });
        dispatch({
            type: UPDATE_NAV, payload: {
                page: pageIndex,
                size: pageSize,
                search: search,
                dateperiode: dateperiode
            }
        });
    }, [pageIndex, pageSize]);

    React.useEffect(() => {
        //dispatch({ type: FETCH_PAGESIZE, payload: pageSize });

        dispatch({
            type: UPDATE_NAV, payload: {
                page: pageIndex,
                size: pageSize,
                search: search,
                dateperiode: dateperiode
            }
        });
        gotoPage(0);
    }, [pageSize, gotoPage]);

    // React.useEffect(() => {
    //     dispatch({type:FETCH_COUNT, payload:})
    // }, [dispatch])
    // Render the UI for your table
    // // console.log(data[0]?.total_rows)
    return (
        <>

            <Container style={{ overflowY: 'scroll', display: 'block', maxHeight: '550px', width: '80vw', paddingBottom: '5px' }}>
                <Table compact striped sortable celled singleLine
                    /*  style={{ paddingLeft: '5px', paddingRight: '5px' }} */
                    {...getTableProps()}
                >
                    <Table.Header style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1', fontSize: '8pt' }}>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    // // console.log('tes',column)
<th
                                            {...column.getHeaderProps(column.getSortByToggleProps())} style={{ display: column.table_visibility === 'GONE' && 'none' }}>{column.render('Header')}<span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? '🔽'
                                                        : ' 🔼'
                                                    : ''}
                                            </span></th>
                                ))}
                            </tr>
                        ))}
                    </Table.Header>
                    <Table.Body {...getTableBodyProps()} style={{ fontSize: '8pt' }} >
                        {page.map((row, i) => {
                            prepareRow(row)
                            const rowProps = row.getRowProps();
                            return (
                                <React.Fragment key={rowProps.key}>
                                    <tr {...rowProps}>
                                        {row.cells.map(cell => {
                                            return <td style={{ display: cell.column.table_visibility === 'GONE' && 'none' }} {...cell.getCellProps()}>
                                                {renderCell(cell.render('Cell'))}</td>
                                        })}
                                    </tr>
                                </React.Fragment>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Container>
            {/*
    Pagination can be built however you'd like.
    This is just a very basic UI implementation:
  */}
            <Container textAlign="center">
                <Button.Group style={{ marginTop: '10px' }}>
                    <Button color='blue' onClick={() => gotoPage(0)} disabled={!canPreviousPage} icon='angle double left' />

                    <Button color='blue' onClick={() => previousPage()} disabled={!canPreviousPage} icon='angle left' />

                    <Button color='blue' onClick={() => nextPage()} disabled={!canNextPage} icon='angle right' />

                    <Button color='blue' onClick={() => gotoPage((pageCount - 1))} disabled={!canNextPage} icon='angle double right' />
                </Button.Group>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <Input
                        type="number"
                        min={1}
                        max={pageOptions.length}
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <Select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.innerText))
                    }}
                    options={[10, 20, 30, 40, 50, 100].map(pageSize => ({ key: pageSize, value: pageSize, text: pageSize }))}
                />
            </Container>
        </>
    )
}

export default RenderTable
