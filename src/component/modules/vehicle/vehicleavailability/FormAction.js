import _ from 'lodash'
import format from 'dateformat'
// ** library imports placed above ↑
// ** local imports placed below ↓
import eplant from '../../../../apis/eplant'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, RESET_DETAIL_DATA, MODAL_STATE, ERROR_MODAL_STATE, SET_LOADING_STATUS, RESET_HIDDEN_LIST, NAV_AFTER_INSERT, NAV_AFTER_UPDATE } from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'
import { errorResponse, insertResponse, insertResponseGrid } from '../../../../redux/actions'


const ROUTES = '/vehicle/Trx/vehicleavailabilitynew'

export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    dispatch({ type: RESET_HIDDEN_LIST })



    // const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)
    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)

    //// console.log(`done fetch ${ROUTES} `)

    dispatch({ type: SET_LOADING_STATUS, payload: false })
    dispatch({ type: FETCH_LISTDATA, payload: response.data })

}


export const fetchDatadetail = (params, callback) => async dispatch => {

    // // console.log(params[0],new Date(params[0]).toLocaleDateString('en-GB'))

    const response = await eplant.get(`${ROUTES}/detail?period=${params[0]}`)
    // const response = await eplant.get(`${ROUTES}/detail?period=${new Date(params[0]).toLocaleDateString('en-GB')}`)
    // // console.log(response)

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })

    //    // console.log('run fetch paymentvoucherdetail')


    if (callback)
        callback(response.data)
}


export const createData = (formValues, callback) => async (dispatch) => {

    let retVal

    try {


        const response = await eplant.post(ROUTES, formValues)

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

export const deleteData = (formValues, callback) => async (dispatch, getState) => {

    let retVal

    // console.log('delete action ', formValues.rowid)

    try {

        // console.log('delete process ', formValues)

        const response = await eplant.delete(`${ROUTES}?id=${formValues.rowid}`, formValues)

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

export const process_initvh = (params, callback) => async dispatch => {


    //// console.log(params)

    const response = await eplant.post(`${ROUTES}/generatevh`, params)


    // console.log(response)

    if (response.data.error) {
        dispatch(errorResponse(response.data))

    } else {
        dispatch({
            type: NAV_AFTER_UPDATE,
            payload: {
                actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
                //submitdata: updatedata,
                //resetTrx: true,
                //documentTitle: documentTitle_,
                modal: {
                    state: false,
                    type: '',
                    content: '',
                    contentType: '',
                    actionpick: '',
                    result: ''
                }
            }
        })

    }

    //    // console.log('run fetch paymentvoucherdetail')


    if (callback)
        callback(response.data)
}