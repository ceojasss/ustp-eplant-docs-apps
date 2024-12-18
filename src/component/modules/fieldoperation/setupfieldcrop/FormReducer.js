import { DELETE_DATA, FETCH_BANK, FETCH_BANKS, FETCH_DATA, FETCH_DATAS } from '../../../../redux/actions/types'
import _ from 'lodash'

const INIT_STATE = {
    data: [],
    lovs: [],
}

const FormReducers = (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_DATAS:
            return {
                ...state,
                data: action.payload,
                lovs: []
            }
        /*return { ...state, banks: { ..._.mapKeys(action.payload, 'bankcode') } }*/
        case FETCH_DATA:
            return {
                ...state,
                [action.payload.storecode]: action.payload,
                lovs: []
            }
        case DELETE_DATA:
            //const id = action.payload.id

            //  console.log('data', action.payload)

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

export default FormReducers
