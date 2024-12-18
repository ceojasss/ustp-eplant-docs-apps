import _ from 'lodash'
import format from 'dateformat'
// ** library imports placed above ↑
// ** local imports placed below ↓
import eplant from '../../../../apis/eplant'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, RESET_DETAIL_DATA, MODAL_STATE, ERROR_MODAL_STATE, SET_LOADING_STATUS, DATE_FILTER, UPDATE_LISTDATADETAIL } from '../../../../redux/actions/types'
import { Appresources } from '../../../templates/ApplicationResources'
import { errorResponse, insertResponse, insertResponseGrid } from '../../../../redux/actions'
import { PrepareEditDataGrid, PrepareFilteredDataGrid, parseDatetoString, parseStringToDate, trxKeys } from '../../../../utils/FormComponentsHelpler'
import store from '../../../../redux/reducers'
import { get, useFormContext } from 'react-hook-form'



const ROUTES = '/emp/setup/workingcalendar'

export const fetchDataheader = (pageIndex, pageSize, search, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })



    const response = await eplant.get(`${ROUTES}?page=${pageIndex}&size=${pageSize}&search=${search}&dateperiode=${format(date, 'mm/yyyy')}`)

    //// console.log(`done fetch ${ROUTES} `)

    dispatch({ type: SET_LOADING_STATUS, payload: false })
    dispatch({ type: FETCH_LISTDATA, payload: response.data })

}


export const fetchDatadetail = (params, callback) => async dispatch => {

    console.log('all params : ',params)

    const response = await eplant.get(`${ROUTES}/detail?pyear=${(_.isUndefined(params[0]) ? '' : params[0])}&pmonth=${(_.isUndefined(params[1]) ? '' : params[1])}`)
    
    console.log('response detail : ', response);

    dispatch({ type: FETCH_LISTDATADETAIL, payload: response.data })

    //    // console.log('run fetch paymentvoucherdetail')


    if (callback)
        callback(response.data)
}

export const fetchDetailEdit = (params, callback) => async dispatch => {

    //// console.log(params) detaillimit
    //    const response = await eplant.get(`${ROUTES}/detail?vehiclecode=${(_.isUndefined(params[0]) ? '' : params[0])}&period=${format(params[1], 'mm/yyyy')}`)

    const response = await eplant.get(`${ROUTES}/detaillimit?pyear=${(_.isUndefined(params[0]) ? '' : params[0])}&pmonth=${(_.isUndefined(params[1]) ? '' : params[1])}`)

    console.log('response :', response);
    const { data } = response


    const dateLimit = _.isUndefined(_.get(data.data[0], 'datelimit')) ? false : _.get(data.data[0], 'datelimit')
    const dateList = _.map(data.datefilter, x => parseStringToDate(x, '-'))

    let latestDate = new Date(Math.max(...dateList));
    let latestDate1 = new Date(Math.max(...dateList));


    if (!_.isNull(latestDate) && dateLimit) {
        dispatch({ type: DATE_FILTER, payload: { datefilterone: latestDate.setDate(latestDate.getDate()-2) , datefiltertwo: latestDate1 , datelimit: dateLimit, datelist: dateList } })
    } else {
        dispatch({ type: DATE_FILTER, payload: { datefilterone: null, datefiltertwo: null, datelimit: dateLimit } })
    }

    // console.log(data.data)

    dispatch({ type: FETCH_LISTDATADETAIL, payload: data.data })

    if (callback)
        callback(data.data)
}



export const fetchDetailBydate = (params, callback) => async dispatch => {


    const st = store.getState()

    const dateSelected = !_.isNil(st.auth.modals.actionvalueone) ? st.auth.modals.actionvalueone : st[trxKeys()].datefilterone
    const dateSelected2 = !_.isNil(st.auth.modals.actionvaluetwo) ? st.auth.modals.actionvaluetwo : st[trxKeys()].datefiltertwo

// console.log(st.auth.modals.actionvaluetwo)
    //  dispatch({ type: SET_LOADING_STATUS, payload: true })

    dispatch({ type: UPDATE_LISTDATADETAIL, payload: [] })




    const response = await eplant.get(`${ROUTES}/detailbydate?pyear=${(_.isUndefined(params[0]) ? '' : params[0])}&periodone=${parseDatetoString(dateSelected)}&periodtwo=${parseDatetoString(dateSelected2)}`)

    const { data } = response




    dispatch({ type: UPDATE_LISTDATADETAIL, payload: data })

    await PrepareFilteredDataGrid(params)

    if (callback) {
        callback(dateSelected)
    }

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

    }


    /*  finally {
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

            // console.log('ok')

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


