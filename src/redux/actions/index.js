import _ from 'lodash'

import eplantApps from '../../apis/eplantApps'
import eplantSite from '../../apis/eplantSite'
import eplant from '../../apis/eplant'

import { Appresources } from '../../component/templates/ApplicationResources'
import { isAutoApprove } from '../../utils/DataHelper'
import { getFilterComponent, getFormTitle, getTitleDetail, parseFullDatetoString } from '../../utils/FormComponentsHelpler'
import store from '../reducers'

import {
    SIGN_IN, EXCEPTION_ERROR, AUTH_USER, FETCH_MENU, FETCH_USER, FETCH_SELECT,
    FAILED_SELECT, RESET_ERROR, MODAL_STATE, RESET_ERROR_MODAL_STATE, MODAL_ACTION_NEXT,
    SEND_MESSAGE, SAVE, ACTIVE_ROUTE, RESET_MODAL, RESET_LOV, FETCH_LOVS,
    OPEN_LOV, VALUE_SELECTED, FAILED_LOV, FETCH_DASHBOARD, UPDATE, DELETE, POST_DATA, MODAL_BUTTON_LOADING, OPEN_LOVDATA,
    START_SEARCH, DATA_TO_EDIT, FETCH_TEMP_DATA,
    SET_VALIDATION_SCHEMA, SET_DEFAULT_VALUE, SUBMIT_DATA, RESET_TRX, NAV_AFTER_INSERT, ERROR_MODAL_STATE,
    RESET_TRX_ID, NAV_AFTER_UPDATE, RESET_DELETE_LIST, GRID_EDIT_RESET, RESET_SELECT, SET_GRID_STATUS, RESEARCH_LOVDATA, RESEARCH_LOVDATA_FAIL, RESEARCH_LOVDATA_OK, DETAIL_LOVDATA, DETAIL_LOVDATA_FAIL, DETAIL_LOVDATA_OK, SET_UPDATED_LINK_DATA, FETCH_USER_AUTH_SITE, FETCH_USER_AUTH_SITE_FAIL, DATA_LINK_SUBMITED, UPDATE_NAV_PERIOD, FETCH_URLPREVIEW_DATA, REACT_SELECT_OPEN, INCREMENT_TRX_ID, AUTH_SITE, SIGN_OUT, RESET_TRANSACTION_ERROR, ACTIVE_GRID_COLUMN, FETCH_URLPREVIEW_DATA_ARRAY, RESET_URL_PREVIEW_ARRAY, CHANGE_MODAL_ITEM_STATE, DETAIL_LOVDATA_APPEND, UPDATE_NAV_PERIOD_NOW, WEBCAM_COMPONENT, RESET_WEBCAM_COMPONENT, SPREADSHEET, DATAREPORT
} from "./types"

export const signIn = (userId) => {
    return {
        type: SIGN_IN,
        payload: userId
    }
}

export const resetError = () => {
    return {
        type: RESET_ERROR
    }
}





export const setModalStates = (content, extras) => {
    return {
        type: MODAL_STATE,
        payload: {
            state: !store.getState().auth.modals.state,
            content: '',
            contentType: 'DIALOG',
            actionpick: content,
            selectedValue: extras
        }
    }
}

export const openListCompany = () => {

    return {
        type: MODAL_STATE,
        payload: {
            state: !store.getState().auth.modals.state,
            content: 'Switch Company',
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_COMPANY
        }
    }

}

export const setModalTrxStates = content => {
    return {
        type: MODAL_STATE,
        payload: {
            state: !store.getState().auth.modals.state,
            content: content.value,
            contentType: 'DIALOG',
            actionpick: content.action
        }
    }
}

export const resetModalStates = () => {
    return {
        type: RESET_MODAL
    }

}

export const activegridcols = (v) => async dispatch => {
    //// // console.log(v)

    await dispatch({
        type: ACTIVE_GRID_COLUMN,
        payload: v
    })

}

export const DialogLoading = (callback) => async dispatch => {

    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: 'Processing Data',
            message: '',
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_LOADING,
            selectedValue: ''
        }
    }
    )

    if (callback) callback()
}



export const DialogWait = () => async dispatch => {

    await dispatch({
        type: CHANGE_MODAL_ITEM_STATE,
        payload: { content: 'Saving Data', contentType: Appresources.TRANSACTION_ALERT.SAVE_PROCESS, state: true, message: null }
    }
    )



}


export const setupSpreadsheet = (doc, callback) => async dispatch => {

    //    const doc = { ..._obj, parameters: param }


    //    doc.url

    const response = await eplant.get(`${doc.url}/${doc.registryid}?${doc.parameters}`)


    console.log(response.data)



    dispatch({ type: SPREADSHEET, payload: { ...doc, ...response.data } })

    if (callback)
        callback()
}

export const fetchreportdata = (doc, callback) => async dispatch => {


    const response = await eplant.get(`${doc.url}/${doc.route}${doc.parameters}`)


    dispatch({ type: DATAREPORT, payload: { ...doc, ...response.data } })

    if (callback)
        callback()
}



