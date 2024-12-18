import _ from 'lodash'
import eplant from '../../../../apis/eplant'
import { EXCEPTION_ERROR, FETCH_DATADETAIL, FETCH_DATAS, FETCH_NAV_FILTER, SET_DATA_LOADING } from '../../../../redux/actions/types'



export const fetchDatas = (route) => async dispatch => {
    try {

        const response = await eplant.get(`executivesummary/managementreport/reportlist?route=${route}`)


        console.log('done fetch stock', response.data)

        dispatch({ type: FETCH_DATAS, payload: response.data })


    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}

export const fetchfilter = (route) => async dispatch => {
    try {

        const response = await eplant.get(`lov/estate?0=KBN`)


        console.log('done fetch stock', response.data)

        dispatch({ type: FETCH_NAV_FILTER, payload: response.data })


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

        const response = await eplant.get(`executivesummary/managementreport/reportlist`)

        dispatch({ type: FETCH_DATADETAIL, payload: response.data })


    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}


