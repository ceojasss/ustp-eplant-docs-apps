import {
    useTable, usePagination, useSortBy, useFilters,
    useGlobalFilter, useAsyncDebounce
} from 'react-table'
import { Popup, Button, Segment } from "semantic-ui-react"

import { matchSorter } from "match-sorter";

import _ from 'lodash'
import React from 'react'
import { UpdateResultHeader } from '../../utils/DataHelper';
import "./managementreport.css"
import { toDate } from 'date-fns';


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


    // Let the table remove the filter if the string is empty

    columns = React.useMemo(() => (_.concat(columns.map((v) => { return { Header: v['prompt_ina'], accessor: (data) => { return (_.size(_.get(data, v['tablecomponent'])) > 40 ? <Popup content={_.get(data, v['tablecomponent'])} trigger={<div>{`${_.get(data, v['tablecomponent']).substring(0, 40)} ...`}</div>} /> : _.get(data, v['tablecomponent'])) }, itemclass: v['itemclass'] } }))), [columns])
    data = React.useMemo(() => UpdateResultHeader(data), [data]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: datas,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    )
    // Render the UI for your table
    return (

        <>
            <table className="table-container"  {...getTableProps()}>
                <thead className="table-header" style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }}>
                    {headerGroups.map(headerGroup => (
                        <tr className="table-row-header" {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th  {...column.getHeaderProps(column.getSortByToggleProps())}
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
                                </th>
                            ))}
                        </tr>

                    ))}
                </thead>

                {/* table body */}
                <tbody className='table-body' {...getTableBodyProps()} >
                    {page.map((row, i) => {
                        prepareRow(row)

                        return (
                            <tr className='table-row-body' {...row.getRowProps()}>

                                {row.cells.map(cell => {
                                    return <td className='table-cell-body' {...cell.getCellProps()} style={{ fontSize: 'smaller' }}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            
            

            


            {/* <div className='footer'>
                <p className='exclude'>*Exclude PPn</p>
                <button className='button-cpo' type="button">Download</button> 
            </div> */}
                  
                    
            
        </>
    )
}

export default RenderTable
