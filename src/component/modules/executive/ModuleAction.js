import eplant from '../../../apis/eplant'
import {
    EXCEPTION_ERROR, FETCH_DYNAMIC_FILTER, FETCH_LISTCONTENT, FETCH_LISTCONTENT_ALL,
    FETCH_NAV_FILTER, FETCH_NAV_FILTER_2, RELOAD_CONTENT, RESET_DETAIL_DATA,
    SET_LOADING_STATUS, UPDATE_LISTCONTENT, UPDATE_LISTCONTENT_FAILED, UPDATE_LISTDATA, UPDATE_NAV_SEARCH
} from '../../../redux/actions/types'
import _ from 'lodash'
import { parseDatetoString } from '../../../utils/FormComponentsHelpler'
import store from '../../../redux/reducers'

const ROUTES = '/executivesummary/content'
const CONTENTROUTES = '/executivesummary/singlecontent'

export const fetchDataheader = (loc, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    let daterequest = date instanceof Date ? date : new Date(date)

    dispatch({ type: SET_LOADING_STATUS, payload: true })

    const response = await eplant.get(`${ROUTES}/${loc}?p_date=${parseDatetoString(daterequest)}&p_site=`)

    dispatch({ type: SET_LOADING_STATUS, payload: false })
    dispatch({ type: FETCH_LISTCONTENT_ALL, payload: response.data })
}

export const fetchDashboard = (contentval, loc, code, date, site, search, filter, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    let p1 = '', daterequest, pfilter1 = '', searchdesc = '', pfilterDynamic = ''

    daterequest = date instanceof Date ? date : new Date(date)

    const filter1 = store.getState().auth.activeProps.filter1
    const val = store.getState().auth.filteronnav2?.rows


    if (contentval?.hasfilter === 'true' && _.isEmpty(filter))
        return;



    if (!_.isUndefined(contentval?.parent)) {

        if (contentval.parent instanceof Array) {
            _.map(contentval.parent, x => { p1 += `&${x.key}=${_.isEmpty(x.val) ? '' : x.val}` })
        }
        else {
            p1 += `&${contentval.parent.key}=${contentval.parent.val}`
        }


    }


    if (!_.isEmpty(filter1) && !_.isEmpty(val)) {
        const filterObject = filter1.split(';')
        try {
            searchdesc = Object.values(_.find(val, [filterObject[0], search]))[1]
            pfilter1 = `&${filterObject[0]}=${search}&${filterObject[0]}desc=${encodeURIComponent(searchdesc)}`

        }
        catch (e) {
            pfilter1 = `&${filterObject[0]}=${_.isNil(search) ? '' : search}&${filterObject[0]}desc=ALL Position`
        }
    }



    _.map(filter, f => {

        let fval = ''

        fval = _.isEmpty(f?.group?.value) ? '' : f?.group?.value

        pfilterDynamic += `&${f.group.code}=${fval}`
    })


    try {

        const response = await eplant.get(`${CONTENTROUTES}/${loc}?p_site=${site}&p_code=${code}&p_date=${parseDatetoString(daterequest)}${p1}${pfilter1}${pfilterDynamic}`)

        // // console.log('rsponse', response.data.data[0])

        dispatch({ type: UPDATE_LISTCONTENT, payload: response.data.data[0] })

    } catch (error) {

        dispatch({ type: UPDATE_LISTCONTENT_FAILED, payload: contentval })
    }

}

export const updateContent = (v) => async dispatch => {
    dispatch({ type: RELOAD_CONTENT })
}

export const setSelectedFilter = (val) => async dispatch => {

    let original = store.getState().auth.filtercontent

    let ret = [...original]

    _.map(ret, x => {
        if (x?.group?.code === val.code) {
            _.set(x.group, 'value', val.value)
            _.set(x.group, 'remarks', val.remarks)

        }
    })

    dispatch({ type: FETCH_DYNAMIC_FILTER, payload: ret })
}


