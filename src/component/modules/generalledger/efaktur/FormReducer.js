import { DELETE_DATA, FETCH_DATA, FETCH_DATAS, FETCH_DATADETAIL, SET_ACTIVE_DATA_ROW, SET_LOADING_STATUS, SET_DATA_LOADING, FETCH_LISTDATA, FETCH_LISTDATADETAIL, FETCH_COUNT, RESET_DETAIL_DATA } from '../../../../redux/actions/types'

const INIT_STATE = {
    data: [],
    datadetail: [],
    pageCount: null,
}

const FormReducer = (state = INIT_STATE, action) => {


    switch (action.type) {
        case FETCH_LISTDATA:
            return { ...state, datadetail: [], data: action.payload }
        case FETCH_LISTDATADETAIL:
            return { ...state, datadetail: [...state.datadetail, ...action.payload] }
        case FETCH_COUNT:
            return { ...state, pageCount: action.payload }
        case RESET_DETAIL_DATA:
            return { ...state, datadetail: [] };
        default:
            return state;
    }

}

export default FormReducer