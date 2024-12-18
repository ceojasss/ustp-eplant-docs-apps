import React, { useEffect, useState } from "react"
import { Grid, Button, Search } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import format from 'dateformat'
import LoadingStatus from "../../../templates/LoadingStatus"

import { deleteData, fetchDataheader } from './FormAction'
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import store from "../../../../redux/reducers"
import reducer from "./FormReducer"
import { useNavigate, useLocation } from "react-router-dom"
import RenderTable from "../../../templates/TableDynamicNoLazy"
import { SubRowAsync } from "../../../templates/SubRowAsync"
import { INDEXDATATRANSAKSI } from "../../../Constants"
import { DELETE, DELETE_DATA, RESET_DETAIL_DATA, RESET_ERROR_MODAL_STATE, SET_LOADING_STATUS, UPDATE, UPDATE_NAV_PERIOD, UPDATE_NAV_SEARCH } from "../../../../redux/actions/types"
import { ActionHelpers, changeReducer, getColumn, getColumnDetail, getDetailData, getLoadingStatus, getRowData, getTitle, IsInsert, periodHandler, PrepareEditData, prepareEditDataMasterDetail, QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, QuerySelectedData, searchHandler } from "../../../../utils/FormComponentsHelpler"
import { DialogConfirmation } from "../../../../redux/actions"
import { isDataExist } from "../../../../utils/DataHelper"
import { Appresources } from "../../../templates/ApplicationResources"

/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Dwi ADi
 |                - 
 |          
 |  Description:  Helper Functions for Form / List Component
 |                > list of functions                 
 |                  - 
 |                  - 
 |                  - 
 *===========================================================================*/

const List = ({ data, datadetail, isloading, queryPageSize, queryPageIndex, pageCount, search, dateperiode, selectedData, crudActions, reducerid }) => {
    

    const loc = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const button = {
        btnLabel: 'Tambah Data Baru',
        btnIcon: 'pen square',
        addClickHandler: () => {
            //  // console.log('go')
            navigate("./new")
        },
        disabled: IsInsert(data) != 'Y' ? true : false
    }



    const rowClickHandler = async (action, row) => {
        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        // console.log(row)

        switch (action) {
            case UPDATE:
                // * call function to prepare data
                await PrepareEditData(row)
                navigate(`./edit/${encodeURIComponent(Object.values(row.values)[0])}`)
                break;
            case DELETE:
                // * set custom delete message
                let message = `Kode Data : ${getRowData(row)} Akan Dihapus`

                dispatch(DialogConfirmation(DELETE, message, null, row))
                break;
            default:
                break;
        }

    }



    useEffect(() => {


        changeReducer(loc.pathname.replaceAll('/', ''), reducer)

        dispatch(fetchDataheader(queryPageIndex, queryPageSize, search, dateperiode))

    }, [dispatch, queryPageIndex, queryPageSize, search, dateperiode])

    // !handling actions state 
    if (crudActions) {

        //  // console.log('data selected', crudActions)

        switch (crudActions) {

            case Appresources.BUTTON_LABEL.LABEL_DELETE:
                dispatch(
                    deleteData(selectedData, (v) => {
                        // console.log(selectedData.rowid, v)
                        if (v === Appresources.TRANSACTION_ALERT.DELETE_SUCCESS)
                            dispatch({ type: DELETE_DATA, payload: { rowid: selectedData.rowid } })
                    }
                    )
                )
                break;

            default:

        }

    }



    if (isloading || (_.isEmpty(data[0]) && _.isEmpty(data[1]) && _.isEmpty(datadetail))
        || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus />)


    return (
        <ContentHeader
            title={getTitle(data)}
            btn1={button}
            searchaction={searchHandler({ search })}>
            <RenderTable
                as={Grid.Column}
                columns={getColumn(data)}
                data={(data[0])}
                Controlled={pageCount}
                queryPageIndex={queryPageIndex}
                queryPageSize={queryPageSize}
                search={search}
                dateperiode={dateperiode}
                onRowClick={rowClickHandler}
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
        isloading: getLoadingStatus(state),
        crudActions: ActionHelpers(state),
        selectedData: QuerySelectedData(state),
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchDataheader })(List))
