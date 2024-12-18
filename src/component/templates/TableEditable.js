import _ from 'lodash'
import { useEffect, useState } from "react"
import { useTable } from "react-table"
import { Button, Table as TableUI, Input, Select, Container, Popup, Icon, Divider, TableHeader, TableHeaderCell, Grid } from "semantic-ui-react"
import React from "react"
import { useDispatch } from "react-redux"


import { UpdateResultHeader } from "../../utils/DataHelper"
import { parseNumber } from "../../utils/FormComponentsHelpler"
import { useFormContext } from 'react-hook-form'


// Create an editable cell renderer
const EditableCell = ({
    rows,
    value: initialValue,
    row,
    column,
    updateMyData, // This is a custom function that we supplied to our table instance
}) => {
    // We need to keep and update the state of the cell normally


    const fctx = useFormContext()
    const [value, setValue] = useState(initialValue)
    const formula = column?.formula?.split(';')

    let sign, checkvalue, checkvalue2

    const dispatch = useDispatch()


    if (formula) {
        sign = formula[0]
        checkvalue = formula[1]
        checkvalue2 = formula[2]
    }

    //// console.log(sign, checkvalue)



    const onChange = e => {



        if (_.size(formula) < 3) {
            // // console.log('3')
            if (e.target.value > row.original[checkvalue]) {
                setValue(parseNumber(row.original[checkvalue]))
            }
            else {
                // // console.log('3')
                setValue(parseNumber(e.target.value))

            }
        } else if (_.size(formula) >= 3) {
            // // console.log('hehe')
            if (e.target.value >= row.original[checkvalue]) {
                // // console.log(e.target.value)
                if (e.target.value <= row.original[checkvalue2]) {
                    setValue(parseNumber(row.original[checkvalue]))
                    // // console.log('1')
                }
                // else {
                //     // console.log('2')
                //     setValue(parseNumber(row.original[checkvalue2]))
                // }
            } else if (e.target.value >= row.original[checkvalue2]) {
                // // console.log('7')
                setValue(parseNumber(row.original[checkvalue2]))
            } else {
                // // console.log('6')
                setValue(parseNumber(e.target.value))
            }
        }
        else {
            // // console.log('3')
            setValue(parseNumber(e.target.value))

        }


    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        //// console.log(formula)
        // console.log('id', column, value)

        if (!_.isUndefined(value))
            updateMyData(row.index, column.id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    if (_.size(formula) >= 3) {
        if (row.original[checkvalue] === 0 || row.original[checkvalue2] === 0)
            return null
    } else {
        if (row.original[checkvalue] === 0)
            return null
    }


    return <input type='number' value={value || ''} disabled={column.readonly == 'true' ? true : false} onChange={onChange} onBlur={onBlur} />
}


const ButtonCell = ({
    rows,
    value: initialValue,
    row,
    column,
    updateMyData, // This is a custom function that we supplied to our table instance
}) => {
    // We need to keep and update the state of the cell normally
    const fctx = useFormContext()

    const [value, setValue] = useState(initialValue)

    const formula = column.formula.split(';')


    const dispatch = useDispatch()

    const onClick = e => {
        //   // console.log(formula)
        //   setValue(e.target.value)
        if (_.size(formula) >= 3) {
            if (row.original[formula[0]] <= row.original[formula[1]]) {
                updateMyData(row.index, formula[2], parseNumber(row.original[formula[0]].toFixed(3)))
            } else if (row.original[formula[0]] >= row.original[formula[1]]) {
                updateMyData(row.index, formula[2], parseNumber(row.original[formula[1]].toFixed(3)))
            }
        } else {
            //            console.log(column)


            updateMyData(row.index, formula[1], parseNumber(row.original[formula[0]].toFixed(3)))


        }


    }



    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    if (_.size(formula) >= 3) {
        if (row.original[formula[0]] === 0 || row.original[formula[1]] === 0)
            return null
    } else {
        if (row.original[formula[0]] === 0)
            return null
    }


    return <button onClick={onClick}>=</button>
}



const DisplayCell = ({
    value: initialValue,
    row: { index },
    column: { id }
}) => (typeof initialValue == 'number' ? parseNumber(initialValue.toFixed(3)) : initialValue)


// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
    Cell: EditableCell,
    Bcell: ButtonCell,
    Dcell: DisplayCell,
}


const Table = ({ columns, data, updateMyData }) => {
    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.
    data = React.useMemo(() => UpdateResultHeader(data), [data]);

    const fctx = useFormContext()



    const {
        getTableProps,
        getTableBodyProps,
        column,
        headerGroups,
        prepareRow,
        rows,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateMyData,
        }
    )

    return (/*         <table className="ui table" {...getTableProps()} > */
        <TableUI celled selectable compact  {...getTableProps()} >
            <thead style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }} >
                {
                    headerGroups.map(headerGroup => (
                        <tr   {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th style={{ display: column.table_visibility === 'GONE' && 'none' }} className={column.className} {...column.getHeaderProps()}>{column.render('header')}</th>
                            ))}

                        </tr>
                    ))
                }
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                    (() => {

                        let z = 0;
                        return rows.map((row, i) => {
                            //   // console.log(z)

                            z = z + 1

                            prepareRow(row)
                            return (
                                <tr key={`tre${i}`} {...row.getRowProps()}>
                                    {
                                        row.cells.map((cell) => {
                                            // // console.log(cell.column.lov_dependent_value)
                                            let picked = true
                                            let x = 0

                                            if (cell.column.default_value === 'autoincrement') {

                                                if (!_.isUndefined(cell.column.lov_dependent_values)
                                                    && !_.isUndefined(_.get(row.values, cell.column.lov_dependent_values))
                                                    && parseNumber(_.get(row.values, cell.column.lov_dependent_values)) !== 0) {

                                                    const last_num = _.get(_.maxBy(fctx.getValues('inputgrid'), cell.column.id), [cell.column.id])

                                                    //z = z + last_num; //(_.isEmpty(last_num) ? 0 : last_num)
                                                    if (_.isNumber(last_num)) {
                                                        x = z + last_num;

                                                    } else {
                                                        x = z;

                                                    }

                                                } else {
                                                    picked = false
                                                    z = z - 1

                                                    x = z

                                                }
                                            }

                                            if (cell.column.itemtype === 'tablebutton') {
                                                return <td style={{ textAlign: 'center' }}
                                                    className={cell.column.className}
                                                    {...cell.getCellProps()}>{cell.render('Bcell')}</td>
                                            } else if (cell.column.itemtype === 'tableinput') {
                                                return <td style={{ display: cell.column.table_visibility === 'GONE' && 'none' }}
                                                    className={cell.column.className} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            } else if (cell.column.default_value === 'autoincrement') {

                                                return <td style={{ display: cell.column.table_visibility === 'GONE' && 'none' }}
                                                    className={cell.column.className} {...cell.getCellProps()} >
                                                    {picked && x}
                                                </td>
                                            } else {
                                                return <td style={{ display: cell.column.table_visibility === 'GONE' && 'none' }}
                                                    className={cell.column.className} {...cell.getCellProps()}>{cell.render('Dcell')}</td>
                                            }
                                        })
                                    }
                                </tr>
                            )
                        })
                    })()

                }
            </tbody>
        </TableUI>
    )
}


export const EditableTable = ({ columns, datas, tref }) => {

    const [originalData] = useState(datas)
    const [data, setData] = useState(datas)



    useEffect(() => {

        tref.current = (cb) => {


            if (cb)
                cb(data)
            //            // console.log('click')
        }
    }, [data])




    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page

        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )

    }

    return <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}

    />
}