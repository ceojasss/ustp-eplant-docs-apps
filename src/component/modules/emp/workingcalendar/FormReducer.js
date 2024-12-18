import _ from 'lodash'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, DELETE_DATA, FETCH_COUNT, RESET_DETAIL_DATA, SET_VALIDATION_SCHEMA, FILTER_LIST, DATE_FILTER, UPDATE_LISTDATADETAIL } from '../../../../redux/actions/types'
import { ActionHelpers } from '../../../../utils/FormComponentsHelpler'

const INIT_STATE = {
    data: [],
    datadetail: [],
    pageCount: null,
    detailfilter: [],
    datefilterone: null,
    datefiltertwo: null,
    datelimit: null
}

const FormReducers = (state = INIT_STATE, action) => {

    switch (action.type) {
        case FETCH_LISTDATA:
            return { ...state, datadetail: [], data: action.payload }
        case UPDATE_LISTDATADETAIL:
            return { ...state, datadetail: action.payload }
        case FETCH_LISTDATADETAIL:
            return { ...state, datadetail: [...state.datadetail, ...action.payload] }
        case FETCH_COUNT:
            return { ...state, pageCount: action.payload }
        case RESET_DETAIL_DATA:
            return { ...state, datadetail: [] }
        case FILTER_LIST:
            return { ...state, pageCount: action.payload }
        case DELETE_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    data: (state.data.data && state.data.data.filter((x) => x.rowid !== action.payload.rowid))
                }
            }
        case DATE_FILTER: {
            // console.log('action ', action.payload)
            return {
                ...state,
                ...action.payload
            }
        }
        default:
            return state;
    }

}

export default FormReducers

