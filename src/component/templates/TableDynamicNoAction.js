import React from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useTable, usePagination, useExpanded } from 'react-table'
import { Button, Table, Input, Select, Container, Icon, Popup } from "semantic-ui-react"
import { FETCH_COUNT, UPDATE_NAV, UPDATE, DELETE, PROCESS } from '../../redux/actions/types'
import { ActionDisable, DeleteAuthorized, runReport, UpdateResultHeader } from '../../utils/DataHelper'
import { parseNumbertoString } from '../../utils/FormComponentsHelpler'

const RenderTable = ({ columns, data, dateperiode, search, Controlled, queryPageIndex, queryPageSize, onRowClick, renderRowSubComponent }) => {

    const i = 0;

    const runReports = (rows) => {
        window.open(rows)
    }

    // Use the state and functions returned from useTable to build your UI
    // {let key= Object.keys(row.original); const mapping = key.map((keys,i)=> keys.match('preview')) ; // console.log(_.size(mapping.filter(function (el) {
    //     return el != null;
    //   })))
    // }
    const rowcontrol = {
        Header: 'Actions',
        accessor: 'progress',
        Cell: ({ cell: { row, value } }) => <div style={{ textAlign: "center" }}>
            {
                !_.isUndefined(row.original.approveaction) && <Popup
                    content='Approve ?'
                    position='top center'
                    color='green'
                    trigger={
                        <Icon.Group style={{ marginRight: '10px', cursor: 'pointer' }}                            >
                            <Icon name='file text outline'
                                color={(ActionDisable(row) ? 'grey' : 'green')}
                                disabled={ActionDisable(row)}
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
        </div >
    }

    const rowcontrol2 = {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
            // Use Cell to render an expander for each row.
            // We can use the getToggleRowExpandedProps prop-getter
            // to build the expander.

            <div {...row.getToggleRowExpandedProps()} style={{ width: '0cm' }} >
                {row.isExpanded ? <Icon disabled name='triangle down' size='large' link /> : <Icon name='triangle right' size='large' link />}
            </div>
        )
    }
    columns = React.useMemo(() => (_.concat(rowcontrol2, columns.map((v) => {
        return {
            Header: v['prompt_ina'], accessor: (data) => {
                return (_.size(_.get(data, v['tablecomponent'])) > 40 ?
                    <Popup content={_.get(data, v['tablecomponent'])} trigger={<div>{`${_.get(data, v['tablecomponent']).substring(0, 40)} ...`}</div>} /> : _.get(data, v['tablecomponent']))
            }, table_visibility: v['table_visibility'], datatype: v['datatype']
        }
    })/* , rowcontrol */)), [columns])

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
                <Table compact striped sortable celled singleLine {...getTableProps()}>
                    <Table.Header style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1', fontSize: '8pt' }}>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    // // console.log('tes',column)
                                    <th style={{ display: column.table_visibility === 'GONE' && 'none' }}
                                        className={column.className} {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                                    <tr {...rowProps} >
                                        {row.cells.map(cell => {
                                            return <td style={{ display: cell.column.table_visibility === 'GONE' && 'none' }}
                                                className={cell.column.className} {...cell.getCellProps()}>
                                                {cell.column.datatype == 'oracledb.NUMBER' ? parseNumbertoString(cell.value) : cell.render('Cell')}</td>

                                        })}
                                    </tr>
                                    {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
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
