import React, { useEffect, useState } from "react"
import { Grid, } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import { useNavigate, useLocation } from "react-router-dom"
import LoadingStatus from "../../../templates/LoadingStatus"
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"
import RenderTable from "../../../templates/TableDynamicNoLazy"
import { SubRowAsync } from "../../../templates/SubRowAsync"
import store from "../../../../redux/reducers"
import { VH, LPO } from "../../../Constants"
import { Appresources } from "../../../templates/ApplicationResources"
import { DELETE_DATA, UPDATE_NAV_PERIOD, UPDATE_NAV_SEARCH, RESET_MODAL_ONLY, RESET_ERROR_MODAL_STATE, DELETE, UPDATE, SET_LOADING_STATUS } from "../../../../redux/actions/types"
import { DialogConfirmation, ShowData } from "../../../../redux/actions"

import reducer from "./FormReducer"
import { fetchData, fetchDatadetail } from './FormAction'
import {
    ActionHelpers, changeReducer, getColumn, getColumnDetail, getDetailData, getLoadingStatus, getRowData, getTitle, InitValidationList, periodHandler,
    PrepareEditDataGrid, QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, QuerySelectedData, searchHandler
} from "../../../../utils/FormComponentsHelpler"
import { isDataExist, UpdateResultHeader } from "../../../../utils/DataHelper"

/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Anjas Kurnia Sandy
 |                - 
 |
 |                Force Close PR List
 |                  - 
 |                  - 
 |                  - 
 *===========================================================================*/

const List = ({ crudActions, selectedData, isloading, data, datadetail, queryPageSize, queryPageIndex, pageCount, search, dateperiode, reducerid }) => {
    const loc = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const button = {
        btnLabel: 'Input Data Force Close PO',
        btnIcon: 'pen square',
        addClickHandler: () => {
            dispatch(ShowData(LPO))
        }
    }


    const rowClickHandler = async (action, row) => {

        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        switch (action) {
            case UPDATE:
                // // console.log('click edit')
                // * call function to prepare data 


                //// console.log(_.some(datadetail, ['vehiclecode', 'CM-EX1199']))
                dispatch({ type: SET_LOADING_STATUS, payload: true })

                if (!isDataExist(row.original.pocode))
                    await dispatch(fetchDatadetail(getRowData(row)));

                await PrepareEditDataGrid([row.original.pocode, row.original.remarks])

                navigate(`./edit/${encodeURIComponent(row.original.pocode)}`)
                break;
            default:
                break;
        }

    }

    const onDispatchdetail = (params) => {
        // console.log('dispatch detail', params)
        dispatch(fetchDatadetail(params))
    }




    useEffect(() => { initData(dispatch, queryPageIndex, queryPageSize, search, dateperiode, loc.pathname, reducerid) }, [dispatch, reducerid, loc.pathname, queryPageIndex, queryPageSize, search, dateperiode])


    //  const getarray = [row.original.vehiclecode, dateperiode]

    const renderRowSubComponent = React.useCallback(
        ({ row, rowProps, visibleColumns }) => (
            <SubRowAsync
                /**
                 * ! ganti vouchercode sesuai dengan id nya
                 */
                //row={[row.original.vehiclecode, dateperiode]}
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


            case Appresources.BUTTON_LABEL.LABEL_LANJUT_TRX:
                // console.log('1', selectedData)

                dispatch({ type: RESET_MODAL_ONLY })
                // console.log('2', selectedData)

                dispatch(fetchDatadetail([selectedData[0], dateperiode], async (x) => {
                    if (_.isEmpty(x)) {
                        // console.log('3', selectedData)
                        navigate("./new")
                    } else {
                        dispatch({ type: SET_LOADING_STATUS, payload: true })
                        await PrepareEditDataGrid([selectedData[0], selectedData[1]])
                        navigate(`./edit/${encodeURIComponent(selectedData[0])}`)
                    }
                }));
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

const initData = (dispatch, queryPageIndex, queryPageSize, search, dateperiode, paths, reducerid) => {

    changeReducer(paths.replaceAll('/', ''), reducer)

    if (paths.replaceAll('/', '') === reducerid)
        dispatch(fetchData(queryPageIndex, queryPageSize, search, dateperiode))
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
    requireAuth(connect(MapStateToProps, { fetchData })(List))