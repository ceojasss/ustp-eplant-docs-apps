/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Muhammad Ghaza 
 |                - 
 |          
 |  Description:  List Write Off Voucher
 |
 *===========================================================================*/

 import React, { useEffect, useState } from "react"
 import { Grid, Button, Search } from "semantic-ui-react"
 import { connect, useDispatch } from 'react-redux'
 import _ from 'lodash'
 import format from 'dateformat'
 import LoadingStatus from "../../../templates/LoadingStatus"
 
 import { fetchDataheader, fetchDatadetail } from './FormAction'
 import requireAuth from "../../../auth/requireAuth"
 import ContentHeader from "../../../templates/ContentHeader"
 
 import store from "../../../../redux/reducers"
 import reducer from "./FormReducer"
 import { useNavigate, useLocation } from "react-router-dom"
 import RenderTable from "../../../templates/TableDynamic"
 import { SubRowAsync } from "../../../templates/SubRowAsync"
 import { INDEXDATATRANSAKSI } from "../../../Constants"
 import { UPDATE_NAV_PERIOD, UPDATE_NAV_SEARCH } from "../../../../redux/actions/types"
 import { changeReducer, getColumn, getColumnDetail, getDetailData, getRowData, getTitle, periodHandler, QueryData, QueryDataDetail, QueryDatePeriode, QueryPageCount, QueryPageIndexes, QueryPageSizes, QueryReducerID, QuerySearch, searchHandler } from "../../../../utils/FormComponentsHelpler"
 
 const List = ({ data, datadetail, queryPageSize, queryPageIndex, pageCount, search, dateperiode, reducerid }) => {
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
 
 
     const rowClickHandler = (row) => {
         console.log(row)
 
     }
 
     const onDispatchdetail = (params) => {
         dispatch(fetchDatadetail(params))
     }
 
     useEffect(() => {
 
         console.log('change reducers payment')
         //store.injectReducer(loc.pathname.replaceAll('/', ''), reducer);
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
 
     if ((_.isEmpty(data[0]) && _.isEmpty(data[1]) && _.isEmpty(datadetail))
         || loc.pathname.replaceAll('/', '') != reducerid)
         return (<LoadingStatus />)
 
 
     return (
         <ContentHeader
             title={getTitle(data)}
             btn1={button}
             parentFunction={openModal}
             searchaction={searchHandler({search})}
             periodaction={periodHandler({dateperiode})}>
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
         reducerid: QueryReducerID(state)
     }
 }
 
 export default
     requireAuth(connect(MapStateToProps, { fetchDataheader })(List))
 
 