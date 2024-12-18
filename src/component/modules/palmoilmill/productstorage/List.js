/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Andi Firdana Setiawan
 |                
 |          
 |  Description:  - List Product Storage
 |                               
 |
 *===========================================================================*/

 
 import React, { useEffect } from "react"
 import { connect, useDispatch } from "react-redux"
 import _ from 'lodash'
 import requireAuth from "../../../auth/requireAuth"
 import { useLocation, useNavigate } from "react-router-dom"
 import ContentHeader from "../../../templates/ContentHeader"
 import RenderTable from "../../../templates/Table"
 import { ActionHelpers, getTitle, getColumn, LovDataSelected, PrepareEditData, QueryData, QueryReducerID, QuerySelectedData, getRowData, changeReducer } from "../../../../utils/FormComponentsHelpler"
 import { DELETE, DELETE_DATA, RESET_ERROR_MODAL_STATE, UPDATE } from "../../../../redux/actions/types"
 import { DialogConfirmation } from "../../../../redux/actions"
 import { deleteData, fetchDatas } from "./FormAction"
 import reducer from "./FormReducer"
 import LoadingStatus from "../../../templates/LoadingStatus"
 import { Appresources } from "../../../templates/ApplicationResources"
 import { Grid } from "semantic-ui-react"
 
  const List = ({ data, crudActions, selectedData, reducerid }) => {
     const loc = useLocation()
     const dispatch = useDispatch()
     const navigate = useNavigate()
     const prevLocation = ''
 
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
 
                 dispatch(DialogConfirmation(DELETE, message, null,row))
                 break;
             default:
                 break;
         }
 
     }
 
     useEffect(() => {
         changeReducer(loc.pathname.replaceAll('/', ''), reducer)
         dispatch(fetchDatas())
 
         return () => {
             dispatch({ type: RESET_ERROR_MODAL_STATE })
         };
 
     }, [dispatch])
 
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
         >
             <RenderTable
              as={Grid.Column}
              columns={getColumn(data)}
              data={data[0]}
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
         lovdata: LovDataSelected(state)
     }
 }
 
  export default requireAuth(connect(MapStateToProps, { fetchDatas })(List))