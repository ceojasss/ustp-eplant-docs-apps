/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Sultan Alif 
 |  
 |          
 |  Description:  Perintah Kerja List
 |
 *===========================================================================*/

import React, { useEffect, useState } from "react"
import { Grid, Button, Search } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import format from 'dateformat'
import LoadingStatus from "../../../templates/LoadingStatus"

import { fetchDataheader, fetchDatadetail, deleteData } from './FormAction'
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import store from "../../../../redux/reducers"
import reducer from "./FormReducer"
import { useNavigate, useLocation } from "react-router-dom"
import RenderTable from "../../../templates/TableDynamic"
import { SubRowAsync } from "../../../templates/SubRowAsync"
import { INDEXDATATRANSAKSI } from "../../../Constants"
import { DialogConfirmation } from "../../../../redux/actions"
import { Appresources } from "../../../templates/ApplicationResources"
import { DELETE_DATA, DELETE, UPDATE_NAV_PERIOD, UPDATE_NAV_SEARCH, RESET_ERROR_MODAL_STATE, SET_LOADING_STATUS, UPDATE } from "../../../../redux/actions/types"
import {
    ActionHelpers, changeReducer, getColumn, getColumnDetail, getDetailData, getRowData, getTitle, periodHandler, QueryData, QueryDataDetail,
    QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, searchHandler, prepareEditDataMasterDetail, QuerySelectedData, IsInsert
} from "../../../../utils/FormComponentsHelpler"
import { UpdateResultHeader } from "../../../../utils/DataHelper"
import { isDataExist } from "../../../../utils/DataHelper"

const List = ({ data, crudActions, selectedData, datadetail, queryPageSize, queryPageIndex, pageCount, search, dateperiode, reducerid }) => {
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


    const rowClickHandler = async (action, row) => {
        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        switch (action) {
            case UPDATE:
                // console.log('click edit')
                // * call function to prepare data 

                dispatch({ type: SET_LOADING_STATUS, payload: true })
                if (!isDataExist(row.original.agreementcode))
                    await dispatch(fetchDatadetail(row.original.agreementcode,
                        // async () => {
                        // await prepareEditDataMasterDetail(row)
                        // }
                    )
                    );
                await prepareEditDataMasterDetail(row)

                navigate(`./edit/${encodeURIComponent(row.original.agreementcode)}`)
                break;
            case DELETE:
                // * set custom delete message     
                dispatch(DialogConfirmation(DELETE, `Kode Data : ${row.original.agreementcode} Akan Dihapus`, row))
                break;
            default:
                break;
        }

    }

    const onDispatchdetail = (params) => {
        dispatch(fetchDatadetail(params))
    }

    useEffect(() => {

        changeReducer(loc.pathname.replaceAll('/', ''), reducer);
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

    if ((_.isEmpty(data[0]) && _.isEmpty(data[1]) && _.isEmpty(datadetail))
        || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus />)


    // !handling actions state 
    if (crudActions) {

        console.log('data selected', crudActions)

        switch (crudActions) {

            case Appresources.BUTTON_LABEL.LABEL_DELETE:
                dispatch(
                    deleteData(selectedData, (v) => {
                        console.log(selectedData.rowid, v)
                        if (v === Appresources.TRANSACTION_ALERT.DELETE_SUCCESS)
                            dispatch({ type: DELETE_DATA, payload: { rowid: selectedData.rowid } })
                    }
                    )
                )
                break;

            default:

        }

    }

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

/*
const findNodesByValue = (node, value) => {
    let matches = [];

    _.map(node, x => {
        console.log(x.childs)
    })


    return true
      if (node.route === value) {
         matches.push(node);
     }
     for (let child of node.childs) {
         matches = matches.concat(findNodesByValue(child, value));
     }
     return matches; 
}*/



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
        reducerid: QueryReducerID(state)
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchDataheader })(List))
