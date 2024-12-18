import eplant from '../../../../apis/eplant'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, RESET_DETAIL_DATA, UPDATE_NAV } from '../../../../redux/actions/types'
import _ from 'lodash'
import format from 'dateformat'

const ROUTES = '/emp/Trx/gangmasterperiod'
export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)


    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)

    console.log('done fetch gangmasterperiod')

    console.log(response.data)


    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
        // { type: UPDATE_NAV, payload: response.data }
    )

    // if (callback) callback()
}
export const fetchDatadetail = (params) => async dispatch => {
    console.log('run fetch gangmasterperioddetail')

    const response = await eplant.get(`${ROUTES}/detail?gangcode=${(_.isUndefined(params) ? '' : params)}`)

    console.log('done fetch gangmasterperioddetail')

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })
    // if (callback) callback()
}