export const DialogConfirmation = (content, message, datas, state) => async dispatch => {

    let action = null, value = null, dataclean = [],
        subInserts = [], subUpdates = [],
        inserts = [], updates = [], deletes = [], header


    const st = store.getState()

    if (st.auth.modals.isloading)
        return;



    if (state)
        value = state.original



    let master = _.omit(datas, 'inputgrid')

    //let masters = { ...master.ROWIDS }



    const deleteList = store.getState().auth.deletelist

    // // console.log('state', state)



    if (_.isEmpty(datas) && _.size(deleteList) === 0) {
        return;
    }


    // ? Check if this data is master and detail, and get master data values
    if (!_.isEmpty(master)) {

        if (!_.isUndefined(master.rowid)) {

            dataclean = _.pick(master, _.remove(Object.keys(master), (n, v) => {

                return n !== 'rowid' && state[n] === true
            }))
        } else {
            dataclean = _.mapValues(master, (v, x) => {

                //// // // console.log(v, x)

                if (_.isObject(v) && _.isDate(v))
                    return (parseFullDatetoString(v))

                return v

            })
        }


        if (!_.isEmpty(dataclean)) {

            // * 3.1 check if data is object, then get first value of object
            _.mapValues(dataclean, (o, key) => {
                //                // // // console.log('masuk sini x', o, key, _.values(o), Object.values(o))
                if (_.isObject(o) && !_.isDate(o)) {
                    //  // // // console.log('masuk sini 1', Object.values(o))
                    _.set(dataclean, key, Object.values(o)[0])
                } else if (_.isObject(o) && _.isDate(o)) {
                    // // // // console.log('masuk sini ', Object.values(o))
                    _.set(dataclean, key, parseFullDatetoString(o))
                }

            });

        }

        header = Object.assign({}, _.isUndefined(master.rowid) ? { ...dataclean } : { ROWIDS: master.rowid, ...dataclean })

    }

    // // console.log('rowid', datas, state.inputgrid)

    // * get all fieldstatus
    _.map(state.inputgrid, (value, key) => {
        let newdata = 0

        // // console.log('1', value)

        // * cek item field status changed 
        _.mapValues(value, (v) => {
            // // // // console.log('x', v instanceof Object ? Object.values(v)[0] : v)

            if (v instanceof Object ? Object.values(v)[0] : v === true) {
                newdata++
            }
        })

        // * if object not changed then skipped 
        if (newdata === 0)
            return;

        const rwid = _.get(datas, `inputgrid[${key}]`)



        if (!_.isUndefined(rwid)) {
            if (!_.isEmpty(_.get(datas, `inputgrid[${key}]`)['rowid'])) {

                // // console.log('update', value);
                // * step --
                // ?  1.  cek field status --> if true replace with values 
                // ?  2.  cek if rowid present --> if true then set to update else insert 

                updates.push(_.omitBy(_.assignIn(
                    _.mapValues(value, (v, k) => {
                        return ((_.isObject(v) ? Object.values(v)[0] : v === true) && !_.isArray(v))
                            && (!_.isDate(_.get(datas, `inputgrid[${key}].${k}`)) ? _.get(datas, `inputgrid[${key}].${k}`) : parseFullDatetoString(_.get(datas, `inputgrid[${key}].${k}`)))
                    }), { rowids: _.get(datas, `inputgrid[${key}].rowid`) })
                    , _.isBoolean))
            } else {

                //                // // // console.log('insert ', value);


                inserts.push(_.omitBy(_.mapValues(value, (v, k) => {
                    // // // console.log(Object.values(v)[0])

                    //                    // console.log(v, _.isArray(v))

                    return ((_.isObject(v) ? Object.values(v)[0] : v === true) && !_.isArray(v))
                        && (!_.isDate(_.get(datas, `inputgrid[${key}].${k}`)) ? _.get(datas, `inputgrid[${key}].${k}`) : parseFullDatetoString(_.get(datas, `inputgrid[${key}].${k}`)))
                }), _.isBoolean)
                )

            }
        }

    })

    const detailsed = _.filter(_.flatMap(datas?.inputgrid, (x, y) => x?.inputgriddetail), f => !_.isNil(f))

    if (_.size(detailsed) > 0) {

        const detailObj = _.flatMap(state.inputgrid, (x, y) => {
            return { [y]: x?.inputgriddetail }
        })

        // console.log(detailObj)

        _.map(detailObj, (subdetail, keys) => {

            if (_.isEmpty(Object.values(subdetail)[0]))
                return;

            _.map(subdetail, (value, key) => {
                // * cek item field status changed 

                _.mapValues(value, (val, k) => {

                    let subVal = _.mapValues(_.pickBy(val, (x, y) => x === true), (obj, kobj) => {
                        return datas.inputgrid[keys].inputgriddetail[k][kobj]
                    })

                    let rowids = datas.inputgrid[keys].inputgriddetail[k]['rowid']
                    let tids = datas.inputgrid[keys].inputgriddetail[k]['tid']

                    if (!_.isEmpty(subVal)) {

                        if (!_.isEmpty(rowids)) {
                            _.assign(subVal, { rowids: rowids, tid: tids })
                            subUpdates.push(subVal);

                        } else {
                            subInserts.push(subVal);
                        }
                    }
                })
            }
            )
        })
    }

    deletes = deleteList

    // // console.log(deletes)
    if (content === SAVE) {
        action = isAutoApprove() ? Appresources.TRANSACTION_ALERT.SAVE_APPROVED_CONFIRMATION : Appresources.TRANSACTION_ALERT.SAVE_CONFIRMATION
    } else if (content === UPDATE) {
        action = Appresources.TRANSACTION_ALERT.UPDATE_CONFIRMATION
    } else if (content === DELETE) {
        action = Appresources.TRANSACTION_ALERT.DELETE_CONFIRMATION
    }

    /* 
        action = (content === SAVE ? Appresources.TRANSACTION_ALERT.SAVE_CONFIRMATION : content === UPDATE
            ? Appresources.TRANSACTION_ALERT.UPDATE_CONFIRMATION : content === DELETE
                ? Appresources.TRANSACTION_ALERT.DELETE_CONFIRMATION : null)
     */


    /* // // console.log('checkKeys', _.some(_.mapKeys(header, (x, y) => {
       return y
   }), (v)=>  ))  */



    //    // // console.log('checkKeys', _.has(header, _.includes('displayonly')))

    console.log(header, inserts, updates, deletes)

    await dispatch(setPostData({ header, inserts, updates, deletes, subInserts, subUpdates }))

    await dispatch({ type: SUBMIT_DATA, payload: datas })

    // // console.log('action ', _.findKey(header, (o, y) => { return !_.includes(y, 'displayonly') }),
    //_.isEmpty(_.findKey(header, (o, y) => { return !_.includes(y, 'displayonly') })))



    if (_.isEmpty(_.findKey(header, (o, y) => { return !_.includes(y, 'displayonly') }))
        && _.size(inserts) === 0
        && _.size(updates) === 0
        && _.size(deletes) === 0)
        return;


    // // console.log(header, inserts, updates, deletes, subInserts, subUpdates)

    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: action,
            message: message,
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_CONFIRM,
            selectedValue: value
        }
    }
    )
}

export const ConfirmationApproved = (content, message, value) => async dispatch => {


    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: content,
            message: message,
            contentType: Appresources.TRANSACTION_ALERT.CUSTOM_CONFIRMATION,
            selectedValue: value
        }
    }
    )
}


