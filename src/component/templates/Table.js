import {
    useTable, usePagination, useSortBy, useFilters,
    useGlobalFilter, useAsyncDebounce
} from 'react-table'
import { Button, Table, Input, Select, Container, Popup, Icon, Divider, TableHeader, TableHeaderCell, Grid, Label } from "semantic-ui-react"
import styled from "styled-components";

import { matchSorter } from "match-sorter";

import { StylesTable } from './TableStyles';

import _ from 'lodash'
import React from 'react'
import { DELETE, DELETE_STREAM, UPDATE } from '../../redux/actions/types';
import { ActionDisable, DeleteAuthorized, UpdateResultHeader } from '../../utils/DataHelper';


{/* <Grid.Column floated='right' width={5} >
        <Input
            size="small"
            value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} records...`}
                style={{
                    fontSize: "1.1rem",
                    border: "0"
                }}
        />
    </Grid.Column> */}

const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter
}) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = (useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200));

    return (
        <Grid.Column floated='right' width={5} style={{ marginTop: '-55px' }}>
            <Input
                size="small"
                value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`Search : ${count} records...`}
                style={{
                    fontSize: "1.1rem",
                    border: "0"
                }}
            />
        </Grid.Column>
    );
}

const RenderTable = ({ columns, data, onRowClick, sticky, widths, index }) => {
    // Use the state and functions returned from useTable to build your UI
    const fuzzyTextFilterFn = (rows, id, filterValue) => {
        return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
    }


    const datas = React.useMemo(
        () => (_.map(data, (d) => {
            return _.mapValues(d, (value, key) => {


                if (value instanceof Object) {
                    let stringVal = ''
                    _.map(Object.keys(value), (z, i) => {
                        stringVal += (i > 0 ? ' - ' : '') + value[z]
                    })
                    return stringVal;
                }

                return value
            })
        }
        )), [data])

    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter((row) => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            }
        }),
        []
    );

    // Let the table remove the filter if the string is empty
    fuzzyTextFilterFn.autoRemove = (val) => !val;

    const rowcontrol = {
        Header: 'Actions',
        accessor: 'progress',
        Cell: ({ cell: { row, value } }) => {
            return (
                <div /* style={{ textAlign: "center" }} */>
                    {/*    <Button.Group size="tiny">
                        <Popup
                            content='Update Data'
                            hideOnScroll
                            trigger={<Button primary icon="edit" onClick={() => onRowClick(UPDATE, row)} />}
                        />
                        <Button.Or />
                        <Popup
                            content='Delete Data'
                            hideOnScroll
                            trigger={<Button negative icon="delete" onClick={() => onRowClick(DELETE, row)} />}
                        />
                    </Button.Group> */}
                    {/* <Icon color='blue' name='edit' style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => onRowClick(UPDATE, row)} disabled={ActionDisable(row)} />
                    <Icon color='red' name='delete' style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => onRowClick(DELETE, row)} disabled={DeleteAuthorized(row)} /> */}
                    
                    <Icon color='blue' name='edit' style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => onRowClick(UPDATE, row)}  />
                    <Icon color='red' name='delete' style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => onRowClick(DELETE, row)}  />
                </div>)
        }
    }

    columns = React.useMemo(() => (_.concat(columns.map((v) => { return { Header: v['prompt_ina'], accessor: (data) => { return (_.size(_.get(data, v['tablecomponent'])) > 40 ? <Popup content={_.get(data, v['tablecomponent'])} trigger={<div>{`${_.get(data, v['tablecomponent']).substring(0, 40)} ...`}</div>} /> : _.get(data, v['tablecomponent'])) }, itemclass: v['itemclass'] } }), rowcontrol)), [columns])
    data = React.useMemo(() => UpdateResultHeader(data), [data]);
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
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: datas,
            initialState: { pageIndex: 0 },
            filterTypes
        },
        useFilters, // useFilters!
        useGlobalFilter,// useGlobalFilter!
        useSortBy,
        usePagination
    )
    // Render the UI for your table
    return (

        <>
            {/* <div className='div'> */}
            {(sticky === true) ?
                <>

                    {/* <Table.Row>
                                         <Table.HeaderCell
                                             colSpan={visibleColumns.length}
                                             style={{ textAlign: "left" }}> */}
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    {/* </Table.HeaderCell>
                                     </Table.Row> */}
                    <StylesTable index={0} index2={1} widths={widths} compact striped sortable celled singleLine {...getTableProps()}>
                        {/* <Container style={{ overflowY: 'scroll', display: 'block', paddingLeft: '0.5cm',paddingRight: '1.5cm',  maxHeight: '550px', width: '80%', paddingBottom: '5px' }}> */}
                        <Table.Header style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }}>
                            {headerGroups.map(headerGroup => (
                                <Table.Row {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={{ fontSize: 'small' }}
                                            className={`table ${column.itemclass}`} >
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? ' 🔽'
                                                        : ' 🔼'
                                                    : ''}
                                            </span></Table.HeaderCell>
                                    ))}
                                </Table.Row>

                            ))}
                        </Table.Header>
                        <Table.Body {...getTableBodyProps()} >
                            {page.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <Table.Row className='column' {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            // if (cell.row.cells[0]) {
                                            //     return <th {...cell.getCellProps()}>{cell.render('Cell')}</th>
                                            // } else {

                                            return <Table.Cell
                                                {...cell.getCellProps()}
                                                style={{ fontSize: 'smaller' }}
                                                content={cell.render('Cell')}
                                            />

                                        })}
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                        {/* </Table> */}
                        {/*  </Container> */}
                    </StylesTable>

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
                                // console.log('change ')
                                // console.log(e.target.innerText)
                                // console.log('changes ')
                                setPageSize(Number(e.target.innerText))
                            }}
                            options={[10, 20, 30, 40, 50, 100].map(pageSize => ({ key: pageSize, value: pageSize, text: pageSize }))}
                        />
                    </Container>
                    {/* </StylesTable> */}
                </> :
                <>
                    {/* <Table.Row>
                                    <Table.HeaderCell
                                        colSpan={visibleColumns.length}
                                        style={{ textAlign: "left" }}> */}
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    {/* </Table.HeaderCell>
                                </Table.Row> */}
                    {/* <Container style={{ */}
                    {/* overflowY: 'scroll', */}
                    {/* display: 'block', paddingRight: '1.5cm', maxHeight: '550px', width: '75vw', paddingBottom: '5px' */}
                    {/* }}> */}
                    {/* /*paddingLeft: '0.5cm',*/}
                    <Container style={{ overflowY: 'scroll', display: 'block', /*paddingLeft: '0.5cm',*/ paddingRight: '1.5cm', maxHeight: '550px', width: '86vw', paddingBottom: '5px' }}>
                        <Table compact striped sortable celled singleLine
                            {...getTableProps()}
                        >
                            <Table.Header style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }}>
                                {headerGroups.map(headerGroup => (
                                    <Table.Row {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}
                                                style={{ fontSize: 'small' }}
                                                className={`table ${column.itemclass}`} >
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? ' 🔽'
                                                            : ' 🔼'
                                                        : ''}
                                                </span></Table.HeaderCell>
                                        ))}
                                    </Table.Row>

                                ))}

                            </Table.Header>
                            <Table.Body {...getTableBodyProps()} >
                                {page.map((row, i) => {
                                    prepareRow(row)
                                    return (
                                        <Table.Row className='column' {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                // if (cell.row.cells[0]) {
                                                //     return <th {...cell.getCellProps()}>{cell.render('Cell')}</th>
                                                // } else {

                                                return <Table.Cell
                                                    {...cell.getCellProps()}
                                                    style={{ fontSize: 'smaller' }}
                                                    content={cell.render('Cell')}
                                                />

                                            })}
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </Container>

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
                                // console.log('change ')
                                // console.log(e.target.innerText)
                                // console.log('changes ')
                                setPageSize(Number(e.target.innerText))
                            }}
                            options={[10, 20, 30, 40, 50, 100].map(pageSize => ({ key: pageSize, value: pageSize, text: pageSize }))}
                        />
                    </Container>
                </>
            }

        </>
    )
}

export default RenderTable
