import {
    EXCEPTION_ERROR, AUTH_ERROR, AUTH_USER, OPEN_LOV, FETCH_SITE, RESET_ERROR_MODAL_STATE, MODAL_BUTTON_LOADING,
    FETCH_USER, FETCH_MENU, POST_DATA, RESET_MODAL, RESET_ERROR, MODAL_STATE, FAILED_LOV, FETCH_LOVS, ACTIVE_ROUTE,
    RESET_LOV, VALUE_SELECTED, UPDATE_NAV, FETCH_SELECT, MODAL_ON_LOADING, ERROR_MODAL_STATE, UPDATE_NAV_SEARCH,
    UPDATE_NAV_PERIOD, RESET_MODAL_ONLY, OPEN_LOVDATA, MODAL_CONTENT_CHANGES, MODAL_ACTION_NEXT, CLEAN_QUERY, START_SEARCH, DOCUMENT_TITLE,
    FINISH_SEARCH, UPDATE_SELECTION, DATA_TO_EDIT, FETCH_TEMP_DATA, SET_TRANSACTION_STATUS, SET_TRANSACTION_INFO, SET_LOADING_STATUS, SET_VALIDATION_SCHEMA, SET_DEFAULT_VALUE, SUBMIT_DATA,
    ACTION_LABEL, RESET_TRX, NAV_AFTER_INSERT, DECREMENT_TRX_ID, INCREMENT_TRX_ID, RESET_TRX_ID, SET_TRX_ID, NAV_AFTER_UPDATE, RESET_NAV, DELETE_LIST, RESET_DELETE_LIST,
    MODAL_TRX_CLOSE, MODAL_TRX_OPEN, GRID_EDIT_TRUE, GRID_EDIT_FALSE, SINGLE_LOAD_TRUE, SINGLE_LOAD_FALSE, GRID_EDIT_RESET, RESET_SELECT, GRID_MAXIMIZE, GRID_MINIMIZE, ADD_NUMBER_COUNT, SET_GRID_STATUS,
    SET_ACTIVE_ROW, RESEARCH_LOVDATA, RESEARCH_LOVDATA_FAIL, RESEARCH_LOVDATA_OK, MODAL_SEARCH_VALUE, DETAIL_LOVDATA, DETAIL_LOVDATA_FAIL, DETAIL_LOVDATA_OK, SET_UPDATED_LINK_DATA, FETCH_USER_AUTH_SITE,
    DATA_LINK_SUBMITED, UPDATE_DATA_LINK_SUBMITED, FETCH_URLPREVIEW_DATA, REACT_SELECT_OPEN, RESET_URL_PREVIEW, AUTH_SITE, POST_RESET, VISIBLE_SIDE, SIGN_OUT, RESET_TRANSACTION_ERROR, ACTIVE_GRID_COLUMN, RESET_URL_PREVIEW_ARRAY, FETCH_URLPREVIEW_DATA_ARRAY, GENERATE_DATA, RESET_ACTIVE_ROW, HIDDEN_LIST, RESET_HIDDEN_LIST, CHANGE_MODAL_ITEM_STATE, SET_SELECTED_ROW, DETAIL_LOVDATA_APPEND, GENERATE_SUBDETAIL, SET_ACCORDION, UPDATE_NAV_PERIOD_NOW, FETCH_NAV_FILTER, SET_LOADING_MESSAGE, ACTIVE_PROPS, QR_COMPONENT, RESET_QR_COMPONENT, FETCH_NAV_FILTER_2, UPDATE_NAV_SEARCH2, WEBCAM_COMPONENT, RESET_WEBCAM_COMPONENT, FETCH_DYNAMIC_FILTER, FORCED_RENDER, FORCED_RENDER_GRID, SELECT_DYNAMIC_FILTER, SPREADSHEET, DATAREPORT
} from "../actions/types"
import { dashboard } from '../reducers/dashboard'
import { businessintelligence } from '../reducers/bi'
import { modals } from './modals'


