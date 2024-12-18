import React, { useEffect, useState } from "react";

import {
    useTable, usePagination, useFilters,
    useGlobalFilter, useAsyncDebounce
} from 'react-table'
import { Grid, Button, Table, Input, Select, Container, Popup, Loader, Header, Dimmer } from "semantic-ui-react"

import { matchSorter } from "match-sorter";


import styled from 'styled-components'



const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter
}) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <span>
            Search:{" "}
            <input
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
        </span>
    );
}



const RenderTable = (columns, data) => {

    const [change, setChange] = useState(false)

    useEffect(() => {

        const timer = setTimeout(() => {
            // console.log('This will run after 2 second!')
            setChange(!change)
        }, 2000);
        return () => clearTimeout(timer);
        //            RenderTables(columns, data)

    }, [])

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

    // Render the UI for your table
    if (!change) {
        return (<div>
            <Dimmer active inverted>
                <Loader content='Loading' />
            </Dimmer>
        </div>)
    }


    return (
        <>
            <Container style={{ overflowY: 'scroll', display: 'block', paddingLeft: '10px', maxHeight: '550px', width: '100vw', paddingBottom: '5px' }}>
                <Table celled singleline selectable {...getTableProps()}>
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
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body {...getTableBodyProps()} >
                        {page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <Table.Row {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <Table.Cell {...cell.getCellProps()} styles={{ backGround: 'red' }} content={cell.render('Cell')} />
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
                <Button.Group style={{ marginTop: '10px' }}>
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

export default RenderTable