export const ConfirmationNotes = (content, message, value) => async dispatch => {


    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: content,
            message: message,
            contentType: Appresources.TRANSACTION_ALERT.CONFIRMATION_NOTES,
            selectedValue: value
        }
    }
    )
}

export const ConfirmationApprovedWithReject = (content, message, value) => async dispatch => {


    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: content,
            message: message,
            contentType: Appresources.TRANSACTION_ALERT.CONFIRMATION_OR_REJECT,
            selectedValue: value
        }
    }
    )
}


export const ConfirmationApprovedWithDate = (content, message, value) => async dispatch => {


    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: content,
            message: message,
            contentType: Appresources.TRANSACTION_ALERT.DATE_CONFIRMATION,
            selectedValue: value
        }
    }
    )
}



export const DialogConfirmationOnly = (content, message) => async dispatch => {

    let action, value

    action = (content === SAVE ? Appresources.TRANSACTION_ALERT.SAVE_CONFIRMATION : content === UPDATE ? Appresources.TRANSACTION_ALERT.UPDATE_CONFIRMATION : content === DELETE ? Appresources.TRANSACTION_ALERT.DELETE_CONFIRMATION : null)


    // // console.log(value, action)

    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: action,
            message: message,
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_CONFIRM,
            selectedValue: value
        }
    }
    )
}

export const DialogCrudConfirmation = (content, message, extras, extras2) => async dispatch => {

    let action, value

    if (extras)
        value = extras.original

    action = (content === SAVE ? Appresources.TRANSACTION_ALERT.SAVE_CONFIRMATION : content === UPDATE ? Appresources.TRANSACTION_ALERT.UPDATE_CONFIRMATION : content === DELETE ? Appresources.TRANSACTION_ALERT.DELETE_CONFIRMATION : null)


    dispatch(setPostData(extras))

    dispatch({ type: SUBMIT_DATA, payload: extras2 })

    dispatch({
        type: MODAL_STATE,
        payload: {
            state: !store.getState().auth.modals.state,
            content: action,
            message: message,
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_CONFIRM,
            selectedValue: value
        }
    }
    )
}

export const DialogDataSelection = (content, message, extras) => async dispatch => {

    let action

    action = ''//(content === SAVE ? Appresources.TRANSACTION_ALERT.SAVE_CONFIRMATION : content === UPDATE ? Appresources.TRANSACTION_ALERT.UPDATE_CONFIRMATION : content === DELETE ? Appresources.TRANSACTION_ALERT.DELETE_CONFIRMATION : null)


    dispatch(setPostData(extras))

    dispatch({
        type: MODAL_STATE,
        payload: {
            state: !store.getState().auth.modals.state,
            content: action,
            message: '',
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_CONFIRM,
            selectedValue: content
        }
    }
    )
}

export const deliverMessage = states => {

    return {
        type: SEND_MESSAGE,
        payload: states
    }

}

export const setLoadingModalBtn = (content, extras, extras2) => {
    //// // // console.log(store.getState().auth.modals.state)

    //    // // // console.log(a, b)
    //  // // // console.log(content)

    return {
        type: MODAL_BUTTON_LOADING,
        payload: {
            isloading: !store.getState().auth.modals.isloading,
            actionpick: content,
            values: extras,
            additional_message: extras2
        }
    }
}

export const setActionModals = (content, extras) => {
    //// // // console.log(store.getState().auth.modals.state)

    //// // // console.log(extras)

    return {
        type: MODAL_ACTION_NEXT,
        payload: {
            actionpick: content,
            content: extras
        }
    }
}


export const activeRoutes = (val, cb) => async dispatch => {

    // // // // console.log('set active routes', val);



    await dispatch({
        type: ACTIVE_ROUTE,
        payload: val
    })

    if (cb)
        cb()

}

export const setPostData = (data) => {
    //// // // console.log(store.getState().auth.modals.state)

    // // // console.log(data)
    return {
        type: POST_DATA,
        payload: {
            data
        }
    }
}


export const resetErrorTransaction = () => async dispatch => {
    //// // // console.log(store.getState().auth.modals.state)



    await dispatch({
        type: RESET_ERROR_MODAL_STATE,
        payload: {
            state: false,
            type: '',
            content: '',
            contentType: '',
            actionpick: '',
            result: ''
        }
    })

    await dispatch({ type: RESET_TRANSACTION_ERROR })

}

export const setEditData = (data) => async dispatch => {



    await dispatch({ type: DATA_TO_EDIT, payload: data })

}

export const setEditDataCB = (data, callback) => async dispatch => {




    await dispatch({ type: DATA_TO_EDIT, payload: data })

    if (callback) callback()

}

export const signout = () => async dispatch => {

    //
    //  // // // console.log('sign out ' + localStorage.getItem('token'))

    await localStorage.removeItem('token')

    // // // // console.log('sign out aft ' + localStorage.getItem('token'))

    //    dispatch({ type: AUTH_USER, payload: '' })

    dispatch({ type: SIGN_OUT })

}

export const uservalid = (formpost, cb) => async dispatch => {
    // // // console.log(formpost)

    let returnvalues = ''
    try {

        const response = await eplantApps.post('/uservalid', formpost)


        if (response === 'unauthorized')
            dispatch({ type: EXCEPTION_ERROR, payload: 'user or password wrong' })




        // // // console.log(response)

        returnvalues = response.data


    }
    catch (error) {
        //   // // // console.log(error)

    }

    if (cb) cb(returnvalues)

}

export const loadSite = (formpost, cb) => async dispatch => {
    //// // // console.log(formpost)

    let returnvalues = ''
    try {

        const response = await eplantApps.get(`/authsite?loginid=${formpost}`)



        if (response === 'unauthorized')
            dispatch({ type: EXCEPTION_ERROR, payload: 'user or password wrong' })



        dispatch({ type: AUTH_SITE, payload: response.data.rows })


        //   // // // console.log(response)

        returnvalues = response.data.rows


    }
    catch (error) {
        //   // // // console.log(error)

    }

    if (cb) cb(returnvalues)

}

