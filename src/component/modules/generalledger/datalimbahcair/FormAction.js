import eplant from '../../../../apis/eplant'
import { errorResponse, insertResponse, insertResponseForms, insertResponseGrid, updateResponseForms } from '../../../../redux/actions'
import { ERROR_MODAL_STATE, EXCEPTION_ERROR, FETCH_LISTDATA,RESET_DETAIL_DATA, MODAL_STATE, FETCH_LISTDATADETAIL } from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'
import format from 'dateformat'
import _ from 'lodash'

const ROUTES = '/costbook/Trx/limbahcair'

export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    //    const pageSize = (!_.isNil(Object.values(state)[1]) ? Object.values(state)[1]['queryPageSize'] : 10),

    //    const response = await eplant.get(`/cashbank/Trx/paymentvoucher?page=${(_.isUndefined(pageIndex) ? 0 : pageIndex)}&size=${(_.isUndefined(pageSize) ? 10 : pageSize)}&search=${search}`)


    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'yyyy')}`)

    //console.log('done fetch foptphmaster')

    console.log("data limbah",response.data)


    dispatch(
        { type: FETCH_LISTDATA, payload: response.data },
        // { type: UPDATE_NAV, payload: response.data }
    )

    // if (callback) callback()
}

export const fetchDatadetail = (params, callback) => async dispatch => {

    // console.log(params)

    const response = await eplant.get(`${ROUTES}/detail?p_type=${(_.isUndefined(params[0]) ? '' : params[0])}&p_month=${(_.isUndefined(params[2]) ? '' : params[2])}&p_year=${(_.isUndefined(params[1]) ? '' : params[1])}`)


    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })

    //    console.log('run fetch paymentvoucherdetail')


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

    }/*  finally {
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
