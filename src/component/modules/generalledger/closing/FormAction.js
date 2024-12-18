import _ from 'lodash'
import eplant from '../../../../apis/eplant'
import {
    EXCEPTION_ERROR, FETCH_DATADETAIL, FETCH_DATAS, FETCH_ERROR,
    ON_PROCESS, SET_DATA_LOADING, UPDATE_FETCH_DATA
} from '../../../../redux/actions/types'
import { QueryDatePeriode, getData, parseDatetoString } from '../../../../utils/FormComponentsHelpler'


export const ROUTES = '/costbook/Trx/closing'

export const createData = (z, callback) => async (dispatch) => {

    let retVal


    try {
        //console.log('run post', z)

        dispatch(updateData(z))

        const response = await eplant.post(ROUTES, {})

        console.log({ data: response.data, z })



        if (response.data === 'success') {
            dispatch(updateData(z))
        }

        //
    }
    catch (error) {

        console.log('run post ', error)

    } finally {
        if (callback) callback(retVal)
    }

}

export const closeperiod = (obj, idx, cb) => async (dispatch) => {

    try {

        const response = await eplant.put(`${ROUTES}/reopen?module=${obj}`)

        dispatch({ type: FETCH_DATAS, payload: response.data })

    } catch (error) {
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }

    if (cb)
        cb()

}

export const updateData = (idx, obj, cb) => async (dispatch) => {

    const data = getData('dataview')

    console.log('action ', idx, obj)


    _.assignIn(data[idx], obj)

    await dispatch({ type: UPDATE_FETCH_DATA, payload: data })

    if (cb)
        cb()

}

export const startProcess = () => async (dispatch) => {

    const dataprocess = getData('dataprocess')

    const period = QueryDatePeriode()

    const periodparsed = period instanceof Date ? parseDatetoString(period) : parseDatetoString(new Date(period))


    dispatch({ type: ON_PROCESS, payload: true })

    for (let index = 0; index < dataprocess.length; index++) {
        //console.log(index, dataprocess[index])
        dispatch(updateData(index, { isProcess: true, status: 'Processing....', isActive: true, isError: false, completed: false }))

        try {
            const response = await eplant.post(ROUTES, { ...dataprocess[index], period: periodparsed })


            if (response.data.error) {


                dispatch(updateData(index,
                    { isProcess: false, status: response.data.errorMessage, isActive: false, isError: true, completed: false }
                    , () => dispatch({ type: FETCH_ERROR, payload: response.data.errorMessage })))

                if (response?.data?.errorMessage !== 'No Data To Process')
                    break;
            }
            else {
                dispatch(updateData(index, { isProcess: false, status: 'Process Completed', isActive: false, completed: true }))
            }


        } catch (error) {
            console.log(error)

            dispatch(updateData(index,
                { isProcess: false, status: error.message, isActive: false, isError: true, completed: false }
                , () => dispatch({ type: FETCH_ERROR, payload: error.message })))

            break;
        }




    }
    dispatch({ type: ON_PROCESS, payload: false })



}

export const fetchDatas = (route) => async dispatch => {
    try {
        const period = QueryDatePeriode()

        const periodparsed = period instanceof Date ? parseDatetoString(period) : parseDatetoString(new Date(period))


        const response = await eplant.get(`${ROUTES}?period=${periodparsed}`)

        //        // console.log('done fetch stock')



        dispatch({ type: FETCH_DATAS, payload: response.data })

    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}


export const fetchDataDetails = (route, rows) => async dispatch => {



    try {

        //  // console.log(rows)


        if (_.isUndefined(rows))
            return;

        dispatch({ type: SET_DATA_LOADING, payload: true })

        const response = await eplant.get(`report/${route}/${rows}`)
        dispatch({ type: FETCH_DATADETAIL, payload: response.data })


    } catch (error) {
        // console.log(error.message)
        dispatch({ type: EXCEPTION_ERROR, payload: error.message })
    }
}



export const startProcessx = (cb) => async dispatch => {


    const dataprocess = getData('dataprocess')

    const data = getData('data')


    //    const dataprocess = _.clone(data)

    //  dispatch({ type: UPDATE_FETCH_DATA, payload: { isprocess: true } })

    try {


        /*    const z = _.map(data, v => {
               if (v.code === 'CS') {
                   return _.assign({}, v, { isProcess: true, status: 'Processing....', isActive: true })
               } else {
                   return v
               }
           })
   
           dispatch({ type: UPDATE_FETCH_DATA, payload: z })
    */
        let ret = []
        // console.log(data, dataprocess)
        await _.map(dataprocess, async x => {

            //            console.log(x.code, _.find(data, ['code', x.code]))
            let z

            setTimeout(async () => {

                z = await _.map(data, v => {
                    if (v.code === x.code) {
                        return _.assign({}, v, { isProcess: true, status: 'Processing....', isActive: true })
                    } else {
                        return v
                    }
                })




                if (cb)
                    cb(z)

            }, 1000);


        })



    } catch (error) {

    }
}