export const signin = (formpost, callback) => async dispatch => {
    let returnvalues = ''
    try {



        const response = await eplantApps.post('/signin', formpost)


        if (response === 'unauthorized')
            dispatch({ type: EXCEPTION_ERROR, payload: 'user or password wrong' })


        await localStorage.setItem('token', response.data.token)


        returnvalues = response.data.token

        // // // console.log(response.data)
        //        dispatch({typpe: UPDATE_NAV, payload: response.data. })
        dispatch({ type: AUTH_USER, payload: response.data.token })



    }
    catch (error) {
        //   // // // console.log(error)

        returnvalues = 'user or password wrong'
        dispatch({ type: EXCEPTION_ERROR, payload: returnvalues })

    }

    finally {

        if (callback) callback(returnvalues)
    }
}

export const signKey = (formpost, callback) => async dispatch => {
    let returnvalues = ''
    try {

        //  console.log(formpost)

        const response = await eplantApps.post('/signkey', formpost)


        if (response === 'unauthorized')
            dispatch({ type: EXCEPTION_ERROR, payload: 'user or password wrong' })


        await localStorage.setItem('token', response.data.token)


        returnvalues = response.data.token

        dispatch({ type: AUTH_USER, payload: response.data.token })

    }
    catch (error) {
        returnvalues = 'user or password wrong'
        dispatch({ type: EXCEPTION_ERROR, payload: returnvalues })

    }

    finally {

        if (callback) callback(returnvalues)
    }
}


export const switchCompany = (req, callback) => async dispatch => {
    let returnvalues = ''


    try {

        // await signout();

        const response = await eplantSite.post('/swap', { ...req.company })
        // // console.log(response.data)

        if (response.data.status === 'success') {
            // // console.log(response)

            await localStorage.setItem('token', response.data.token)
            returnvalues = 'success'

            dispatch({ type: AUTH_USER, payload: response.data.token })

        }
    }
    catch (error) {
        //   // // // console.log(error)

        returnvalues = 'user or password wrong'
        dispatch({ type: EXCEPTION_ERROR, payload: returnvalues })

    }

    finally {
        if (callback) callback(returnvalues)
    }
}

export const fetchSites = ({ loginid, site }) => async dispatch => {

    try {

        const response = await eplantSite.get(`/lov/othersite?0=${loginid}&1=${site}`)

        //  // // // console.log('lovresponse', response)


        if (!response.data) {
            dispatch({
                type: FETCH_USER_AUTH_SITE_FAIL,
                payload: {
                    errorMessage: 'error'
                }
            })
        }
        else {
            dispatch({
                type: FETCH_USER_AUTH_SITE,
                payload: {
                    user_site_auth: response.data.rows
                }
            })
        }
    }
    catch (e) {

    }
}


export const fetchUserInfo = () => async dispatch => {

    const response = await eplantSite.get('/user')

    // // // console.log(response)

    dispatch({ type: FETCH_USER, payload: response.data })
}

export const fetchsite = () => async dispatch => {

    try {


        const response = await eplantSite.get('/site')

        dispatch({ type: AUTH_USER, payload: response.data.token })

        //localStorage.setItem('token', response.data.token)
        //if (callback) callback();
    }
    catch (error) {
        dispatch({ type: EXCEPTION_ERROR, payload: 'user or password wrong' })

    }
}

export const fetchMenu = () => async dispatch => {


    try {

        const response = await eplantSite.get('/menu')

        const date = new Date()

        dispatch({ type: UPDATE_NAV_PERIOD, payload: Date.parse(response.data.user.currentdate) })
        dispatch({ type: UPDATE_NAV_PERIOD_NOW, payload: date.setDate(date.getDate() - 1) })

        // console.log('fetch menu', st.auth.activeRoute)


        dispatch({ type: FETCH_MENU, payload: response.data })



    } catch (error) {

        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}

export const fetchDasboard = () => async dispatch => {


    const response = await eplantSite.get('/dashboard')

    dispatch({ type: FETCH_DASHBOARD, payload: response.data })


}

export const fetchLov = (object, search) => async dispatch => {

    const response = await eplantSite.get(`/lov/${object}?0=${search}`)

    dispatch({ type: FETCH_TEMP_DATA, payload: response.data })
}
export const fetchLovUrlPreview = (doctype, process_flag, doccode) => async dispatch => {

    const response = await eplantSite.get(`/lov/urlpreview?1=${doctype}&2=${process_flag}&3=${doccode}`)

    dispatch({ type: FETCH_URLPREVIEW_DATA, payload: response.data.rows })
}
export const fetchLovUrlPreviewArray = (doctype, process_flag, doccode) => async dispatch => {
    dispatch({ type: RESET_URL_PREVIEW_ARRAY })
    const response = await eplantSite.get(`/lov/urlpreview?1=${doctype}&2=${process_flag}&3=${doccode}`)

    dispatch({ type: FETCH_URLPREVIEW_DATA_ARRAY, payload: response.data.rows[0] })
}


export const getLovData = (object, search) => async dispatch => {

    const response = await eplantSite.get(`/lov/${object}?0=${search}`)

    dispatch({ type: FETCH_TEMP_DATA, payload: response.data })

}

export const ShowLov = (object, caller, search) => async dispatch => {


    dispatch({
        type: OPEN_LOVDATA,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `Cari Data ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV,
            object: caller,
            isloading: true
        }
    });

    try {
        const response = await eplantSite.get(`/lov/${object}?1=${search}`)


        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV,
                    object: caller,
                    isloading: false
                }
            })
        }
    }
    catch (e) {

    }
}


export const ShowLovQuery = (stmt, caller, title) => async dispatch => {


    dispatch({
        type: OPEN_LOV,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `Cari Data ${title}`,
            contentType: Appresources.TRANSACTION_ALERT.LOADING_STATUS,
            object: caller,
            isloading: true
        }
    });

    try {


        const response = await eplantSite.get(`/lov/report/custom?q=${stmt}`)


        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${title}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${title}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV,
                    object: caller,
                    isloading: false
                }
            })
        }
    }
    catch (e) {

    }
}


export const TIDincrement = (cb) => dispatch => {
    // // // console.log('before  ', store.getState().auth.trxid)

    try {
        dispatch({ type: INCREMENT_TRX_ID })

        // // // console.log('after ', store.getState().auth.trxid)

        if (cb) cb(store.getState().auth.trxid)
    } catch (error) {
        // // // console.log(error)
    }



    // if (cb) cb()
    //await dispatch({ type: REACT_SELECT_OPEN, payload: pld })
}

export const ReactSelectStatus = (pld, cb) => async dispatch => {

    try {
        dispatch({ type: REACT_SELECT_OPEN, payload: pld })

    } catch (error) {
        // // // console.log(error)
    }



    if (cb) cb()
    //await dispatch({ type: REACT_SELECT_OPEN, payload: pld })
}

export const ShowLovQR = (/*object, caller, search, dependencies*/callback) => async dispatch => {



    dispatch({
        type: OPEN_LOV,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `Cari Data `,
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_COMPONENT_QR,
            object: 'caller',
            isloading: true
        }
    });

    if (callback) callback()
}

export const ShowLovDeps = (object, caller, search, dependencies) => async dispatch => {


    dispatch({
        type: OPEN_LOV,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `Cari Data ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOADING_STATUS,
            object: caller,
            isloading: true
        }
    });

    try {


        const response = await eplantSite.get(`/lov/${object}?0=${search}${dependencies}`)


        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV,
                    object: caller,
                    isloading: false
                }
            })
        }
    }
    catch (e) {

    }
}

