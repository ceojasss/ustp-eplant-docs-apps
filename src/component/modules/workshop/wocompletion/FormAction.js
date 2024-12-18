import eplant from '../../../../apis/eplant'
import {FETCH_DATAS,  EXCEPTION_ERROR, RESET_DETAIL_DATA, UPDATE_NAV, MODAL_STATE, ERROR_MODAL_STATE } from '../../../../redux/actions/types'
import _ from 'lodash'
import { Appresources } from '../../../templates/ApplicationResources'
import format from 'dateformat'
import { DialogLoading, errorResponse, insertResponseForms,insertResponse, resetModalStates, submitlinkdata, updateResponse } from '../../../../redux/actions'

export const ROUTES = '/workshop/Trx/wocompletion'

export const fetchDatas = () => async dispatch => {
    // console.log('run fetch bank')

    try {
        const response = await eplant.get(ROUTES)

        // console.log(response)

        //        console.log('done fetch bank')

        dispatch({ type: FETCH_DATAS, payload: response.data })

    } catch (error) {
        console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}


export const fetchDataGenerate = (params, callback) => async dispatch => {
    console.log('run fetch wocompletion')

    dispatch(DialogLoading())

    const response = await eplant.get(`${ROUTES}/crdata?workorderno=${params}`)
    console.log('process data wo completion : ', response)

    dispatch(resetModalStates())

    dispatch(submitlinkdata(response.data))

    if (callback) callback()
}

export const createData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {


        const response = await eplant.post(ROUTES, formValues)

        //        console.log(response.data)


        if (response.data.error) {


            dispatch(errorResponse(response.data))

        } else {
            dispatch(insertResponseForms(response))
        }


    }
    catch (error) {

        // console.log(error.toJSON())
        dispatch(errorResponse(error))


    } finally {
        if (callback) callback(retVal)
    }
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