export const INIT_STATE = {
    authenticated: localStorage.getItem('token'),
    errorMessage: '',
    menu: [],
    modals: {
        state: false,
        type: '',
        content: '',
        contentType: '',
        actionpick: '',
        result: '',
        isloading: false,
        message: '',
        contentLoading: false,
        url: '',
        searchValue: '',
        detailLoading: false,
        activeRow: null,
        selectedRows: [],
        count: ''
    },
    activeRoute: '',
    activeProps: null,
    selectedValue: [],
    tableDynamicControl: {
        page: 0,
        size: 10,
        search: '',
        search2: '',
        dateperiodenow: '',
        // dateperiode: date.setFullYear('2022', '10','23')
        // dateperiode: date.setFullYear('2022', '11')
        dateperiode: ''
        // dateperiode: date.setDate(1)
        // dateperiode: date.setFullYear('2022', '9', '01')
        // dateperiode: ''
        // dateperiode:new Date()
    },
    populateselect: [],
    transactionInfo: [],
    postdata: null,
    submitdata: null,
    searchSelect: {
        loading: false,
        results: [],
        value: ""
    },
    transactionStatus: null,
    loadingstatus: false,
    formValidationSchema: null,
    formDefaultValue: {},
    documentTitle: null,
    actionstatus: true,
    actionlabel: null,
    resetTrx: false,
    trxid: 1,
    deletelist: [],
    hiddenlist: [],
    modalstrx: false,
    gridedit: { id: 0, status: false },
    singleload: false,
    gridwindowmax: false,
    fieldAddNumber: 1,
    gridsStatus: [],
    urlpreview: [],
    urlpreviewarray: [],
    reactselectopen: false,
    authorizedsite: [],
    sidevisible: true,
    generate_execute: false,
    generate_exec_detail: false,
    accordionOpen: true,
    qrcomponent: null,
    webcamValue: []
}

