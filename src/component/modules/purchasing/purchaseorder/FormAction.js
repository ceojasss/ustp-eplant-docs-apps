import eplant from '../../../../apis/eplant'
import { CHANGE_MODAL_ITEM_STATE, FETCH_LISTDATA, FETCH_LISTDATADETAIL, MODAL_STATE, RESET_DETAIL_DATA, UPDATE_NAV } from '../../../../redux/actions/types'
import _ from 'lodash'
import format from 'dateformat'
import { Appresources } from '../../../templates/ApplicationResources'
import { errorResponse, insertResponse, updateResponse } from '../../../../redux/actions'


export const ROUTES = '/purchasing/Trx/purchaseorder'

export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)


    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)

    //  // console.log('done fetch purchaseorder')

    // // console.log(response.data)


    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
        // { type: UPDATE_NAV, payload: response.data }
    )

    // if (callback) callback()
}
export const fetchDatadetail = (params) => async dispatch => {
    // console.log('run fetch purchaseorderdetail')

    const response = await eplant.get(`${ROUTES}/detail?pocode=${(_.isUndefined(params) ? '' : params)}`)

    // console.log('done fetch purchaseorderdetail')

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })
    // if (callback) callback()
}


export const createData = (formValues) => async (dispatch) => {

    let retVal, rowid

    try {
        dispatch({
            type: CHANGE_MODAL_ITEM_STATE,
            payload: { content: 'Saving Data', contentType: Appresources.TRANSACTION_ALERT.SAVE_PROCESS, state: true, message: null, busy: true }
        })


        const response = await eplant.post(ROUTES, formValues)

        if (response.data.error) {
            dispatch(errorResponse(response.data))
        } else {
            dispatch(insertResponse(response))
        }

    }
    catch (error) {

        dispatch(errorResponse(error))

    }/*  finally {
        if (callback) callback([retVal, rowid])
    } */
    // programmatic navigation after create success

}


export const updateData = (formValues, callback) => async dispatch => {

    let retVal

    try {


        const response = await eplant.put(ROUTES, formValues)

        if (response.data.error) {

            dispatch(errorResponse(response.data))

        } else {

            dispatch(updateResponse(response))
        }



    }
    catch (error) {

        // // console.log(error.toJSON())

        dispatch({
            type: MODAL_STATE,
            payload: {
                state: false,
                type: '',
                content: { error },
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.SAVE_FAILED
            }
        })

    } finally {
        if (callback) callback(retVal)
    }
}