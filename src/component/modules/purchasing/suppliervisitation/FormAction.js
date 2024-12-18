import eplant from '../../../../apis/eplant'
import { errorResponse, insertResponse, insertResponseForms, updateResponseForms } from '../../../../redux/actions'
import { ERROR_MODAL_STATE, EXCEPTION_ERROR, FETCH_LISTDATA, RESET_DETAIL_DATA, MODAL_STATE } from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'

const ROUTES = '/purchasing/setup/suppliervisitation'
export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

  


    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}`)

    


    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
       
    )

    
}

export const createData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {


        const response = await eplant.post(ROUTES, formValues)

        


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

        //// console.log(formValues)
        //// console.log(response.data)

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
    // programmatic navigation after create success

}

export const deleteData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    

    try {

        

        const response = await eplant.delete(`${ROUTES}?id=${encodeURIComponent(formValues.rowid)}`, formValues)

        



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

