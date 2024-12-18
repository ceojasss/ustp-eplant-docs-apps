import eplant from '../../../../apis/eplant'
import { ERROR_MODAL_STATE, FETCH_LISTDATA, FETCH_LISTDATADETAIL, MODAL_STATE, RESET_DETAIL_DATA, SET_LOADING_STATUS } from '../../../../redux/actions/types'
import _ from 'lodash'
import { errorResponse, insertResponseGrid } from '../../../../redux/actions'
import { Appresources } from '../../../templates/ApplicationResources'
import { STATUS_UPDATED } from '../../../Constants'
import format from 'dateformat'

const ROUTES = '/util/trx/lhmapproval'
export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)


    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'dd/mm/yyyy')}`)

    console.log('done fetch currencydtl')

    console.log(response.data)
    dispatch({ type: SET_LOADING_STATUS, payload: false })

    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
        // { type: UPDATE_NAV, payload: response.data }
    )

    // if (callback) callback()
}
export const fetchDatadetail = (params, callback) => async dispatch => {

    let url = `${ROUTES}/detail?docnum=${encodeURIComponent(params[0])}`

    const response = await eplant.get(url)


    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })
    if (callback)
        callback(response.data)
}


export const createData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {


        const response = await eplant.post(ROUTES, formValues)

        //console.log(response.data)

        if (response.data.error) {

            dispatch(errorResponse(response.data))

        } else {

            dispatch(insertResponseGrid(response))
        }


    }
    catch (error) {

        // console.log(error.toJSON())
        dispatch(errorResponse(error))

    }


    /*  finally {
        if (callback) callback([retVal, rowid])
    } */
    // programmatic navigation after create success

}

export const updateData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    try {

        console.log(formValues)

        const response = await eplant.put(ROUTES, formValues)

        //console.log(response.data)

        if (response.data.error) {

            dispatch(errorResponse(response.data))

        } else {

            dispatch(insertResponseGrid(response))
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


export const executeActions = (formValues, actions, choice, callback) => async dispatch => {

    let retVal

    try {

        console.log(choice)

        const val = _.merge(formValues, actions, { 'actionchoice': choice })

        const response = await eplant.post(ROUTES, formValues)


        if (response.data.errorMessage) {
            //// console.log('error', response.data.errorMessage)
            dispatch(errorResponse(response.data.errorMessage))

        } else {

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
        }


        if (callback)
            callback(STATUS_UPDATED)

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

    }
}