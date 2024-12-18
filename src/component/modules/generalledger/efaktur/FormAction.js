import _ from 'lodash'
import format from 'dateformat'

import eplant from '../../../../apis/eplant'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, RESET_DETAIL_DATA, SET_LOADING_STATUS } from '../../../../redux/actions/types'


const ROUTES = '/costbook/Trx/efaktur'

export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)


    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)

    // console.log('done fetch purchaserequest')

    console.log(response.data)

    dispatch({ type: SET_LOADING_STATUS, payload: false })
    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
        // { type: UPDATE_NAV, payload: response.data }
    )

    // if (callback) callback()
}
export const fetchDatadetail = (params, callback) => async dispatch => {
    console.log('run fetchpurchaserequestdetail ', params)


    const response = await eplant.get(`${ROUTES}/detail?nomorfaktur=${params}`)

    console.log('done fetch purchaserequestdetail')

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })

    if (callback) callback()
}
