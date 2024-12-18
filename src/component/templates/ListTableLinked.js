import React from "react";
import { useTable, usePagination, useFilters, useGlobalFilter, useAsyncDebounce, useRowSelect } from 'react-table'
import { Button, Table, Input, Select, Container, Divider } from "semantic-ui-react"
import { matchSorter } from "match-sorter";
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
// *library imports placed above ↑
// *local imports placed below ↓
import { LovSelected, setActionModals } from "../../redux/actions";
import { Appresources } from "./ApplicationResources";
import { setLoadingModalBtn, setModalStates } from "../../redux/actions";

const GlobalFilter = ({
    toggleAllRowsSelected,
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
                    toggleAllRowsSelected(false)
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



const RenderList = ({ columns, data }) => {
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

    // console.log(data)
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
        setPageSize,
        selectedFlatRows,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        toggleAllRowsSelected,
        toggleAllPageRowsSelected,
        state: { globalFilter, pageIndex, pageSize, selectedRowIds },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
            filterTypes,
        },
        useFilters, // useFilters!
        useGlobalFilter,// useGlobalFilter!
        usePagination,
        useRowSelect
    )

    const SelectHandler = (row) => {
        toggleAllPageRowsSelected(false);
        toggleAllRowsSelected(false);

        row.toggleRowSelected()
    }

    return (
        <>
            <Container style={{ overflowY: 'scroll', display: 'block', paddingLeft: '10px', height: '65vh', width: '20vw', paddingBottom: '5px' }}>
                <Table size='small' celled singleline="true" selectable {...getTableProps()}>
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
                                style={{
                                    textAlign: "left",
                                }}
                            >
                                <GlobalFilter
                                    toggleAllRowsSelected={toggleAllRowsSelected}
                                    preGlobalFilteredRows={preGlobalFilteredRows}
                                    globalFilter={globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body {...getTableBodyProps()} >
                        {page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <Table.Row
                                    style={{
                                        cursor: `pointer`,
                                        backgroundColor: row.id === Object.keys(selectedRowIds)[0] ? 'mediumspringgreen' : "white",
                                        fontWeight: row.id === Object.keys(selectedRowIds)[0] ? 'bold' : "normal",
                                        fontStyle: row.id === Object.keys(selectedRowIds)[0] ? 'italic' : "normal",
                                    }}
                                    {...row.getRowProps()}
                                    onDoubleClick={() => SelectHandler(row)}
                                    onClick={() => SelectHandler(row)}>
                                    {row.cells.map((cell, index) => {
                                        return (
                                            <Table.Cell
                                                className='cell-ui-input'
                                                style={{ padding: '0.3em', fontSize: 'smaller' }}
                                                {...cell.getCellProps()}
                                                //    style={{ cursor: `${index === 0 ? 'pointer' : ''}` }}
                                                onClick={index === 0 ? () => SelectHandler(row) : undefined}
                                                content={cell.render('Cell')} />
                                        )
                                    })}
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                {/*   <pre>Daftar vehicle
                    <code>
                        {JSON.stringify(
                            {
                                selectedRowIds: selectedRowIds,
                                'selectedFlatRows[].original': selectedFlatRows.map(
                                    d => d.original
                                ),
                            },
                            null,
                            2
                        )}
                    </code>
                </pre> */}
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
                <Divider section />
                <Button
                    floated="left"
                    icon='cancel'
                    labelposition="left"
                    negative
                    onClick={() => dispatch(setModalStates(Appresources.BUTTON_LABEL.LABEL_CANCEL))}
                    content={Appresources.BUTTON_LABEL.LABEL_CANCEL}
                />

                <Button
                    size="medium"
                    floated="right"
                    icon='pencil'
                    labelposition="right"
                    positive
                    content={Appresources.BUTTON_LABEL.LABEL_LANJUT_TRX}
                    onClick={() => {
                        //// console.log(Object.values(selectedFlatRows[0].original))
                        dispatch(setActionModals(Appresources.BUTTON_LABEL.LABEL_LANJUT_TRX, Object.values(selectedFlatRows[0].original)))
                    }}
                    disabled={_.isEmpty(selectedFlatRows) ? true : false}
                />
            </Container>
        </>
    )
}


export default connect(null, LovSelected)(RenderList)