export const fetchContentList = (loc, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    let daterequest = date instanceof Date ? date : new Date(date)

    dispatch({ type: SET_LOADING_STATUS, payload: true })

    const response = await eplant.get(`/executivesummary/content/contentlist?p_route=${loc}`)

    dispatch({ type: SET_LOADING_STATUS, payload: false })

    dispatch({ type: FETCH_DYNAMIC_FILTER, payload: null })

    dispatch({
        type: FETCH_LISTCONTENT, payload: {
            data: response.data?.data[0].content?.rows,
            component: response.data?.component
        }
    })

    if (callback)
        callback(loc)

}

export const fetchContentFilter = (loc, cb) => async dispatch => {

    //// console.log('filter check', loc)

    try {
        const response = await eplant.get(`/executivesummary/contentvalue/contentlist?p_route=${loc}/filter`)


        //        // console.log(response)

        if (_.size(response?.data) > 0) {


            //            // console.log(response?.data)

            dispatch({ type: FETCH_DYNAMIC_FILTER, payload: response.data })

        }


        if (cb)
            cb()

    } catch (error) {
        // console.log(error)
    }


}



export const fetchDynamicDetail = (loc, date, params, ch, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })
    let p1 = ''

    const { childroute, parent } = ch


    let daterequest

    if (date instanceof Date) {
        daterequest = date
    }
    else {
        daterequest = new Date(date)
    }

    const responsez = await eplant.get(`/executivesummary/content/contentlist?p_route=${childroute}`)

    let responses = responsez.data?.data[0].content?.rows



    const obj = {
        'parent': params,
        level: _.size(_.split(childroute, '/'))
    }
    const rsp = _.map(responses, r => _.assignIn(r, obj))

    dispatch({ type: UPDATE_LISTDATA, payload: rsp })

}


export const fetchfilter = (cb) => async dispatch => {
    try {

        const response = await eplant.get(`lov/site?0=`)

        let initialValue = ''

        dispatch({ type: FETCH_NAV_FILTER, payload: response.data })

        initialValue = response.data.rows[0].defaultvalue

        dispatch({ type: UPDATE_NAV_SEARCH, payload: initialValue })

        if (cb)
            cb()

    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}


export const fetchfilter2 = (filter, cb) => async dispatch => {
    try {

        const filterVal = filter.split(';')

        const searchs = store.getState().auth.tableDynamicControl.search2


        const defaultParam = !_.isUndefined(filterVal[2]) ? filterVal[2] : ''

        const response = await eplant.get(`lov/${filterVal[1]}?0=${defaultParam}`)


        if (!response)
            dispatch({ type: EXCEPTION_ERROR, payload: 'empty response' })

        dispatch({ type: FETCH_NAV_FILTER_2, payload: response.data })
        /*
                // console.log('update ', searchs)
        
                if (_.isEmpty(searchs)) {
                    const values = Object.values(response.data.rows[0])[0]
                    dispatch({ type: UPDATE_NAV_SEARCH2, payload: values })
        
                }
         */

        if (cb)
            cb()

    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}


export const fetchContent = (val, loc, code, date, callback) => async dispatch => {

    dispatch({ type: RESET_DETAIL_DATA })

    let p1 = ''

    let daterequest = date instanceof Date ? date : new Date(date)

    if (!_.isUndefined(val?.parent)) {

        p1 = ''
        _.map(val.parent, x => { p1 += `&${x.key}=${_.isEmpty(x.val) ? '' : x.val}` })

    }

    try {

        const response = await eplant.get(`${CONTENTROUTES}/${loc}?p_code=${code}&p_date=${parseDatetoString(daterequest)}${p1}`)

        console.log('response ', response.data.data[0])

        if (!_.isUndefined(response.data.data[0])) {
            dispatch({ type: UPDATE_LISTCONTENT, payload: response.data.data[0] })

        } else {

            dispatch({ type: UPDATE_LISTCONTENT, payload: val })
        }

    } catch (error) {

        console.log('response ', val)


        dispatch({ type: UPDATE_LISTCONTENT, payload: val })
    }

}