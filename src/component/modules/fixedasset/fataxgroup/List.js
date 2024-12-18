/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Anjas Kurnia Sandy
 |                
 |          
 |  Description:  - List FA Tax Group
 |                               
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
 import store from "../../../../redux/reducers"
 import RenderTable from "../../../templates/Table"
 import LoadingStatus from "../../../templates/LoadingStatus"
 import { DELETE, DELETE_DATA, RESET_ERROR_MODAL_STATE, UPDATE } from "../../../../redux/actions/types"
 import { DialogConfirmation } from "../../../../redux/actions"
 import { Appresources } from "../../../templates/ApplicationResources"
 import reducer from "./FormReducer"
 import { fetchDatas, deleteData } from './FormAction'
 import '../../../Public/CSS/App.css'
 import { ActionHelpers, getTitle,getColumn, LovDataSelected, PrepareEditData, changeReducer, QueryData, QueryReducerID, QuerySelectedData, getRowData } from "../../../../utils/FormComponentsHelpler"
 
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
 
         console.log(data)
 
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
             title={getTitle(data)}// (_.isNil(data[1]) ? '' : _.find(data[1], { 'itemname': 'TITLE' })['prompt_ina'])}
             btn1={button}
         //  parentFunction={openModal}
         >
             <RenderTable
                 as={Grid.Column}
                 columns={getColumn(data)}
                 data={data[0]}
                 onRowClick={rowClickHandler} />
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
 
 export default
     requireAuth(connect(MapStateToProps, { fetchDatas })(List))
 
 