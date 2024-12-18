import React from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useTable, usePagination, useExpanded, useAsyncDebounce, useGlobalFilter, useSortBy, useFilters } from 'react-table'
import { Button, Table, Input, Select, Container, Icon, Grid, Popup } from "semantic-ui-react"
import { FETCH_COUNT, FETCH_PAGESIZE, FETCH_PAGEINDEX, UPDATE_NAV, UPDATE, DELETE } from '../../redux/actions/types'
import { matchSorter } from 'match-sorter'
import { ActionDisable, UpdateResultHeader } from '../../utils/DataHelper'


const RenderTable = ({ columns, data, dateperiode, onRowClick, renderRowSubComponent }) => {
    // Use the state and functions returned from useTable to build your UI
    const fuzzyTextFilterFn = (rows, id, filterValue) => {
        return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
    }

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
            <Grid.Column floated='right' width={5} style={{/*marginRight:'-5vw',*/marginTop: '-56px' }}>
                <Input
                    size="small"
                    value={value || ""}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder={`Search : ${count} records...`}
                    style={{
                        // fontSize: "1.1rem",
                        border: "0"
                    }}
                />
            </Grid.Column>
        );
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
    const rowcontrol = {
        Header: 'Actions',
        accessor: 'progress',
        Cell: ({ cell: { row, value } }) => {
            return (
                <div style={{ textAlign: "center" }}>
                    {/*     <Button.Group size="small">
                        <Button primary icon="edit" onClick={() => onRowClick(row)} />
                        <Button.Or />
                        <Button negative icon="delete" onClick={() => onRowClick(row)} />
                    </Button.Group>
                 */}
                    <Icon color='blue' name='edit' style={{ marginRight: '5px', cursor: 'pointer' }} onClick={() => onRowClick(UPDATE, row)} disabled={ActionDisable(row)} />
                    <Icon color='red' name='delete' style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => onRowClick(DELETE, row)} disabled={ActionDisable(row)} />
                </div>
            )
        }
    }
    const rowcontrol2 = {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
            // Use Cell to render an expander for each row.
            // We can use the getToggleRowExpandedProps prop-getter
            // to build the expander.

            <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? <Icon disabled name='triangle down' size='large' /> : <Icon name='triangle right' size='large' />}
            </span>
        )
    }
    columns = React.useMemo(() => (_.concat(rowcontrol2, columns.map((v) => { return { Header: v['prompt_ina'], accessor: (data) => { return (_.size(_.get(data, v['tablecomponent'])) > 40 ? <Popup content={_.get(data, v['tablecomponent'])} trigger={<div>{`${_.get(data, v['tablecomponent']).substring(0, 40)} ...`}</div>} /> : _.get(data, v['tablecomponent'])) } } }), rowcontrol)), [columns])
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
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: data,
            initialState: { pageIndex: 0 },
            filterTypes
        },
        useFilters, // useFilters!
        useGlobalFilter,// useGlobalFilter!
        useSortBy,
        useExpanded,
        usePagination
    )

    React.useEffect(() => {
        //dispatch({ type: FETCH_PAGEINDEX, payload: pageIndex });
        dispatch({
            type: UPDATE_NAV, payload: {
                page: pageIndex,
                size: pageSize,
                search: '',
                dateperiode: dateperiode
            }
        });
    }, [pageIndex, pageSize]);

    // React.useEffect(() => {
    //     dispatch({type:FETCH_COUNT, payload:})
    // }, [dispatch])
    // Render the UI for your table
    return (
        <>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            <Container style={{ overflowY: 'scroll', display: 'block', maxHeight: '550px', width: '80vw', paddingBottom: '5px' }}>
                <Table compact striped sortable celled singleLine
                    /*  style={{ paddingLeft: '5px', paddingRight: '5px' }} */
                    {...getTableProps()}
                >
                    <Table.Header style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1', fontSize: '8pt' }}>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })}
                                    </tr>
                                    {row.isExpanded &&
                                        renderRowSubComponent({ row, rowProps, visibleColumns })}
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
