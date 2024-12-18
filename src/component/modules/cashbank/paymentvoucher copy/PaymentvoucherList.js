import React, { useEffect, useState } from "react"
import { Grid, Button, Search } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import LoadingStatus from "../../../templates/LoadingStatus"

import { fetchPaymentVoucher, fetchPaymentVoucherDetail } from './PaymentvoucherAction'
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import store from "../../../../redux/reducers"
import reducer from "./PaymentvoucherReducer"
import { useNavigate, useLocation } from "react-router-dom"
import RenderTable from "../../../templates/TableDynamic"


const PaymentVoucherList = ({ data, queryPageSize, queryPageIndex, pageCount }) => {
    const loc = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    //    if (state[loc.state.route].datas)
    //      // console.log(state[loc.state.route].datas.data)

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
        // console.log(row)

    }



    const vouchercode = 'GCM/PVHO/1011/03516'

    // // console.log(queryPageIndex, queryPageSize)


    useEffect(() => {
        store.injectReducer(loc.pathname.replace('/', ''), reducer);

        // // console.log(Object.keys(store.getState())[1]);

        /*  if (store.dynamicReducers && actives.activeRoute !== location.pathname.replace('/', '')) {
             store.removeReducer(actives.activeRoute);
             // console.log(`removed < ${actives.activeRoute} >  reducer`);
         }
  */

        /* if (Object.keys(store.getState())[1] || Object.keys(store.getState())[1] !== null) {
            // console.log('remove dynamic')
            store.removeReducer(Object.keys(store.getState())[1])
        } */


        //const pageIndex = Object.values(store.getState())[1]['queryPageIndex']
        //const pageSize = Object.values(store.getState())[1]['queryPageSize']

        dispatch(fetchPaymentVoucher(queryPageIndex, queryPageSize, search, () => {// navigate('../paymentvoucher')// dispatch(fetchPaymentVoucherDetail(vouchercode))
        }
        ))

    }, [dispatch, /* loc, */  queryPageIndex, queryPageSize, search])



    const searchHandler = (event) => {
        // console.log(event.nativeEvent.path[2].firstChild.children[0].value)
        setSearch(event.nativeEvent.path[2].firstChild.children[0].value)
    }
    if (_.isUndefined(data))
        return (<LoadingStatus />)



    return (
        <ContentHeader
            title={(_.isUndefined(data[2]) ? '' : _.find(data[2], { 'itemname': 'TITLE' })['prompt_ina'])}
            btn1={button}
            parentFunction={openModal}
            searchaction={searchHandler}>
            <RenderTable
                as={Grid.Column}
                columns={_.filter(data[2], (o) => { return !_.isNull(o.tablecomponent) })}
                data={data[1]}
                Controlled={pageCount}
                queryPageIndex={queryPageIndex}
                queryPageSize={queryPageSize}
                onRowClick={rowClickHandler}
            />
        </ContentHeader>
    )

    // if (!state[loc.pathname.replace('/', '')]) {

    //     return (<>loading</>)
    // } else {

    //     if (state[loc.pathname.replace('/', '')].paymentvoucher.length === 0) {
    //         return (<>loading</>)
    //     }
    // }

    // return (
    //     <ContentHeader
    //         title="Payment Voucher"
    //         btn1={button}
    //         parentFunction={() => openModal()}>
    //         <RenderTable
    //             as={Grid.Column}
    //             columns={columns}
    //             /* data={banks} */
    //             data={state[loc.pathname.replace('/', '')].paymentvoucher.data}
    //             Controlled={state[loc.pathname.replace('/', '')].paymentvoucher.count}
    //             queryPageIndex={state.paymentvoucher.queryPageIndex}
    //             queryPageSize={state.paymentvoucher.queryPageSize}
    //             />
    //     </ContentHeader>
    // )

}


const MapStateToProps = state => {

    // console.log(Object.values(state)[0]['tableDynamicControl'])

    return {
        state: state,
        queryPageIndex: Object.values(state)[0]['tableDynamicControl']['page'],
        queryPageSize: Object.values(state)[0]['tableDynamicControl']['size'],
        pageCount: (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['pageCount'] : 0),
        data: (!_.isNil(Object.values(state)[1]) ? _.filter(Object.values(state)[1]['paymentvoucher']) : []),
    }
}

export default
    requireAuth(connect(MapStateToProps, { fetchPaymentVoucher })(PaymentVoucherList))