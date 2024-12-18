import { FETCH_DATAS, FETCH_DATA, DELETE_DATA } from '../../../../redux/actions/types'

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
                [action.payload.workshopcode]: action.payload,
                lovs: []
            }
        case DELETE_DATA:
            //const id = action.payload.id

            //  // console.log('data', action.payload)

            return {
                ...state,
                data: {
                    ...state.data,
                    data: (state.data.data && state.data.data.filter((x) => x.rowid !== action.payload.rowid)),
                },
            };


        /*         case CREATE_STREAM:
                    return { ...state, [action.payload.id]: action.payload }
                case UPDATE_STREAM:
                    return { ...state, [action.payload.id]: action.payload }
                case DELETE_STREAM:
                    return _.omit(state, action.payload)
         */
        default:
            return state;
    }


}

export default FormReducers