import eplant from '../../../../apis/eplant'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, RESET_DETAIL_DATA, UPDATE_NAV, MODAL_STATE, ERROR_MODAL_STATE, CHANGE_MODAL_ITEM_STATE } from '../../../../redux/actions/types'
import _ from 'lodash'
import { Appresources } from '../../../templates/ApplicationResources'
import format from 'dateformat'
import { DialogLoading, errorResponse, insertResponse, resetModalStates, submitlinkdata, updateResponse } from '../../../../redux/actions'

export const ROUTES = '/stores/Trx/transferreceivevoucher'

export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)

    dispatch({ type: FETCH_LISTDATA, payload: response.data })

}

export const fetchDatadetail = (transferreceivecode,wodate,transferincode) => async dispatch => {
    console.log('run fetch perintahkerjadetail')

    const response = await eplant.get(`${ROUTES}/detail?transferreceivecode=${transferreceivecode}&wodate=${wodate}&transferincode=${transferincode}`)

    console.log('done fetch perintahkerjadetail')

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })
    // if (callback) callback()
}


export const fetchDataGenerate = (transferincode,wodate,transferreceivecode, callback) => async dispatch => {
    console.log('run fetch perintahkerjadetail')

    dispatch(DialogLoading())

    const response = await eplant.get(`${ROUTES}/crdata?transferincode=${transferincode}&wodate=${wodate}&transferreceivecode=${transferreceivecode}`)
    console.log('process data transfer receive voucher : ', response)

    dispatch(resetModalStates())

    dispatch(submitlinkdata(response.data))

    if (callback) callback()
}

export const createData = (formValues) => async (dispatch) => {

    let retVal, rowid



    try {

        dispatch({
            type: CHANGE_MODAL_ITEM_STATE,
            payload: { content: 'Saving Data', contentType: Appresources.TRANSACTION_ALERT.SAVE_PROCESS, state: true, message: null }
        })

        const response = await eplant.post(ROUTES, formValues)

        console.log('cek create data trv',response.data)

        if (response.data.error) {

            dispatch(errorResponse(response.data))

        } else {

            dispatch(insertResponse(response))
        }


    }
    catch (error) {

        // console.log(error.toJSON())
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

        console.log(response.data)


        if (response.data.error) {

            dispatch(errorResponse(response.data))

        } else {

            dispatch(updateResponse(response))
        }



    }
    catch (error) {

        // console.log(error.toJSON())

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

export const deleteData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    console.log('delete action ', formValues.rowid)

    try {

        console.log('delete process ', formValues)

        const response = await eplant.delete(`${ROUTES}?id=${formValues.rowid}`, formValues)

        console.log('delete response', response)



        if (response.data.error) {
            dispatch({
                type: ERROR_MODAL_STATE,
                payload: {
                    state: false,
                    type: '',
                    content: response.data,
                    contentType: '',
                    actionpick: '',
                    result: Appresources.TRANSACTION_ALERT.DELETE_FAILED
                }
            })
        } else {
            retVal = Appresources.TRANSACTION_ALERT.DELETE_SUCCESS
            dispatch({
                type: MODAL_STATE,
                payload: {
                    state: false,
                    type: '',
                    content: '',
                    contentType: '',
                    actionpick: '',
                    result: Appresources.TRANSACTION_ALERT.DELETE_SUCCESS
                }
            })
        }


    }
    catch (error) {

        // console.log(error.toJSON())

        dispatch({
            type: ERROR_MODAL_STATE,
            payload: {
                state: false,
                type: '',
                content: { error },
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.DELETE_FAILED
            }
        })

    } finally {
        if (callback) callback(retVal)
    }
    // programmatic navigation after create success

}
