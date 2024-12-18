import { DELETE_DATA, FETCH_DATA, FETCH_DATAS, FETCH_DATADETAIL, SET_ACTIVE_DATA_ROW, SET_LOADING_STATUS, SET_DATA_LOADING, UPDATE_FETCH_DATA, ON_PROCESS, FETCH_ERROR } from '../../../../redux/actions/types'

const INIT_STATE = {
    data: [],
    datadetail: [],
    lovs: [],
    dataActiveRow: {},
    dataview: [],
    loading: false,
    process: false
}

const FormReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case ON_PROCESS:
            return {
                ...state,
                process: action.payload,
                closingerror: null
            }
        case FETCH_ERROR:
            return {
                ...state,
                closingerror: action.payload
            }

        case FETCH_DATAS:
            return {
                ...state,
                dataprocess: action.payload.data,
                dataview: action.payload.data,
                data: action.payload,
                lovs: []
            }
        case UPDATE_FETCH_DATA:
            return {
                ...state,
                dataview: action.payload,
                lovs: []
            }
        /*return { ...state, banks: { ..._.mapKeys(action.payload, 'bankcode') } }*/
        case FETCH_DATA:
            return {
                ...state,
                datadetail: action.payload,
                lovs: []
            }
        case FETCH_DATADETAIL:
            return {
                ...state,
                datadetail: action.payload,
                loading: false,
                lovs: []
            }
        case SET_ACTIVE_DATA_ROW:
            return {
                ...state,
                dataActiveRow: action.payload
            }
        case SET_DATA_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case DELETE_DATA:
            //const id = action.payload.id

            //  // console.log('data', action.payload)

            return {
                ...state,
                data: {
                    ...state.data,
                    data: (state.data.data && state.data.data.filter((x) => x.rowid !== action.payload.rowid))
                }
            }
        default:
            return state;
    }

}

export default FormReducer