import eplant from '../../../../apis/eplant'
import { FETCH_PVS, FETCH_PVSDTL, UPDATE_NAV } from '../../../../redux/actions/types'
import store from "../../../../redux/reducers"
import _ from 'lodash'


export const fetchPaymentVoucher = (pageIndex, pageSize, search, callback) => async dispatch => {






    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)


    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)

    // console.log('done fetch paymentvoucher')

    //  // console.log(response.data.query)


    dispatch(
        { type: FETCH_PVS, payload: response.data },
        {
            type: UPDATE_NAV, payload: response.data
        }
    )

    // if (callback) callback()
}
export const fetchPaymentVoucherDetail = (vouchercode) => async dispatch => {
    // console.log('run fetch paymentvoucherdetail')

    const response = await eplant.get(`/cashbank/Trx/paymentvoucher/detail?vouchercode=${(_.isUndefined(vouchercode) ? '' : vouchercode)}`)

    // console.log('done fetch paymentvoucherdetail')

    dispatch({ type: FETCH_PVSDTL, payload: response.data })
    // if (callback) callback()
}



