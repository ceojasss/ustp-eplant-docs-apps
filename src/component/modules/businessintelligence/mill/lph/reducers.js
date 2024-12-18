import _ from 'lodash'
import {FETCH_LISTMILL,RESET_BI_DATA} from '../../../../../redux/actions/types'

const INIT_STATE ={
    data:[]
}

const Reducers = (state = INIT_STATE,action) => {
    switch (action.type){
        case FETCH_LISTMILL :
            return { ...state, data:action.payload}
        case RESET_BI_DATA :
            return { ...state, data:[]};
        default:
            return state;
    }
}

export default Reducers