import eplant from '../../../../apis/eplant'
import { errorResponse, insertResponse, insertResponseForms, updateResponseForms } from '../../../../redux/actions'
import { ERROR_MODAL_STATE, EXCEPTION_ERROR, FETCH_LISTDATA, RESET_DETAIL_DATA, MODAL_STATE, RESET_MODAL } from '../../../../redux/actions/types'
import store from '../../../../redux/reducers'
import { STATUS_UPDATED } from '../../../Constants'
import { Appresources } from '../../../templates/ApplicationResources'

const ROUTES = '/purchasing/trx/evalvendor'
export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })



    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}`)


    //    // console.log(response.data)


    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
        // { type: UPDATE_NAV, payload: response.data }
    )

    if (callback) callback()
}


export const SendEmail = (params,callback) => async dispatch => {

    // dispatch({ type: RESET_DETAIL_DATA })

// console.log(formValues)

    const response = await eplant.get(`${ROUTES}/sendemail?vendorcode=${params}`)

    dispatch({
        type: MODAL_STATE,
        payload: {
            state: false,
            type: '',
            content: { ...response.data },
            contentType: '',
            actionpick: '',
            result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
        }
    })
    //    // console.log(response.data)


    // dispatch(
    //     { type: FETCH_LISTDATA, payload: response.data },
    //     // { type: UPDATE_NAV, payload: response.data }
    // )

    if (callback) callback(STATUS_UPDATED)
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
    //// console.log(formValues)

    const st = store.getState()

    let urls = ROUTES

    if (st.auth.modals.actionpick === Appresources.BUTTON_LABEL.LABEL_LANJUT_REJECT) {
        urls += `?action=REJECTED&notes=${st.auth.modals.additional_message}`
    } else {
        urls += `?action=&notes=`
    }

    try {

        const response = await eplant.put(urls, formValues)

        if (response.data.error) {
            dispatch(errorResponse(response.data))
        } else {
            retVal = response
        }

    }
    catch (error) {
        retVal = error
    }


    if (callback) callback(retVal)

}

export const deleteData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    //// console.log('delete action ', formValues.rowid)

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

