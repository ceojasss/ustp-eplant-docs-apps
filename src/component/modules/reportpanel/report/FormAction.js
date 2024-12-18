import _ from 'lodash'
import eplant from '../../../../apis/eplant'
import { ERROR_MODAL_STATE, EXCEPTION_ERROR, FETCH_DATADETAIL, FETCH_DATAS, FETCH_LISTDATADETAIL, MODAL_STATE, SET_DATA_LOADING } from '../../../../redux/actions/types'



export const fetchDatas = (route) => async dispatch => {
    try {
        const response = await eplant.get(`report/${route}`)

        //        // console.log('done fetch stock')

        dispatch({ type: FETCH_DATAS, payload: response.data.data })


    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}


export const fetchDataDetails = (route, rows) => async dispatch => {



    try {

        //  // console.log(rows)


        if (_.isUndefined(rows))
            return;

        dispatch({ type: SET_DATA_LOADING, payload: true })

        const response = await eplant.get(`report/${route}/${rows}`)
        dispatch({ type: FETCH_DATADETAIL, payload: response.data })


    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}


