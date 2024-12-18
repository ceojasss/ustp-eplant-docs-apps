import _ from 'lodash'
import {
    FETCH_LISTDATA, FETCH_LISTDATADETAIL, DELETE_DATA,
    FETCH_COUNT, RELOAD_CONTENT, RESET_DETAIL_DATA, SET_VALIDATION_SCHEMA,
    UPDATE_LISTDATA, FETCH_LISTCONTENT, UPDATE_LISTCONTENT, FETCH_LISTCONTENT_ALL,
    UPDATE_LISTCONTENT_FAILED
} from '../../../redux/actions/types'

const INIT_STATE = {
    content: [],
    data: [],
    datadetail: [],
    pageCount: null,
    component: []
}

const FormReducers = (state = INIT_STATE, action) => {

    switch (action.type) {
        case FETCH_LISTCONTENT_ALL:
            return { ...state, content: action.payload.data, component: action.payload.component }

        case FETCH_LISTCONTENT:
            return { ...state, content: action.payload.data, component: action.payload.component }

        case UPDATE_LISTCONTENT:
            let std = state.content
            const val = action.payload



            _.map(std, x => {
                if (x?.groupid === val?.groupid && x.code === val.code) {
                    _.assign(x, { ...val, isload: false })
                }
            })

            return { ...state, content: std }



        case RELOAD_CONTENT:
            let curr = state.content

            _.map(curr, x => {
                _.assign(x, { ...x, isload: true })
            })


            return { ...state, content: curr }
        case UPDATE_LISTCONTENT_FAILED:

            let stf = state.content
            const valf = action.payload


            _.map(stf, x => {

                if (x?.groupid === valf?.groupid && x.code === valf.code) {
                    _.assign(x, { ...valf, isload: false })
                }
            })

            return { ...state, content: stf }
        case FETCH_LISTDATA:
            return { ...state, datadetail: [], data: action.payload }
        case UPDATE_LISTDATA:
            let statedata = state.content

            _.remove(statedata, (x) => _.some(action.payload, (c) => x.level >= c.level))
            const updates = _.concat(statedata, action.payload)

            //            console.log('update', x)

            return {
                ...state, content: updates /* appends */
            }

        case FETCH_LISTDATADETAIL:

            return { ...state, datadetail: [...state.datadetail, ...action.payload] }
        case FETCH_COUNT:
            return { ...state, pageCount: action.payload }
        case RESET_DETAIL_DATA:
            return { ...state, datadetail: [] }

        case DELETE_DATA:
            return {
                ...state,
                content: {
                    ...state.content,
                    content: (state.content && state.content.filter((x) => x.rowid !== action.payload.rowid))
                }
            }
        default:
            return state;
    }

}

export default FormReducers
