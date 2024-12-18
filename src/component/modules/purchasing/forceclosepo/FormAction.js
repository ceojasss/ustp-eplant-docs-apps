import eplant from '../../../../apis/eplant'
import { errorResponse, insertResponseGrid, setModalStates, setModalTrxStates } from '../../../../redux/actions'
import {
    ERROR_MODAL_STATE,
    EXCEPTION_ERROR,
    FETCH_DATAS,
    MODAL_STATE,
    RESET_DETAIL_DATA,
    FETCH_LISTDATA,
    FETCH_LISTDATADETAIL
} from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'

import format from 'dateformat'
import _ from "lodash";

const ROUTES = '/purchasing/Trx/forceclosepo'

export const fetchData = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)


    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)

    // console.log('done fetch ForceClosePO')

    // console.log(response.data)


    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
    )

    if (callback) callback()
}

export const fetchDatadetail = (params, callback) => async dispatch => {

    // console.log(params)

    const response = await eplant.get(`${ROUTES}/detail?pocode=${(_.isUndefined(params[0]) ? '' : params[0])}&dateperiode=${format(params[1], 'mm/yyyy')}`)


    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })

    //    // console.log('run fetch paymentvoucherdetail')


    if (callback)
        callback(response.data)
}




export const createData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {


        const response = await eplant.post(ROUTES, formValues)

        // console.log(response.data)


        if (response.data.error) {


            dispatch({
                type: ERROR_MODAL_STATE,
                payload: {
                    state: false,
                    type: '',
                    content: response.data,
                    contentType: '',
                    actionpick: '',
                    result: Appresources.TRANSACTION_ALERT.SAVE_FAILED
                }
            })

        } else {
            retVal = Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
            dispatch({
                type: MODAL_STATE,
                payload: {
                    state: false,
                    type: '',
                    content: '',
                    contentType: '',
                    actionpick: '',
                    result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
                }
            })
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
    // programmatic navigation after create success

}

export const updateData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    try {

        // console.log(formValues)

        const response = await eplant.put(ROUTES, formValues)

        //// console.log(response.data)

        if (response.data.error) {

            dispatch(errorResponse(response.data))

        } else {

            dispatch(insertResponseGrid(response))
        }


    }
    catch (error) {

        // // console.log(error.toJSON())
        dispatch(errorResponse(error))

    }/*  finally {
        if (callback) callback([retVal, rowid])
    } */
    // programmatic navigation after create success


}

