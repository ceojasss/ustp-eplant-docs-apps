import _ from 'lodash'
import { FETCH_LISTDATA, FETCH_LISTDATADETAIL, FETCH_COUNT, RESET_DETAIL_DATA } from '../../../../redux/actions/types'

const INIT_STATE = {
    data: [],
    datadetail: [],
    pageCount: null,
}

const FormReducers = (state = INIT_STATE, action) => {

    //console.log(state)
    switch (action.type) {
        case FETCH_LISTDATA:
            return { ...state, datadetail: [], data: action.payload }
        case FETCH_LISTDATADETAIL:
            return { ...state, datadetail: [...state.datadetail, ...action.payload] }
        case FETCH_COUNT:
            return { ...state, pageCount: action.payload }
        case RESET_DETAIL_DATA:
            return { ...state, datadetail: [] }

        default:
            return state;
    }

}

export default FormReducers