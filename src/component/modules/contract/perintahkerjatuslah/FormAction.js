import eplant from '../../../../apis/eplant'
import { ERROR_MODAL_STATE, FETCH_LISTDATA, FETCH_LISTDATADETAIL, GENERATE_SUBDETAIL, MODAL_STATE, RESET_DETAIL_DATA } from '../../../../redux/actions/types'
import _ from 'lodash'
import format from 'dateformat'
import { DialogLoading, errorResponse, insertRespWithSub, insertResponse, resetModalStates, submitlinkdata, updateResponse } from '../../../../redux/actions'
import { Appresources } from '../../../templates/ApplicationResources'

const ROUTES = '/contract/Trx/perintahkerjatuslah'

export const fetchDataheader = (pageIndex, pageSize, search, date) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)



    dispatch({ type: FETCH_LISTDATA, payload: response.data })
}
export const fetchDatadetail = (params) => async dispatch => {

    const response = await eplant.get(`${ROUTES}/detail?agreementcode=${params}`)

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })

}

export const fetchDataGenerate = (params, callback) => async dispatch => {
    dispatch(DialogLoading())

    const response = await eplant.get(`${ROUTES}/crdata?crcode=${params}`)

    dispatch(resetModalStates())

    dispatch(submitlinkdata(response.data))

    if (callback) callback()
}


export const isiBBM = (_val) => async dispatch => {

    dispatch({ type: GENERATE_SUBDETAIL, payload: _val })

}



export const createData = (formValues) => async (dispatch) => {

    let retVal, rowid

    try {


        const response = await eplant.post(ROUTES, formValues)


        if (response.data.error) {

            dispatch(errorResponse(response.data))

        } else {

            dispatch(insertRespWithSub(response))
        }

    }
    catch (error) {
        dispatch(errorResponse(error))
    }
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
