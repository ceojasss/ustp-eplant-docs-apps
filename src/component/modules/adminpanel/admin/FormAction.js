import eplant from '../../../../apis/eplant'
import { errorResponse, insertResponseForms, updateResponseForms } from '../../../../redux/actions'
import { FETCH_DATAS, ERROR_MODAL_STATE, MODAL_STATE } from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'

const ROUTES = '/admin/adminpanel/'
export const fetchDatas = (params) => async dispatch => {
    // console.log('run fetch stock',ROUTES+params)

    const response = await eplant.get(ROUTES + params.replace('admin', ''))

    // console.log('done fetch stock')

    dispatch({ type: FETCH_DATAS, payload: response.data.data })
}

// const response = await eplant.post(ROUTES+params.replaceAll('admin',''), formValues)

export const createData = (params, formValues, callback) => async (dispatch) => {
    // console.log(params,formValues)
    let retVal

    try {


        const response = await eplant.post(ROUTES + params.replaceAll('admin', ''), formValues)

        // console.log(response)


        if (response.data.error) {


            dispatch(errorResponse(response.data))

        } else {
            dispatch(insertResponseForms(response))
        }


    }
    catch (error) {

        // // console.log(error.toJSON())
        dispatch(errorResponse(error))


    } finally {
        if (callback) callback(retVal)
    }
    // programmatic navigation after create success

}

export const updateData = (params, formValues, callback) => async (dispatch) => {

    let retVal

    try {
        const response = await eplant.put(ROUTES + params.replaceAll('admin', ''), formValues)

        //// console.log(formValues)
        //// console.log(response.data)

        if (response.data.error) {


            dispatch(errorResponse(response.data))

        } else {
            dispatch(updateResponseForms(response))
        }
        /* 
        
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
                    retVal = Appresources.TRANSACTION_ALERT.UPDATE_SUCCESS
                    dispatch({
                        type: MODAL_STATE,
                        payload: {
                            state: false,
                            type: '',
                            content: '',
                            contentType: '',
                            actionpick: '',
                            result: Appresources.TRANSACTION_ALERT.UPDATE_SUCCESS
                        }
                    })
                } */


    }
    catch (error) {
        dispatch(errorResponse(error))
        // // console.log(error.toJSON())

        /*    dispatch({
               type: MODAL_STATE,
               payload: {
                   state: false,
                   type: '',
                   content: { error },
                   contentType: '',
                   actionpick: '',
                   result: Appresources.TRANSACTION_ALERT.SAVE_FAILED
               }
           }) */

    } finally {
        if (callback) callback(retVal)
    }
    // programmatic navigation after create success

}

export const deleteData = (params, formValues, callback) => async (dispatch, getState) => {

    let retVal

    // console.log('delete action ', formValues.rowid)

    try {

        // // console.log('delete process ', formValues)

        const response = await eplant.delete(`${ROUTES + params.replaceAll('admin', '')}?id=${encodeURIComponent(formValues.rowid)}`, formValues)

        // console.log('delete response', response)



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

        // // console.log(error.toJSON())

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