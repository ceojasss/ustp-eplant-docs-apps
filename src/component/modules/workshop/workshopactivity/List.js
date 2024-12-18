/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Anjas Kurnia Sandy
 |                
 |          
 |  Description:  - List Workshop Activity
 |                               
 |
 *===========================================================================*/

import React, { useEffect, useState } from "react"
import { Grid, } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import { useNavigate, useLocation } from "react-router-dom"
// *library imports placed above ↑
// *local imports placed below ↓
import LoadingStatus from "../../../templates/LoadingStatus"
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"
import RenderTable from "../../../templates/TableDynamic"
import { SubRowAsync } from "../../../templates/SubRowAsync"
import store from "../../../../redux/reducers"
import { WS } from "../../../Constants"
import { Appresources } from "../../../templates/ApplicationResources"
import { DELETE_DATA, UPDATE_NAV_PERIOD, UPDATE_NAV_SEARCH, RESET_MODAL_ONLY, RESET_ERROR_MODAL_STATE, DELETE, UPDATE, SET_LOADING_STATUS, RESET_DETAIL_DATA } from "../../../../redux/actions/types"
import { DialogConfirmation, ShowData } from "../../../../redux/actions"

import reducer from "./FormReducer"
import { fetchDataheader, fetchDatadetail, deleteData } from './FormAction'
import {
    ActionHelpers, changeReducer, getColumn, getColumnDetail, getDetailData, getLoadingStatus, getRowData, getTitle, IsInsert, periodHandler,
    PrepareEditDataGrid, QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, QuerySelectedData, searchHandler
} from "../../../../utils/FormComponentsHelpler"
import { isDataExist } from "../../../../utils/DataHelper"

const List = ({ crudActions, selectedData, isloading, data, datadetail, queryPageSize, queryPageIndex, pageCount, search, dateperiode, reducerid }) => {
    const loc = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let  startdate = !_.isUndefined(data[0]) ? _.split(_.get(data[1][0], 'startdate'),'/') : null
    startdate = !_.isNull(startdate) ? new Date(startdate[2], parseInt(startdate[1])-1, startdate[0]) : null
    const button = {
        btnLabel: 'Input Data Workshop Activity',
        btnIcon: 'pen square',
        addClickHandler: () => {
            dispatch(ShowData(WS))
        },
        // disabled: IsInsert(data) != 'Y' ? true : false
        disabled: !_.isUndefined(data[0]) ? startdate <= new Date(dateperiode) ? IsInsert(data) == 'Y' ? false : true : true : 'null'
    }


    const rowClickHandler = async (action, row) => {

        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        switch (action) {
            case UPDATE:
                //  // console.log('click edit',_.isEmpty(datadetail))
                // * call function to prepare data 

                dispatch({ type: SET_LOADING_STATUS, payload: true })
                if (!isDataExist(row.original.workshopcode))
                    await dispatch(fetchDatadetail(getRowData(row)));

                await PrepareEditDataGrid([row.original.workshopcode, row.original.description])

                navigate(`./edit/${encodeURIComponent(row.original.workshopcode)}`)
                break;
            case DELETE:
                // * set custom delete message     
                dispatch(DialogConfirmation(DELETE, `Kode Data : ${row.original.workshopcode} Akan Dihapus`, row))
                break;
            default:
                break;
        }

    }

    const onDispatchdetail = (params) => {
        // console.log('dispatch detail', params)
        dispatch(fetchDatadetail(params))
    }


    useEffect(() => {

        //        store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);

        changeReducer(loc.pathname.replaceAll('/', ''), reducer)

        dispatch(fetchDataheader(queryPageIndex, queryPageSize, search, dateperiode))

    }, [dispatch, loc.pathname, queryPageIndex, queryPageSize, search, dateperiode])


    //  const getarray = [row.original.workshopcode, dateperiode]

    const renderRowSubComponent = React.useCallback(
        ({ row, rowProps, visibleColumns }) => (
            <SubRowAsync
                /**
                 * ! ganti vouchercode sesuai dengan id nya
                 */
                //row={[row.original.workshopcode, dateperiode]}
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






    // !handling actions state 
    useEffect(() => {

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

            case Appresources.BUTTON_LABEL.LABEL_LANJUT_TRX:
                dispatch({ type: RESET_MODAL_ONLY })
                dispatch({ type: RESET_DETAIL_DATA })
                dispatch(fetchDatadetail([selectedData[0], dateperiode], (x) => {
                    if (_.isEmpty(x)) {
                        navigate("./new")
                    } else if (x.length === x.length) {
                        PrepareEditDataGrid([selectedData[0], selectedData[1]])
                        navigate(`./edit/${encodeURIComponent(selectedData[0])}`)
                    }
                }));
                // if(_.isEmpty(datadetail)){
                //     navigate("./new")
                // } else {
                //     dispatch(fetchDatadetail([selectedData[0], dateperiode]))
                //     PrepareEditDataGrid([selectedData[0], selectedData[1]])
                //          navigate(`./edit/${encodeURIComponent(selectedData[0])}`)
                // }
                break;

            default:

        }

    }, [crudActions])


    // // console.log(isloading, _.isEmpty(data), loc.pathname.replaceAll('/', ''), reducerid)

    if (isloading || (_.isEmpty(data) || loc.pathname.replaceAll('/', '') != reducerid))
        return (<LoadingStatus />)



    return (
        <ContentHeader
            title={getTitle(data)}
            btn1={button}
            //parentFunction={openModal}
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
        crudActions: ActionHelpers(state),
        selectedData: QuerySelectedData(state),
        queryPageIndex: QueryPageIndexes(state),
        queryPageSize: QueryPageSizes(state),
        search: QuerySearch(state),
        dateperiode: QueryDatePeriode(state),
        pageCount: QueryPageCount(state),
        data: QueryData(state),
        datadetail: QueryDataDetail(state),
        reducerid: QueryReducerID(state),
        isloading: getLoadingStatus(state)
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchDataheader })(List))


