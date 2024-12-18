/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Muhammad Ghaza 
 |                - 
 |          
 |  Description:  add change reducer
 |
 *===========================================================================*/

 import React, { useEffect } from "react"
 import { Grid } from "semantic-ui-react"
 import { connect, useDispatch } from 'react-redux'
 import _ from 'lodash'
 import { useNavigate, useLocation } from "react-router-dom"
 // *library imports placed above ↑
 // *local imports placed below ↓
 
 import requireAuth from "../../../auth/requireAuth"
 import ContentHeader from "../../../templates/ContentHeader"
 import RenderTable from "../../../templates/TableDynamicNoLazy"
 import LoadingStatus from "../../../templates/LoadingStatus"
 import { DELETE, DELETE_DATA, RESET_ERROR_MODAL_STATE, UPDATE } from "../../../../redux/actions/types"
 import { DialogConfirmation } from "../../../../redux/actions"
 import { Appresources } from "../../../templates/ApplicationResources"
 import reducer from "./FormReducer"
 import { deleteData } from './FormAction'
 import '../../../Public/CSS/App.css'
 import { ActionHelpers, getTitle, getColumn, LovDataSelected, PrepareEditData, QueryData, QueryReducerID, QuerySelectedData, getRowData, changeReducer, getLoadingStatus, QueryPageIndexes, QueryPageSizes, QuerySearch, QueryDatePeriode, QueryPageCount, periodHandler, searchHandler } from "../../../../utils/FormComponentsHelpler"
 import { fetchDataheader } from "./FormAction"
 
 const List = ({ data, crudActions, selectedData, reducerid, queryPageIndex, dateperiode, pageCount, queryPageSize, search }) => {
     const loc = useLocation()
     const dispatch = useDispatch()
     const navigate = useNavigate()
     const prevLocation = ''
     const sticky = true;
     const button = {
         btnLabel: 'Tambah Data Baru',
         btnIcon: 'pen square',
         addClickHandler: () => {
             navigate('./new')
         }
     }
 
     const rowClickHandler = async (action, row) => {
         // * reset error status
         dispatch({ type: RESET_ERROR_MODAL_STATE })
 
         //  console.log(data)
 
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
 
         dispatch(fetchDataheader(queryPageIndex, queryPageSize, search))
 
     }, [dispatch, queryPageIndex, queryPageSize, search])
 
     //    console.log(data)
 
     if (_.isEmpty(data) || loc.pathname.replaceAll('/', '') != reducerid)
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
             //parentFunction={openModal}
             searchaction={searchHandler({ search })}
            //  periodaction={periodHandler({ dateperiode })}
             >
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
             />
         </ContentHeader>
     )
 
 }
 
 
 const MapStateToProps = state => {
 
     return {
         crudActions: ActionHelpers(state),
         selectedData: QuerySelectedData(state),
         data: QueryData(state),
         reducerid: QueryReducerID(state),
         lovdata: LovDataSelected(state),
         queryPageIndex: QueryPageIndexes(state),
         queryPageSize: QueryPageSizes(state),
         search: QuerySearch(state),
         dateperiode: QueryDatePeriode(state),
         pageCount: QueryPageCount(state),
         isloading: getLoadingStatus(state)
     }
 }
 
 export default
     requireAuth(connect(MapStateToProps, { fetchDataheader })(List))
 