export const GridStatus = () => async dispatch => {
    dispatch({ type: SET_GRID_STATUS, payload: 'disabled' })
}

export const ShowLovs = (object, caller, search) => async dispatch => {


    dispatch({
        type: OPEN_LOV,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `Cari Data ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOADING_STATUS,
            object: caller,
            isloading: true
        }
    });


    try {

        const response = await eplantSite.get(`/ lov / ${object} ? find = ${search}`)

        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `Cari Data ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV,
                    object: caller,
                    isloading: false
                }
            })
        }
    }
    catch (e) {

    }
}

export const ShowData = (object, caller = {}, search = '') => async dispatch => {


    dispatch({
        type: OPEN_LOVDATA,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `Daftar ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV_ACTION,//Appresources.TRANSACTION_ALERT.LOADING_STATUS,
            object: caller,
            isloading: true
        }
    });

    try {

        const response = await eplantSite.get(`/lov/${object}?0=${search}`)




        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `Daftar ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `Daftar ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV_ACTION,
                    object: caller,
                    isloading: false
                }
            })
        }
    }
    catch (e) {

    }
}
export const ShowComponent = (object, caller = {}, search = '') => async dispatch => {


    dispatch({
        type: OPEN_LOVDATA,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            // content: `Daftar ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV_ACTION_COMPONENT,//Appresources.TRANSACTION_ALERT.LOADING_STATUS,
            object: caller,
            isloading: true
        }
    });

    // try {

    //     const response = await eplantSite.get(`/lov/${object}?0=${search}`)




    //     if (!response.data) {
    //         dispatch({
    //             type: FAILED_SELECT,
    //             payload: {
    //                 lovdata: [],
    //                 state: store.getState().auth.modals.state,
    //                 content: `Daftar ${object}`,
    //                 contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
    //                 object: caller,
    //                 isloading: false
    //             }
    //         })
    //     }
    //     else {
    dispatch({
        type: FETCH_LOVS,
        payload: {
            lovdata: '',
            state: store.getState().auth.modals.state,
            // content: `Daftar ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV_ACTION_COMPONENT,
            object: caller,
            isloading: false
        }
    })
    //     }
    // }
    // catch (e) {

    // }
}


export const InputDetailOnModals = (item, object, urls, caller = {}, search = '') => async dispatch => {

    //console.log(item)

    dispatch({
        type: FETCH_LOVS,
        payload: {
            lovdata: { item },
            state: !store.getState().auth.modals.state,
            content: `${getTitleDetail()}`,// ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.INPUT_ON_DIALOG,
            object: caller,
            isloading: false,
            url: urls
        }
    })


}



export const ShowDataLinked = (object, urls, caller = {}, search = '') => async dispatch => {

    dispatch({
        type: OPEN_LOVDATA,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `List ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV_LINKED_DATA,
            object: caller,
            isloading: true,
            url: urls
        }
    });

    try {

        const response = await eplantSite.get(urls)




        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false,
                    url: urls
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV_LINKED_DATA,
                    object: caller,
                    isloading: false,
                    url: urls
                }
            })
        }
    }
    catch (e) {

    }
}


export const ShowDataLinkedHeader = (object, urls, key, caller = {}, search = '') => async dispatch => {

    dispatch({
        type: OPEN_LOVDATA,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `List ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV_LINKED_DATA,
            object: caller,
            isloading: true,
            url: urls
        }
    });

    try {

        const response = await eplantSite.get(urls)




        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false,
                    url: urls
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV_LINKED_DATA_HEADER,
                    object: caller,
                    isloading: false,
                    url: urls,
                    selectedRows: [],
                    keyColumn: key,
                }
            })
        }
    }
    catch (e) {

    }
}


