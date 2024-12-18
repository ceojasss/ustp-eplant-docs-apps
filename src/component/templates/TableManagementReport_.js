import {
  useTable, usePagination, useSortBy, useFilters,
  useGlobalFilter, useAsyncDebounce
} from 'react-table'
import { Table,  Popup} from "semantic-ui-react"

import { matchSorter } from "match-sorter";

import _ from 'lodash'
import React from 'react'
import { UpdateResultHeader } from '../../utils/DataHelper';
import "./managementreport.css"


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

  columns = React.useMemo(() => (_.concat(columns.map((v) => { return { Header: v['prompt_ina'], accessor: (data) => { return (_.size(_.get(data, v['tablecomponent'])) > 40 ? <Popup content={_.get(data, v['tablecomponent'])} trigger={<div>{`${_.get(data, v['tablecomponent']).substring(0, 40)} ...`}</div>} /> : _.get(data, v['tablecomponent'])) }, itemclass: v['itemclass'] } }))), [columns])
  data = React.useMemo(() => UpdateResultHeader(data), [data]);
  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page, // Instead of using 'rows', we'll use page,
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
                  {/* </Table.HeaderCell>
                                   </Table.Row> */}
                      <Table className="table-container" index={0} index2={1} widths={widths} compact striped sortable celled singleLine {...getTableProps()}>
                          
                          {/* table header */}
                          <Table.Header className="table-header" style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }}>
                              {headerGroups.map(headerGroup => (
                                  <Table.Row className="table-row-header" {...headerGroup.getHeaderGroupProps()}>
                                      {headerGroup.headers.map(column => (
                                          <Table.HeaderCell  {...column.getHeaderProps(column.getSortByToggleProps())}
                                              style={{ fontSize: 'small' }}
                                              className={`table-cell-header ${column.itemclass}`} >
                                              {column.render('Header')}
                                              <span>
                                                  {column.isSorted
                                                      ? column.isSortedDesc
                                                          ? ' 🔽'
                                                          : ' 🔼'
                                                      : ''}
                                              </span>
                                          </Table.HeaderCell>
                                      ))}
                                  </Table.Row>

                              ))}
                          </Table.Header>

                          {/* table body */}
                          <Table.Body className='table-body' {...getTableBodyProps()} >
                              {page.map((row, i) => {
                                  prepareRow(row)
                                  return (
                                      <Table.Row className='table-row-body' {...row.getRowProps()}>
                                          {row.cells.map(cell => {
                                              // if (cell.row.cells[0]) {
                                              //     return <th {...cell.getCellProps()}>{cell.render('Cell')}</th>
                                              // } else {

                                              return <Table.Cell className='table-cell-body'
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
                      </Table>
                  {/* </StylesTable> */}
              </> :
              <>
                  {/* <Table.Row>
                                  <Table.HeaderCell
                                      colSpan={visibleColumns.length}
                                      style={{ textAlign: "left" }}> */}
                
               {/* responsive */}
               
                  
                      {/* <Responsive style={{ minWidth: ''  }}> */}
                          <Table  className="table-container" compact striped sortable celled singleLine
                              {...getTableProps()}
                          >
                              <Table.Header className='table-header' style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }}>
                                  {headerGroups.map(headerGroup => (
                                      <Table.Row className='flex-table header' {...headerGroup.getHeaderGroupProps()}>
                                          {headerGroup.headers.map(column => (
                                              <Table.HeaderCell  {...column.getHeaderProps(column.getSortByToggleProps())}
                                                  style={{ fontSize: 'small' }}
                                                  className={`th${column.itemclass}`} 
                                                  >
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
                                          <Table.Row className='flex-table row' {...row.getRowProps()}>
                                              {row.cells.map(cell => {
                                                  // if (cell.row.cells[0]) {
                                                  //     return <th {...cell.getCellProps()}>{cell.render('Cell')}</th>
                                                  // } else {

                                                  return <Table.Cell className='td'
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
                      {/* </Responsive> */}
              </>
          }

      </>
  )
}

export default RenderTable
