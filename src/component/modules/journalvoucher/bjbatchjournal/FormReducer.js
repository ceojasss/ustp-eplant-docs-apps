import { DELETE_DATA, FETCH_BANK, FETCH_BANKS, FETCH_COUNT, FETCH_DATA, FETCH_DATAS, FETCH_LISTDATA } from '../../../../redux/actions/types'
import _ from 'lodash'

const INIT_STATE = {
    data: [],
    pageCount: null,
}

const FormReducers = (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_LISTDATA:
            return { ...state, data: action.payload }
        /*return { ...state, banks: { ..._.mapKeys(action.payload, 'bankcode') } }*/
        case FETCH_DATA:
            return {
                ...state,
                [action.payload.storecode]: action.payload,
                lovs: []
            }
        case FETCH_COUNT:
            return { ...state, pageCount: action.payload }
        case DELETE_DATA:
            //const id = action.payload.id

            //  console.log('data', action.payload)

            return {
                ...state,
                data: {
                    ...state.data,
                    data: ( state.data.data && state.data.data.filter((x) => x.rowid !== action.payload.rowid))
                }
            }
        default:
            return state;
    }

}

export default FormReducers