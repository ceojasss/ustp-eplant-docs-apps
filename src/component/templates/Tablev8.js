import { Button, Container, Form as FormUI, Grid, Icon, Input, Popup, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react'
import React, { useEffect, useState, useMemo } from 'react'
import Select from 'react-select';
import _ from 'lodash'
import {
  Column,
  Table as ReactTable,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { getColumn } from '../../utils/FormComponentsHelpler'
import {
  rankItem
} from "@tanstack/match-sorter-utils";
import { miniSelect, selectStyles } from './Style';

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return <Input
    {...props}
    size='mini'
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
  /* 
    return (<>
      <label>Search : </label> 
      <Input
        {...props}
        size='mini'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      /></>
    ); */
}
const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
const RenderTable = ({ data, activeRow, setSelectedRow, actionRow }) => {
  const columns = useMemo(() => _.map(getColumn(data), (v) => ({
    header: v.prompt_ina, accessorKey: v.tablecomponent, className: v.itemclass,
    table_visibility: v.table_visibility
  })), [data])
  const [globalFilter, setGlobalFilter] = useState('')


  const table = useReactTable({
    data: data[0],
    columns,
    globalFilterFn: fuzzyFilter,
    state: {
      globalFilter,
    },
    // Pipeline
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    debugTable: true,
  })

  return (<Grid >
    <Grid.Row style={{ marginBottom: '-20px' }}>
      <Grid.Column stretched width={'sixteen'} >
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search Report..."
        /></Grid.Column>
    </Grid.Row>
    <Grid.Row style={{ marginBottom: '-10px' }}>
      <Grid.Column stretched width={'sixteen'} >
        <Container style={{ overflowY: 'scroll', maxHeight: '50vh' }}>
          <Table compact='very' sortable celled singleLine size='small' >
            <TableHeader style={{ fontSize: 'smaller', backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }} >
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}  >
                  <TableHeaderCell collapsing textAlign='center'
                    content={
                      (setSelectedRow ? <Icon name='thumbtack' /> : 'Action')
                    } />
                  {headerGroup.headers.map(header => {
                    //console.log(header.column.columnDef.table_visibility)

                    return <TableHeaderCell key={header.id} style={{
                      display: header.column.columnDef.table_visibility === 'GONE' && 'none'
                    }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHeaderCell>
                  })}
                </TableRow>
              ))}
            </TableHeader >
            <TableBody>
              {table.getRowModel().rows.map(row => {
                // // console.log(row)
                // // console.log(setSelectedRow)
                if (_.isUndefined(activeRow))
                  return;

                return (
                  <TableRow
                    key={`tr${row.id} `}
                    active={row.id === activeRow.index}
                  //style={{ cursor: 'pointer' }}
                  >
                    <TableCell key={`selectd${row.id}`} style={{ cursor: 'pointer' }} >
                      {setSelectedRow &&
                        <Icon
                          name={(row.id === activeRow.index ? 'arrow alternate circle right' : 'arrow alternate circle right outline')}
                          size='large'
                          onClick={() => {
                            setSelectedRow(row.original, row.id)
                          }} />
                      }
                      {actionRow &&
                        /*                         <Icon
                                                  name={(row.id === activeRow.index ? 'file excel' : 'file excel outline')}
                                                  size='large'
                                                  onClick={() => {
                                                    actionRow(row.original, row.id)
                                                  }} /> */
                        <Button basic={(row.id === activeRow.index ? false : true)}
                          content='Open'
                          icon='file excel'
                          labelPosition='left'
                          size='tiny'
                          color='blue'
                          onClick={() => {
                            actionRow(row.original, row.id)
                          }} />
                      }
                    </TableCell>

                    {row.getVisibleCells().map(cell => {
                      // console.log(cell)
                      return (<TableCell
                        key={cell.id}
                        style={{ fontSize: 'smaller', display: cell.column.columnDef.table_visibility === 'GONE' && 'none' }}
                        content={flexRender(cell.column.columnDef.cell, cell.getContext())} />)
                    })}
                  </TableRow>)
              })}
            </TableBody>
          </Table>
        </Container>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row >
      <Grid.Column width={11} textAlign='right'>
        <Button.Group size='mini' >
          <Button color='blue' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} icon='angle double left' />

          <Button color='blue' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} icon='angle left' />

          <Button color='blue' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} icon='angle right' />

          <Button color='blue' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} icon='angle double right' />
        </Button.Group>
        <span style={{ fontSize: 'x-small' }}> Page
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
          {` | Go to page : `}
        </span>
        <Input
          size='mini'
          type="number"
          min={1}
          max={table.getPageCount()}
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          style={{ marginLeft: '0.1cm', width: '50px', height: '27px' }}
        />
      </Grid.Column>
      <Grid.Column width={3} textAlign='left'>
        <Select
          className="basic-single"
          classNamePrefix="page size.."
          styles={miniSelect}
          placeholder='Data Size..'
          defaultValue={table.getState().pagination.pageSize}
          onChange={e => {
            // console.log(e)
            table.setPageSize(Number(e.value))
          }}
          name="color"
          options={[10, 20, 30, 40, 50, 100].map(pageSize => ({ key: pageSize, value: pageSize, label: pageSize }))}
        />
      </Grid.Column >
    </Grid.Row>
  </Grid >)

}

export default RenderTable