import _ from 'lodash'
import { FETCH_PVS, FETCH_PVSDTL, FETCH_SEARCH, FETCH_COUNT, FETCH_PAGEINDEX, FETCH_PAGESIZE } from '../../../../redux/actions/types'

const INIT_STATE = {
    paymentvoucher: [],
    paymentvoucherdetail: [],
    datapayment: [],
    queryPageIndex: 0,
    queryPageSize: 10,
    pageCount: null,
    // search: ''
}

const paymentvoucherReducers = (state = INIT_STATE, action) => {

    // // console.log(state)
    switch (action.type) {
        case FETCH_PVS:
            return { ...state, paymentvoucher: action.payload, datapayment: action.payload }
        case FETCH_PVSDTL:
            return { ...state, paymentvoucherdetail: action.payload }
        case FETCH_COUNT:
            return { ...state, pageCount: action.payload }
        case FETCH_PAGEINDEX:
            return { ...state, queryPageIndex:/*  state.queryPageIndex + */ action.payload }
        case FETCH_PAGESIZE:
            return { ...state, queryPageSize: action.payload }
        // case FETCH_SEARCH:
        //     return { ...state, queryPageSize: action.payload }
        default:
            return state;
    }

}

export default paymentvoucherReducers