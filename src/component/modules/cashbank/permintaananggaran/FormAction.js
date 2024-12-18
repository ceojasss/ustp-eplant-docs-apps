import eplant from '../../../../apis/eplant'
import { errorResponse, insertResponse, insertResponseForms, updateResponseForms } from '../../../../redux/actions'
import { ERROR_MODAL_STATE, EXCEPTION_ERROR, FETCH_DATAS, MODAL_STATE } from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'

const ROUTES = '/cashbank/trx/permintaananggaran'

export const fetchDatas = () => async dispatch => {
    // // console.log('run fetch bank')

    try {
        const response = await eplant.get(ROUTES)

        // // console.log(response)

        //        // console.log('done fetch bank')

        dispatch({ type: FETCH_DATAS, payload: response.data })

    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}

export const createData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {


        const response = await eplant.post(ROUTES, formValues)

        //        // console.log(response.data)


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

export const updateData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {
        const response = await eplant.put(ROUTES, formValues)

        // console.log(formValues)
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

export const deleteData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    // console.log('delete action ', formValues.rowid)

    try {

        // // console.log('delete process ', formValues)

        const response = await eplant.delete(`${ROUTES}?id=${encodeURIComponent(formValues.rowid)}`, formValues)

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

