import React, { useRef, useEffect } from "react";
import _ from 'lodash'
import {
    useTable, usePagination, useFilters,
    useGlobalFilter, useAsyncDebounce
} from 'react-table'
import { Button, Table, Input, Select, Container, Icon, Label } from "semantic-ui-react"

import { matchSorter } from "match-sorter";

import { LovSelected } from "../../redux/actions";
import { connect, useDispatch } from 'react-redux'



const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter, gRef
}) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <div className="ui labeled input"><div className="ui label label">Cari Data</div>
            <input
                autoFocus
                ref={gRef}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}>
            </input>
        </div>
    );
}



const RenderTable = ({ columns, data }) => {

    const myRef = useRef(null);
    const dispatch = useDispatch()



    const fuzzyTextFilterFn = (rows, id, filterValue) => {
        return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
    }

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

    //   // console.log(data)
    // Use the state and functions returned from useTable to build your UI
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
        state,
        setPageSize,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
            filterTypes
        },
        useFilters, // useFilters!
        useGlobalFilter,// useGlobalFilter!
        usePagination
    )

    const SelectHandler = (row) => {
        dispatch(LovSelected(row))
    }


    if (!_.isEmpty(myRef.current))
        myRef.current.focus();


    return (
        <>
            <Container style={{ display: 'block', paddingLeft: '10px', maxHeight: '550px', width: '100vw', paddingBottom: '5px' }} >
                <Table
                    // ref={myRef}
                    {...getTableProps()} celled striped selectable >
                    <Table.Header style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                        {headerGroups.map(headerGroup => (
                            <Table.Row {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <Table.HeaderCell {...column.getHeaderProps()} content={column.render('header')} />
                                ))}
                            </Table.Row>
                        ))}
                        <Table.Row>
                            <Table.HeaderCell
                                colSpan={visibleColumns.length}
                                style={{ textAlign: "left" }}>
                                <GlobalFilter
                                    preGlobalFilteredRows={preGlobalFilteredRows}
                                    globalFilter={state.globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                    gRef={myRef}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body {...getTableBodyProps()} >
                        {page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <Table.Row
                                    {...row.getRowProps()}
                                    onDoubleClick={() => SelectHandler(row)}
                                    style={{ cursor: "pointer" }} >
                                    {row.cells.map((cell, index) => {
                                        return (
                                            <Table.Cell
                                                {...cell.getCellProps()}
                                                className='cell-ui-input'
                                                style={{ padding: '0.3em', fontSize: 'smaller' }}
                                                onClick={index === 0 ? () => SelectHandler(row) : undefined}
                                                content={cell.render('Cell')} />
                                        )
                                    })}
                                </Table.Row>
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
                <Button.Group >
                    <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} content="<<" />

                    <Button onClick={() => previousPage()} disabled={!canPreviousPage} content="<" />

                    <Button onClick={() => nextPage()} disabled={!canNextPage} content=">" />

                    <Button onClick={() => gotoPage((pageCount - 1))} disabled={!canNextPage} content=">>" />
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
    )
}


export default connect(null, LovSelected)(RenderTable)
