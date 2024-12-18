import eplant from '../../../../apis/eplant'
import { errorResponse, insertResponse, insertResponseForms, updateResponseForms } from '../../../../redux/actions'
import {FETCH_LISTDATA, RESET_DETAIL_DATA, ERROR_MODAL_STATE, EXCEPTION_ERROR, FETCH_DATAS, MODAL_STATE, FETCH_LISTDATADETAIL } from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'
import format from 'dateformat'
import _ from 'lodash'

const ROUTES = "/journalvoucher/setup/batchjournal";

export const fetchDatas = (pageIndex, pageSize,search,date) => async dispatch => {
    // console.log(pageIndex)

    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&periodno=${format(date, 'mm')}&financialyear=${format(date, 'yyyy')}&search=${search}`)
    console.log(response.data, "testing")
    // console.log(response)
    dispatch({ type: FETCH_LISTDATA, payload: response.data })
    // if (callback) callback()
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

export const updateData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {
        const response = await eplant.put(ROUTES, formValues)

        //console.log(formValues)
        //console.log(response.data)

        if (response.data.error) {


            dispatch(errorResponse(response.data))

        } else {
            dispatch(updateResponseForms(response))
        }
       
    }
    catch (error) {
        dispatch(errorResponse(error))
      
    } finally {
        if (callback) callback(retVal)
    }

}

export const deleteData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    console.log('delete action ', formValues.rowid)

    try {

        // console.log('delete process ', formValues)

        const response = await eplant.delete(`${ROUTES}?id=${encodeURIComponent(formValues.rowid)}`, formValues)

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