export const auth = (state = INIT_STATE, action) => {

    switch (action.type) {

        case AUTH_USER:
            return {
                // ...state,
                authenticated: action.payload,
                errorMessage: '',
                menu: [],
                activeRoute: '',
                modals: state.modals,
                tableDynamicControl: state.tableDynamicControl,
                gridedit: state.gridedit,
                gridwindowmax: state.gridwindowmax,
                deletelist: state.deletelist,
                hiddenlist: state.hiddenlist,
                fieldAddNumber: state.fieldAddNumber,
                populateselect: state.populateselect,
                sidevisible: state.sidevisible,
                trxid: state.trxid,
                generate_execute: false,
                actionstatus: true,
                qrcomponent: '',
                webcamValue: state.webcamValue
                // hiddenlist:state.hiddenlist
                /*      errorMessage: '',
                     menu: [],
                     activeRoute: '',
                     modals: state.modals,
                     tableDynamicControl: state.tableDynamicControl,
                     gridedit: INIT_STATE.gridedit,
                     gridwindowmax: INIT_STATE.gridwindowmax,
                     deletelist: INIT_STATE.deletelist,
                     fieldAddNumber: INIT_STATE.fieldAddNumber,
                     populateselect: state.populateselect,
                     sidevisible:INIT_STATE.sidevisible */
            }
        case SIGN_OUT:
            return {
                ...state,
                authenticated: null
            }
        case AUTH_SITE:
            return {
                ...state,
                authorizedsite: action.payload
            }
        case RESET_ERROR:
            return {
                ...state,
                errorMessage: ''
            }
        case AUTH_ERROR:
            return {
                ...state,
                errorMessage: action.payload
            }
        case ACTIVE_ROUTE:


            return {
                ...state,
                activeRoute: action.payload
            }
        case ACTIVE_PROPS:
            return {
                ...state,
                activeProps: action.payload
            }
        case EXCEPTION_ERROR:
            return {
                ...state,
                errorMessage: action.payload
            }

        case FETCH_SITE:
            return {
                ...state,
                errorMessage: '',
                site: action.payload
            }
        case FETCH_USER:
            return {
                ...state,
                errorMessage: '',
                user: action.payload
            }
        case FETCH_MENU:
            return {
                ...state,
                errorMessage: '',
                menu: action.payload
            }
        case MODAL_STATE:
        case ERROR_MODAL_STATE:
        case OPEN_LOVDATA:
        case RESET_ERROR_MODAL_STATE:
        case RESET_MODAL:
        case OPEN_LOV:
        case FETCH_LOVS:
        case RESEARCH_LOVDATA:
        case RESEARCH_LOVDATA_FAIL:
        case RESEARCH_LOVDATA_OK:
        case DETAIL_LOVDATA:
        case DETAIL_LOVDATA_FAIL:
        case DETAIL_LOVDATA_OK:
        case DETAIL_LOVDATA_APPEND:
        case MODAL_SEARCH_VALUE:
        case FAILED_LOV:
            return modals(state, action)
        case CHANGE_MODAL_ITEM_STATE:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    ...action.payload
                }
            }
        case VISIBLE_SIDE:
            return {
                ...state,
                sidevisible: action.payload
            }
        case QR_COMPONENT:
            return {
                ...state,
                qrcomponent: action.payload
            }
        case WEBCAM_COMPONENT:
            return {
                ...state,
                webcamValue: [...state.webcamValue, action.payload]
            }
        case RESET_QR_COMPONENT:
            return {
                ...state,
                qrcomponent: null
            }
        case RESET_WEBCAM_COMPONENT:
            return {
                ...state,
                webcamValue: null
            }
        case VALUE_SELECTED:
            return {
                ...state,
                selectedValue: action.payload.selectedValue,
                modals: action.payload.modals
            }
        case FETCH_SELECT:
            return {
                ...state,
                populateselect: [...state.populateselect, action.payload],
            }
        case RESET_SELECT:
            return {
                ...state,
                populateselect: [],
            }
        case RESET_URL_PREVIEW:
            return {
                ...state,
                urlpreview: [],
            }
        case RESET_URL_PREVIEW_ARRAY:
            return {
                ...state,
                urlpreviewarray: [],
            }
        case RESET_TRANSACTION_ERROR:
            return {
                ...state,
                transactionError: null,
            }
        case RESET_LOV:
            return {
                ...state,
                selectedValue: [],
                populateselect: [],
                transactionError: null,
                transactionStatus: null
            }
        case RESET_NAV:
            return {
                ...state,
                tableDynamicControl: {
                    page: INIT_STATE.tableDynamicControl.page,
                    size: INIT_STATE.tableDynamicControl.size,
                    search: INIT_STATE.tableDynamicControl.search,
                    dateperiode: state.tableDynamicControl.dateperiode,
                    dateperiodenow: state.tableDynamicControl.dateperiodenow
                },
                filtercontent: null
            }
        case UPDATE_NAV:
            return {
                ...state,
                tableDynamicControl: action.payload
            }
        case FETCH_URLPREVIEW_DATA:
            return {
                ...state,
                urlpreview: action.payload
            }
        case FETCH_URLPREVIEW_DATA_ARRAY:
            return {
                ...state,
                urlpreviewarray: [...state.urlpreviewarray, action.payload]
            }
        case UPDATE_NAV_SEARCH:
            return {
                ...state,
                tableDynamicControl: { ...state.tableDynamicControl, search: action.payload }
            }
        case UPDATE_NAV_SEARCH2:
            return {
                ...state,
                tableDynamicControl: { ...state.tableDynamicControl, search2: action.payload }
            }
        case UPDATE_NAV_PERIOD:
            return {
                ...state,
                tableDynamicControl: { ...state.tableDynamicControl, dateperiode: action.payload }
            }
        case UPDATE_NAV_PERIOD_NOW:
            return {
                ...state,
                tableDynamicControl: { ...state.tableDynamicControl, dateperiodenow: action.payload }
            }
        case POST_RESET: return {
            ...state,
            postdata: []
        }
        case POST_DATA:
            return {
                ...state,
                postdata: action.payload
            }
        case SUBMIT_DATA:
            return {
                ...state,
                submitdata: action.payload
            }
        case MODAL_BUTTON_LOADING:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    state: action.payload.modalstate,
                    isloading: action.payload.isloading,
                    actionpick: action.payload.actionpick,
                    result: action.payload.values,
                    additional_message: action.payload.additional_message
                }
            }
        case MODAL_ON_LOADING:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    isloading: true
                }
            }
        case MODAL_ACTION_NEXT:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    state: false,
                    actionpick: action.payload.actionpick,
                    selectedValue: action.payload.content
                },
                transactionInfo: action.payload.content
            }
        case RESET_MODAL_ONLY:
            return {
                ...state,
                errorMessage: '',
                modals: INIT_STATE.modals
            }
        case MODAL_CONTENT_CHANGES:
            return {
                ...state,
                selectedValue: action.payload.content
            }
        case CLEAN_QUERY:
            return { ...state, searchSelect: INIT_STATE.searchSelect }
        case START_SEARCH:
            return { ...state, searchSelect: { ...state.searchSelect, loading: true, value: action.query } }
        case FINISH_SEARCH:
            return { ...state, searchSelect: { ...state.searchSelect, loading: false, results: action.results } }
        case UPDATE_SELECTION:
            return { ...state, searchSelect: { ...state.searchSelect, value: action.selection } }
        case DATA_TO_EDIT:
            return { ...state, datatoedit: action.payload }
        case FETCH_TEMP_DATA:
            return { ...state, temporarydata: action.payload }
        case SET_TRANSACTION_STATUS:
            return { ...state, transactionStatus: action.payload }
        case SET_TRANSACTION_INFO:
            return {
                ...state,
                transactionInfo: action.payload
            }
        case SET_LOADING_STATUS:
            return {
                ...state,
                loadingstatus: action.payload
            }
        case SET_LOADING_MESSAGE:
            return {
                ...state, loadingstatus: true, loadingmessage: action.payload
            }
        case SET_VALIDATION_SCHEMA:
            return { ...state, formValidationSchema: action.payload }
        case SET_DEFAULT_VALUE:
            return { ...state, formDefaultValue: action.payload }
        case DOCUMENT_TITLE:
            return { ...state, documentTitle: action.payload }
        case ACTION_LABEL:
            return { ...state, actionlabel: action.payload }
        case RESET_TRX:
            return { ...state, resetTrx: action.payload }
        case NAV_AFTER_INSERT:
            return {
                ...state,
                deletelist: [],
                // hiddenlist: [],
                //  postdata: [],
                submitdata: action.payload.submitdata,
                actionlabel: action.payload.actionlabel,
                actionstatus: action.payload.actionstatus,
                transactionError: '',
                errorMessage: '',
                modals: action.payload.modal,
                selectedValue: [],
                resetTrx: action.payload.resetTrx,
                documentTitle: action.payload.documentTitle
            }
        case NAV_AFTER_UPDATE:
            return {
                ...state,
                submitdata: action.payload.submitdata,
                actionlabel: action.payload.actionlabel,
                transactionError: '',
                errorMessage: '',
                modals: action.payload.modal,
                selectedValue: [],
                resetTrx: action.payload.resetTrx
            }
        case SET_TRX_ID:
            return {
                ...state,
                trxid: action.payload
            }
        case INCREMENT_TRX_ID:
            return {
                ...state,
                trxid: state.trxid + 1,
                selectedValue: [],
            }
        case DECREMENT_TRX_ID:
            return {
                ...state,
                trxid: state.trxid - 1,
                selectedValue: [],
            }
        case RESET_TRX_ID:
            return {
                ...state,
                trxid: 1
            }
        case DELETE_LIST:
            return {
                ...state,
                deletelist: [...state.deletelist, action.payload],
                selectedValue: [],
            }

        case RESET_DELETE_LIST:
            return {
                ...state,
                deletelist: INIT_STATE.deletelist
            }
        case HIDDEN_LIST:
            return {
                ...state,
                hiddenlist: [...state.hiddenlist, action.payload]
            }
        case RESET_HIDDEN_LIST:
            return {
                ...state,
                hiddenlist: []
            }
        case MODAL_TRX_OPEN:
            return {
                ...state,
                modalstrx: true
            }
        case MODAL_TRX_CLOSE:
            return {
                ...state,
                modalstrx: INIT_STATE.modalstrx
            }
        case GRID_EDIT_TRUE:
            return {
                ...state,
                gridedit: { id: action.payload, status: true }
            }
        case GRID_EDIT_FALSE:
            return {
                ...state,
                gridedit: { id: action.payload, status: false }
            }
        case GRID_EDIT_RESET:
            return {
                ...state,
                gridedit: INIT_STATE.gridedit
            }
        case SINGLE_LOAD_TRUE:
            return {
                ...state,
                singleload: true
            }
        case SINGLE_LOAD_FALSE:
            return {
                ...state,
                singleload: INIT_STATE.singleload
            }
        case GRID_MAXIMIZE:
            return {
                ...state,
                gridwindowmax: true
            }
        case GRID_MINIMIZE:
            return {
                ...state,
                gridwindowmax: false
            }
        case ADD_NUMBER_COUNT:
            return {
                ...state,
                fieldAddNumber: action.payload

            }
        case SET_GRID_STATUS:
            return {
                ...state,
                gridsStatus: action.payload
            }
        case SET_ACTIVE_ROW:
            return {
                ...state,
                modals: { ...state.modals, ...action.payload }
            }
        case SET_SELECTED_ROW:
            return {
                ...state,
                modals: { ...state.modals, ...action.payload }
            }
        case RESET_ACTIVE_ROW:
            return {
                ...state,
                modals: { ...state.modals, activeRow: INIT_STATE.modals.activeRow }
            }
        case SET_UPDATED_LINK_DATA:
            return {
                ...state,
                modals: { ...state.modals, ...action.payload }
            }
        case FETCH_USER_AUTH_SITE:
            return {
                ...state,
                ...action.payload
            }
        case DATA_LINK_SUBMITED:
            return {
                ...state,
                ...action.payload
            }
        case UPDATE_DATA_LINK_SUBMITED:
            return {
                ...state,
                ...action.payload
            }
        case REACT_SELECT_OPEN:
            return {
                ...state,
                reactselectopen: action.payload
            }
        case ACTIVE_GRID_COLUMN:
            return {
                ...state,
                activegridcolumn: action.payload
            }
        case GENERATE_DATA:
            return {
                ...state,
                generate_execute: action.payload
            }
        case FORCED_RENDER_GRID:
            return {
                ...state,
                render_grid: action.payload
            }
        case GENERATE_SUBDETAIL:
            return {
                ...state,
                generate_exec_detail: action.payload
            }
        case SET_ACCORDION:
            return {
                ...state,
                accordionOpen: action.payload
            }
        case FETCH_NAV_FILTER:
            return {
                ...state,
                filteronnav: action.payload
            }
        case FETCH_NAV_FILTER_2:
            return {
                ...state,
                filteronnav2: action.payload
            }
        case FETCH_DYNAMIC_FILTER:
            return {
                ...state,
                filtercontent: action.payload
            }

        case SELECT_DYNAMIC_FILTER:
            return {
                ...state,
                filterselected: action.payload
            }
        case SPREADSHEET:
            return {
                ...state,
                spreadsheet: action.payload
            }
        case DATAREPORT:
            return {
                ...state,
                datareport: action.payload
            }

        default:

            return state
    }

}



export const staticReducers = {
    auth,
    dashboard,
    businessintelligence
}