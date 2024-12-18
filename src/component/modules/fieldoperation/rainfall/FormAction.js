import eplant from '../../../../apis/eplant'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, RESET_DETAIL_DATA, UPDATE_NAV } from '../../../../redux/actions/types'
import _ from 'lodash'
import format from 'dateformat'

const ROUTES = '/fieldoperation/Trx/rainfall'
export const fetchDataheader = ( dateperiode) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)

    console.log(dateperiode)
    const response = await eplant.get(`${ROUTES}?year=${format(dateperiode, 'yyyy')}`)

    console.log('done fetch rainfall')

    console.log(response.data)


    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
        // { type: UPDATE_NAV, payload: response.data }
    )

    // if (callback) callback()
}
export const fetchDatadetail = (params) => async dispatch => {
    console.log('run fetch rainfalldetail')

    const response = await eplant.get(`${ROUTES}/detail?estatecode=${params[0]}&divisioncode=${params[1]}&period=${format(params[2], 'mm/yyyy')}`)

    console.log('done fetch rainfalldetail')

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })
    // if (callback) callback()
}
