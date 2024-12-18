/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Dwi Adi
 |                - 
 |          
 |  Description:  Contract Invoice Tuslah List
 |
 *===========================================================================*/

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
 import { DELETE, DELETE_DATA, RESET_ERROR_MODAL_STATE, UPDATE, UPDATE_NAV_PERIOD, UPDATE_NAV_SEARCH } from "../../../../redux/actions/types"
 import { ActionHelpers, changeReducer, getColumn,  getRowData,  getTitle,  PrepareEditData,  QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, QuerySelectedData, searchHandler } from "../../../../utils/FormComponentsHelpler"
import { DialogConfirmation } from "../../../../redux/actions"
import { Appresources } from "../../../templates/ApplicationResources"
 
 const List = ({ data, queryPageSize, queryPageIndex, pageCount, search, reducerid, crudActions, selectedData,dateperiode}) => {
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
         }
     }
 
     const openModal = () => {
 
     }
 
 
     const rowClickHandler = async (action, row) => {
        // * reset error status
        dispatch({ type: RESET_ERROR_MODAL_STATE })

        console.log(row)

        switch (action) {
            case UPDATE:
                // * call function to prepare data
                await PrepareEditData(row)
                navigate(`./edit/${encodeURIComponent(Object.values(row.values)[0])}`)
                break;
            case DELETE:
                // * set custom delete message
                let message = `Kode Data : ${getRowData(row)} Akan Dihapus`

                dispatch(DialogConfirmation(DELETE, message, null,row))
                break;
            default:
                break;
        }

    }
 
     useEffect(() => {
 
         // console.log('change reducers payment')
         // store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);
         changeReducer(loc.pathname.replaceAll('/', ''), reducer)
 
         //  actives.activeRoute
 
         dispatch(fetchDataheader(queryPageIndex, queryPageSize, search))
 
     }, [dispatch, queryPageIndex, queryPageSize, search])
     

 
     if ((_.isEmpty(data[0]) && _.isEmpty(data[1]))
         || loc.pathname.replaceAll('/', '') != reducerid)
         return (<LoadingStatus />)
 
 // !handling actions state 
 if (crudActions) {
 
    //  console.log('data selected', crudActions)

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
             searchaction={searchHandler({search})}>
             <RenderTable
                 as={Grid.Column}
                 columns={getColumn(data)}
                 data={data[0]}
                 Controlled={pageCount}
                 dateperiode={dateperiode}
                 queryPageIndex={queryPageIndex}
                 queryPageSize={queryPageSize}
                 search={search}
                 onRowClick={rowClickHandler}
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
         reducerid: QueryReducerID(state)
     }
 }
 
 export default
     requireAuth(connect(MapStateToProps, { fetchDataheader })(List))
 
 