/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Anjas Kurnia Sandy
 |                - 
 |          
 |  Description:  List Transaksi Employee Ad-Hoc Allowance Deduction
 |
 *===========================================================================*/
import React, { useEffect, useState } from "react"
import { Grid, Button, Search, Header, Segment, Container } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import format from 'dateformat'
import LoadingStatus from "../../../templates/LoadingStatus"

import { fetchDataheader, fetchDatadetail } from './FormAction'
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import reducer from "./FormReducer"
import { useNavigate, useLocation } from "react-router-dom"
import RenderTable from "../../../templates/TableDynamic"
import { SubRowAsync } from "../../../templates/SubRowAsync"
import { changeReducer, getColumn, getColumnDetail, getDetailData, getRowData, getTitle, IsInsert, periodHandler, QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, searchHandler, TransactionModuleError } from "../../../../utils/FormComponentsHelpler"
import ContentError from "../../../templates/ContentError"

const List = ({ data, datadetail, queryPageSize, queryPageIndex, pageCount, search, dateperiode, reducerid, module_error }) => {
    // console.log(data[0])
    const loc = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const [search, setSearch] = useState('')
    // const [date, setDate] = useState(new Date())
    // const period = format(date, 'mm/yyyy')
    const button = {
        btnLabel: 'Tambah Data Baru',
        btnIcon: 'pen square',
        addClickHandler: () => {
            navigate("./new")
        },
        disabled: IsInsert(data) !='Y' ? true:false 
    }

    const openModal = () => {

    }


    const rowClickHandler = (row) => {
        console.log(row)

    }

    const onDispatchdetail = (params) => {
        dispatch(fetchDatadetail(params))
    }

    useEffect(() => {

        // console.log('change reducers payment')
        // store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);
        changeReducer(loc.pathname.replaceAll('/', ''), reducer)
        //  actives.activeRoute

        dispatch(fetchDataheader(queryPageIndex, queryPageSize, search, dateperiode))

    }, [dispatch, queryPageIndex, queryPageSize, search, dateperiode])


    const renderRowSubComponent = React.useCallback(
        ({ row, rowProps, visibleColumns }) => (
            <SubRowAsync
                /**
                 * ! ganti vouchercode sesuai dengan id nya
                 */
                row={getRowData(row)}
                rowProps={rowProps}
                column={getColumnDetail(data)}
                visibleColumns={visibleColumns}
                onDispatchdetail={onDispatchdetail}
                header={'Detail Transaksi ' + getTitle(data)}
                /**
             * ! ganti vouchercode sesuai dengan id nya
             */
                datasdetail={getDetailData(row)}
            />
        ),
        [datadetail]
    );

    console.log(module_error[0])

    if (!_.isEmpty(module_error))
        return <ContentError error={module_error} />



    if ((_.isEmpty(data[0]) && _.isEmpty(data[1]) && _.isEmpty(datadetail))
        || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus />)



    return (
        <ContentHeader
            title={getTitle(data)}
            btn1={button}
            parentFunction={openModal}
            searchaction={searchHandler({ search })}
            periodaction={periodHandler({ dateperiode })}>
            <RenderTable
                as={Grid.Column}
                columns={getColumn(data)}
                data={data[0]}
                Controlled={pageCount}
                queryPageIndex={queryPageIndex}
                queryPageSize={queryPageSize}
                search={search}
                dateperiode={dateperiode}
                onRowClick={rowClickHandler}
                renderRowSubComponent={renderRowSubComponent}
            />

        </ContentHeader>
    )


}


const MapStateToProps = state => {

    return {
        queryPageIndex: QueryPageIndexes(state),
        queryPageSize: QueryPageSizes(state),
        search: QuerySearch(state),
        dateperiode: QueryDatePeriode(state),
        pageCount: QueryPageCount(state),
        data: QueryData(state),
        datadetail: QueryDataDetail(state),
        reducerid: QueryReducerID(state),
        module_error: TransactionModuleError()
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchDataheader })(List))