export const ViewData = (object, urls, params, caller = {}, search = '') => async dispatch => {

    dispatch({
        type: OPEN_LOVDATA,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `List ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV_VIEW_DATA,
            object: caller,
            isloading: true,
            url: urls,
            params: params
        }
    });

    try {

        const response = await eplantSite.get(urls)




        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false,
                    url: urls
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV_VIEW_DATA,
                    object: caller,
                    isloading: false,
                    url: urls
                }
            })
        }
    }
    catch (e) {

    }
}

export const ViewDataBasic = (object, urls, params, caller = {}, search = '') => async dispatch => {

    dispatch({
        type: OPEN_LOVDATA,
        payload: {
            lovdata: [],
            state: !store.getState().auth.modals.state,
            content: `List ${object}`,
            contentType: Appresources.TRANSACTION_ALERT.LOV_VIEW_DATA_BASIC,
            object: caller,
            isloading: true,
            url: urls,
            params: params
        }
    });

    try {

        const response = await eplantSite.get(urls)




        if (!response.data) {
            dispatch({
                type: FAILED_SELECT,
                payload: {
                    lovdata: [],
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOADING_FAILED,
                    object: caller,
                    isloading: false,
                    url: urls
                }
            })
        }
        else {
            dispatch({
                type: FETCH_LOVS,
                payload: {
                    lovdata: response.data,
                    state: store.getState().auth.modals.state,
                    content: `List ${object}`,
                    contentType: Appresources.TRANSACTION_ALERT.LOV_VIEW_DATA_BASIC,
                    object: caller,
                    isloading: false,
                    url: urls
                }
            })
        }
    }
    catch (e) {

    }
}

export const ShowReport = (content, datas, count) => async dispatch => {
    // datas
    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: `List Report ${content}`,
            result: datas,
            count: count,
            // message: message,
            contentType: Appresources.TRANSACTION_ALERT.LOV_REPORT_DATA,
            // selectedValue: value
        }
    })
}

export const SearchDataLinked = (search = '', callback) => async dispatch => {

    const { url } = store.getState().auth.modals

    dispatch({
        type: RESEARCH_LOVDATA,
        payload: {
            contentLoading: true,
            detaildata: []
        }
    });

    try {

        const response = await eplantSite.get(`${url}&search=${search}`)

        if (!response.data) {
            dispatch({
                type: RESEARCH_LOVDATA_FAIL,
                payload: {
                    contentLoading: false,
                    lovdata: []
                }
            })
        }
        else {
            dispatch({
                type: RESEARCH_LOVDATA_OK,
                payload: {
                    contentLoading: false,
                    lovdata: response.data
                }
            })

            if (callback) callback()
        }


    }
    catch (e) {

    }


}


export const updateLinkData = (obj) => async dispatch => {

    dispatch({
        type: SET_UPDATED_LINK_DATA,
        payload: {
            detailupdated: obj
        }
    });

}


export const DataLinkedDetail = (search = '') => async dispatch => {

    const { url } = store.getState().auth.modals

    dispatch({
        type: DETAIL_LOVDATA,
        payload: {
            detailLoading: true
        }
    });



    const urls = url.substring(0, url.indexOf('?'));
    const urlparams = url.substring(url.indexOf('?'));
    //// // // console.log(urlparams)



    try {

        const response = await eplantSite.get(`${urls}/detail${urlparams}&code=${encodeURIComponent(search)}`)

        if (!response.data) {
            dispatch({
                type: DETAIL_LOVDATA_FAIL,
                payload: {
                    detailLoading: false,
                    detaildata: []
                }
            })
        }
        else {
            dispatch({
                type: DETAIL_LOVDATA_OK,
                payload: {
                    detailLoading: false,
                    detaildata: response.data
                }
            })
        }
    }
    catch (e) {

    }
}

export const DataViewDetail = (search = '') => async dispatch => {

    const { url, detaildata } = store.getState().auth.modals

    dispatch({
        type: DETAIL_LOVDATA,
        payload: {
            detailLoading: true
        }
    });




    const urls = url.substring(0, url.indexOf('?'));
    const urlparams = url.substring(url.indexOf('?'));
    //// // // console.log(urlparams)

    try {

        const response = await eplantSite.get(`${urls}/detail${urlparams}&code=${encodeURIComponent(search)}`)





        if (!response.data) {
            dispatch({
                type: DETAIL_LOVDATA_FAIL,
                payload: {
                    detailLoading: false,
                    detaildata: []
                }
            })
        }
        else {

            let datax = []

            //          datax.push(...response.data)

            //            _.map(detaildata, v => datax.push(v))

            datax = _.isNil(detaildata) ? response.data : _.concat(detaildata, response.data)

            // console.log(detaildata, datax)

            dispatch({
                type: DETAIL_LOVDATA_APPEND,
                payload: {
                    detaildata: datax
                }
            })
        }
    }
    catch (e) {

    }
}

export const DataViewDetailAll = (arrCode, search = '') => async dispatch => {

    const { url, detaildata } = store.getState().auth.modals

    dispatch({
        type: DETAIL_LOVDATA,
        payload: {
            detailLoading: true
        }
    });

    const urls = url.substring(0, url.indexOf('?'));
    const urlparams = url.substring(url.indexOf('?'));


    //    // console.log('check array', arrCode, detaildata)


    try {

        let ok//, fail

        await Promise.all(
            _.map(
                arrCode, async (x) => {

                    if (!_.isEmpty(x)) {
                        const response = await eplantSite.get(`${urls}/detail${urlparams}&code=${encodeURIComponent(x)}`)
                        return response.data
                    }
                }
            )
        ).then(x => {
            //  // console.log(x)
            ok = _.flatten(x)
        }).catch(e => {
            //   fail = e
        })


        if (_.isEmpty(ok)) {
            dispatch({
                type: DETAIL_LOVDATA_FAIL,
                payload: {
                    detailLoading: false,
                    detaildata: []
                }
            })
        } else {
            dispatch({
                type: DETAIL_LOVDATA_APPEND,
                payload: {
                    detaildata: _.isNil(detaildata) ? ok : _.concat(ok, detaildata)
                }
            })
        }


    }
    catch (e) {

    }
}

export const populateList = (object, caller, search, params) => async dispatch => {
    try {
        let param = !_.isEmpty(params) ? `&1=${params}` : ''

        const response = await eplantSite.get(`/lov/${object}?0=${search}${param}`)

        if (!response.data) {
            dispatch({
                type: FAILED_LOV,
                payload: []
            })
        }
        else {
            dispatch({
                type: FETCH_SELECT,
                payload: [
                    caller,
                    response.data.rows
                ]
            })
        }
    }
    catch (e) {
        // // // console.log('populate list', e)
    }
}

export const fetchUploadWebcam = (params, imageSrc, callback) => async dispatch => {
    // dispatch({type:RESET_WEBCAM_COMPONENT})
    const response = await eplant.post(`/webcam/upload?filename=${params.content[1]}&path=${encodeURIComponent(params.content[0])}`, { image: imageSrc })

    dispatch({ type: WEBCAM_COMPONENT, payload: { name: params.content[2], data: response.data.path } })

    if (callback) callback()
}

export const resetLov = () => {

    store.dispatch({ type: SET_DEFAULT_VALUE, payload: {} })
    store.dispatch({ type: RESET_SELECT })
    store.dispatch({ type: SET_VALIDATION_SCHEMA, payload: {} })
    store.dispatch({ type: DATA_TO_EDIT, payload: {} })
    store.dispatch({ type: SUBMIT_DATA, payload: {} })
    store.dispatch({ type: RESET_TRX_ID })
    store.dispatch({ type: RESET_TRX, payload: false })
    store.dispatch({ type: RESET_DELETE_LIST })
    store.dispatch({ type: GRID_EDIT_RESET })
    store.dispatch({ type: REACT_SELECT_OPEN, payload: false })


    return {
        type: RESET_LOV
    }

}

export const LovSelected = value => {
    const obj = store.getState().auth.modals.object

    return {
        type: VALUE_SELECTED,
        payload: {
            selectedValue: {
                object: obj,
                value: value,
                isselected: false
            },
            modals: {
                lovdata: [],
                state: false,
                content: null,
                contentType: null,
                object: null
            }
        }
    }
}




export const saveTransaction = (route, formpost, callback) => async dispatch => {

    try {

        //        const response = await eplantSite.post(route, formpost)

        dispatch({
            type: MODAL_STATE,
            payload: {
                state: false,
                type: '',
                content: '',
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
            }
        })

    }
    catch (error) {
        //   // // // console.log(error)
        dispatch({ type: EXCEPTION_ERROR, payload: 'user or password wrong' })

    } finally {
        if (callback) callback()
    }

}


export const startSearch = (object, search, callback) => async dispatch => {

    try {

        dispatch({ type: START_SEARCH, query: search });

        const { data } = await eplantSite.get(`/ lov / ${object} ? find = ${search}`)

        const { rows } = data

        if (callback) callback(rows)
    }
    catch (e) {

    }
}



export const resetTransaction = value => async dispatch => {
    // // console.log('reset transaksi', value)

    await dispatch({ type: GRID_EDIT_RESET })
    await dispatch({ type: RESET_DELETE_LIST })
    await dispatch({
        type: RESET_TRX,
        payload: value
    })

    if (!value) {
        dispatch({ type: POST_DATA, payload: null })
    }


}


export const insertResponseForms = (response) => async dispatch => {
    let documentTitle_ = ''

    // // // console.log(response)

    const rowid = response.data.outBinds[0].rids[0]


    const updatedata = _.assignIn(store.getState().auth.submitdata, { rowid: rowid })


    if (!_.isUndefined(response.data.autonumberdocument)) {
        documentTitle_ = getFormTitle('Document No : ') + response.data.autonumberdocument
    } else {
        documentTitle_ = store.getState().auth.documentTitle
    }

    // // console.log('1')

    dispatch({
        type: NAV_AFTER_INSERT,
        payload: {
            actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
            actionstatus: isAutoApprove() ? false : true,
            submitdata: updatedata,
            resetTrx: true,
            documentTitle: documentTitle_,
            modal: {
                state: false,
                type: '',
                content: response,
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
            }
        }
    })

}

export const updateResponseForms = (response) => async dispatch => {
    let documentTitle_ = ''


    const updatedata = { ...store.getState().auth.submitdata }//_.assignIn(store.getState().auth.submitdata, { rowid: rowid })

    // // console.log('12')

    dispatch({
        type: NAV_AFTER_UPDATE,
        payload: {
            actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
            submitdata: updatedata,
            resetTrx: true,
            documentTitle: documentTitle_,
            modal: {
                state: false,
                type: '',
                content: response,
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
            }
        }
    })



}


export const insertResponse = (response) => async dispatch => {

    const autonumberkey = _.findKey(store.getState().auth.submitdata, (v) => {
        return v === 'autonumber';
    })

    const rowid = response.data.returnvalues[0].header.outBinds[0].rids[0]
    let documentTitle_ = ''

    _.assignIn(store.getState().auth.submitdata, { rowid: rowid })

    if (!_.isUndefined(autonumberkey)) {
        _.set(store.getState().auth.submitdata, autonumberkey, response.data.autonumberdocument)
        _.set(store.getState().auth.formDefaultValue, autonumberkey, response.data.autonumberdocument)
        _.map(store.getState().auth.submitdata.inputgrid, (o) => _.set(o, autonumberkey, response.data.autonumberdocument))
        documentTitle_ = getFormTitle('Document No : ') + response.data.autonumberdocument

    }
    if (_.isUndefined(response.data.returnvalues[1])) {

    }
    else if (!_.isEmpty(response.data.returnvalues[1].insert)) {
        const returndata = response.data.returnvalues[1].insert.outBinds
        const submitedObject = { ...store.getState().auth.submitdata.inputgrid }

        const retObj = []
        _.map(returndata, ({ rids, tids }) => {
            retObj.push({ rowid: rids[0], tid: tids[0] })
        })

        const v = _(_.values(submitedObject))
            .concat(retObj)
            .groupBy("tid")
            .map(_.spread(_.merge))
            .value();


        _.replace(store.getState().auth.submitdata.inputgrid, v)
    }

    // // // console.log(isAutoApprove())

    dispatch({
        type: NAV_AFTER_INSERT,
        payload: {
            actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
            actionstatus: isAutoApprove() ? false : true,
            submitdata: store.getState().auth.submitdata,
            resetTrx: true,
            documentTitle: documentTitle_,
            modal: {
                state: false,
                type: '',
                content: response,
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
            }
        }
    })

}

export const insertRespWithSub = (response) => async dispatch => {

    const st = store.getState().auth

    //// console.log(st.submitdata)


    const autonumberkey = _.findKey(st.submitdata, (v) => {
        return v === 'autonumber';
    })

    const rowid = response.data.returnvalues[0].header.outBinds[0].rids[0]
    let documentTitle_ = ''


    _.assignIn(st.submitdata, { rowid: rowid })

    if (!_.isUndefined(autonumberkey)) {
        _.set(st.submitdata, autonumberkey, response.data.autonumberdocument)
        _.set(st.formDefaultValue, autonumberkey, response.data.autonumberdocument)
        _.map(st.submitdata.inputgrid, (o) => _.set(o, autonumberkey, response.data.autonumberdocument))
        documentTitle_ = getFormTitle('Document No : ') + response.data.autonumberdocument

    }

    if (!_.isEmpty(response.data.returnvalues[1].insert)) {
        const returndata = response.data.returnvalues[1].insert.outBinds
        const submitedObject = { ...st.submitdata.inputgrid }

        const retObj = []
        _.map(returndata, ({ rids, tids }) => {
            retObj.push({ rowid: rids[0], tid: tids[0] })
        })

        const v = _(_.values(submitedObject))
            .concat(retObj)
            .groupBy("tid")
            .map(_.spread(_.merge))
            .value();


        _.replace(st.submitdata.inputgrid, v)
    }


    if (!_.isNil(response.data.returnvalues[2]?.subinsert)) {
        const returndatas = response.data.returnvalues[2].subinsert?.outBinds
        let _obj = st.submitdata
        let retObjs = []


        _.map(returndatas, ({ rids, tids }) => {
            retObjs.push({ rowid: rids[0], tid: tids[0] })
        })


        let _check = _.flatMap(
            _.filter(_obj.inputgrid, x => x.inputgriddetail),
            z => z.inputgriddetail)



        _(_.values(_check))
            .concat(retObjs)
            .groupBy("tid")
            .map(_.spread(_.merge))
            .value();

        // console.log(_obj)
    }

    dispatch({
        type: NAV_AFTER_INSERT,
        payload: {
            actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
            actionstatus: isAutoApprove() ? false : true,
            submitdata: st.submitdata,
            resetTrx: true,
            documentTitle: documentTitle_,
            modal: {
                state: false,
                type: '',
                content: response,
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
            }
        }
    })

}



export const updateResponse = (response) => async dispatch => {

    if (!_.isEmpty(response.data[0].insert)) {
        const returndata = response.data[0].insert.outBinds
        const submitedObject = { ...store.getState().auth.submitdata.inputgrid }

        const retObj = []
        _.map(returndata, ({ rids, tids }) => {
            retObj.push({ rowid: rids[0], tid: tids[0] })
        })

        const v = _(_.values(submitedObject))
            .concat(retObj)
            .groupBy("tid")
            .map(_.spread(_.merge))
            .value();


        _.replace(store.getState().auth.submitdata.inputgrid, v)
    }

    //  // // console.log('13')

    dispatch({
        type: NAV_AFTER_UPDATE,
        payload: {
            actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
            submitdata: store.getState().auth.submitdata,
            resetTrx: true,
            modal: {
                state: false,
                type: '',
                content: response,
                contentType: '',
                actionpick: '',
                result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
            }
        }
    })

}

export const errorResponse = (values) => async dispatch => {

    // // console.log(values)

    dispatch({

        type: ERROR_MODAL_STATE,
        payload: {
            state: false,
            type: '',
            content: values,
            contentType: '',
            actionpick: '',
            result: Appresources.TRANSACTION_ALERT.SAVE_FAILED
        }
    })


}


export const insertResponseGrid = (response) => async dispatch => {

    if (!_.isEmpty(response.data.returnvalues[0].insert)) {
        const returndata = response.data.returnvalues[0].insert.outBinds
        const submitedObject = { ...store.getState().auth.submitdata.inputgrid }

        const retObj = []
        _.map(returndata, ({ rids, tids }) => {
            retObj.push({ rowid: rids[0], tid: tids[0] })
        })

        const v = _(_.values(submitedObject))
            .concat(retObj)
            .groupBy("tid")
            .map(_.spread(_.merge))
            .value();

        _.replace(store.getState().auth.submitdata.inputgrid, v)
    }

    const filtercom = getFilterComponent()
    // // // console.log(_.isEmpty(filtercom))

    const documentTitle_ = getFormTitle('Document No : ') + response.data.autonumberdocument


    if (_.isEmpty(filtercom)) {
        dispatch({
            type: NAV_AFTER_INSERT,
            payload: {
                actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
                actionstatus: isAutoApprove() ? false : true,
                submitdata: store.getState().auth.submitdata,
                resetTrx: true,
                gridedit: { id: 0, status: false },
                documentTitle: documentTitle_,
                modal: {
                    state: false,
                    type: '',
                    content: response,
                    contentType: '',
                    actionpick: '',
                    result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
                }
            }
        })
    } else {
        dispatch({
            type: NAV_AFTER_INSERT,
            payload: {
                actionlabel: Appresources.BUTTON_LABEL.LABEL_UPDATE,
                actionstatus: isAutoApprove() ? false : true,
                submitdata: store.getState().auth.submitdata,
                resetTrx: false,
                gridedit: { id: 0, status: false },
                documentTitle: documentTitle_,
                modal: {
                    state: false,
                    type: '',
                    content: response,
                    contentType: '',
                    actionpick: '',
                    result: Appresources.TRANSACTION_ALERT.SAVE_SUCCESS
                }
            }
        })
    }


}

export const submitlinkdata = (obj, withCopy = true) => async dispatch => {
    await dispatch(resetModalStates())

    dispatch({
        type: DATA_LINK_SUBMITED,
        payload: {
            datalinkedsubmited: obj,
            datalinkedsubmitedCopy: (withCopy && obj)
        }
    })

}

export const resetsubmitlinkdata = () => async dispatch => {
    await dispatch(resetModalStates())

    dispatch({
        type: DATA_LINK_SUBMITED,
        payload: {
            datalinkedsubmited: {}
        }
    })

}

export const updateSubmitlinkdata = (obj) => async dispatch => {

    dispatch({
        type: DATA_LINK_SUBMITED,
        payload: { datalinkedsubmited: obj }
    })

}


export const getDetailToGenerate = (source, doc, cb) => async dispatch => {
    // // // console.log(formpost)

    let returnvalues = ''
    try {

        const response = await eplantSite.get(`/lov/${source}?0=&1=${doc}`)


        returnvalues = response.data


    }
    catch (error) {
        //   // // // console.log(error)

    }

    if (cb) cb(returnvalues)

}

export const ScanQRCODE = (callback) => async dispatch => {

    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: 'Scan QR CODE',
            message: '',
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_SCAN_QR,
            selectedValue: ''
        }
    }
    )

    if (callback) callback()


}
export const WebcamPhoto = (data, callback) => async dispatch => {
    // console.log(data)
    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: data,
            message: '',
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_WEBCAM,
            selectedValue: ''
        }
    }
    )

    if (callback) callback(data)


}


export const fetchFromOutside = (v, callback) => async dispatch => {

    /* await axios.get(v).then(
        (response) => {
            // console.log(response)
        }

    ) */

    let body = { url: v }

    const response = await eplant.post('/costbook/trx/efaktur', body)

    // console.log(response)

    /* 
    await dispatch({
        type: MODAL_STATE,
        payload: {
            state: true,
            content: 'Scan QR CODE',
            message: '',
            contentType: Appresources.TRANSACTION_ALERT.DIALOG_SCAN_QR,
            selectedValue: ''
        }
    }
    )
 */
    if (callback) callback(response)


}