import React, { useEffect, useMemo, useRef } from "react"
import { connect, useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { useLocation } from "react-router-dom"
// *library imports placed above ↑
// *local imports placed below ↓
import store from "../../../../redux/reducers"

import { fetchContentFilter, fetchContentList, fetchDataheader, fetchDynamicDetail, fetchfilter, fetchfilter2 } from "../ModuleAction"

import LoadingStatus from "../../../templates/LoadingStatus"
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import reducer from "../ModuleReducer" //"./FormReducer"
import {
    changeReducer, getLoadingStatus, getTitleFromComponent, periodHandler,
    QueryDatePeriodeNow, QueryReducerID, QuerySearch, QuerySearch2
} from "../../../../utils/FormComponentsHelpler"

import { ACTIVE_PROPS, RELOAD_CONTENT, SET_LOADING_STATUS } from "../../../../redux/actions/types"

import { INDEXDATATRANSAKSI } from "../../../Constants"
import DynamicContent from "../../../templates/viewdata/DynamicContent"
import SingleContent from "../../../templates/viewdata/SingleContent"
import ContentFilter from "../../../templates/viewdata/ContentFilterContainer"


/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Baginda Bonar Siregar
 |                - 
 |          
 |  Description:  List Currency Daily Rate
 |                               
 |                  - 
 |                  - 
 |                  - 
 *===========================================================================*/

const List = ({ data, dateperiode, reducerid, search, search2, loadingMessage, isloading,
    activeProps, contents, contentsgroup, activeRoutes, filterNav }) => {
    const loc = useLocation()
    const dispatch = useDispatch()
    const clickref = useRef();

    let segmentRef = useRef([]);



    useEffect(() => {


        changeReducer(loc.pathname.replaceAll('/', ''), reducer);
    }, [loc])

    useEffect(() => {

        const findr = _.split(loc.pathname, '/')
        const st = store.getState()

        dispatch(fetchfilter())

        const checkMenu = _.find(st.auth.menu.values, ['controlsystem', findr[1]])?.childs

        dispatch({ type: ACTIVE_PROPS, payload: _.find(_.flatMap(checkMenu, x => x.childs), ['route', findr[2]]) })

        if (activeProps?.filter1) {
            dispatch(fetchfilter2(activeProps?.filter1))
        }
    }, [activeProps])


    useEffect(() => {
        if (activeRoutes === loc.pathname.replaceAll('/', '')) {

            if (!_.isUndefined(dateperiode) && !_.isNil(activeProps) && !_.isNil(search)) {

                if (activeProps?.parameter4 === 'SINGLE_LOAD') {

                    if (_.isEmpty(contentsgroup)) {

                        // console.log('re-fecth')

                        dispatch({ type: SET_LOADING_STATUS, payload: true })

                        dispatch(fetchfilter(() => {
                            dispatch(fetchContentList(loc.pathname.split('/')[2], dateperiode,
                                (proute) => {
                                    dispatch(fetchContentFilter(proute, () => {
                                        dispatch({ type: SET_LOADING_STATUS, payload: false })
                                    }))
                                }
                            ))
                        }))

                    } else {
                        //dispatch(updateContent())
                        // console.log('rfeload')
                        dispatch({ type: RELOAD_CONTENT })
                    }

                } else {
                    dispatch(fetchDataheader(loc.pathname.split('/')[2], dateperiode))
                }


            }
        }
    }, [activeProps, activeRoutes, dateperiode])


    useEffect(() => {

        if (!_.isEmpty(contentsgroup)) {
            // console.log('filter Changed', search, search2, filterNav)
            dispatch({ type: RELOAD_CONTENT })
        }
    }, [search, search2, filterNav])




    const filterHandler = ({ search }) => ({
        value: search,
        onButtonclick: (event) => {
            const st = store.getState()
            // // console.log('waaa', event)

            const find = _.find(st.auth.filteronnav.rows, ['code', event])

            const ch = _.find(contents, ['code', '1'])

            // // console.log('waaa', ch)

            const param = {
                key: find.param,
                val: event
            }

            const isExist = _.findIndex(contents, ['parent', param])
            let params = []

            if (ch?.parent) {
                _.map(ch.parent, x => params.push(x))
            }

            params.push(param)

            if (isExist === -1) {


                dispatch(fetchDynamicDetail(loc.pathname.split('/')[2], dateperiode, params, ch))
            }
            else {
                segmentRef.current[isExist].scrollIntoView();
            }
        },
    })


    useEffect(() => {
        clickref.current = (param, ch, cb) => {

            let params = []

            if (ch?.parent) {
                _.map(ch.parent, x => params.push(x))
            }

            params.push(param)

            const x = _.map(contents, x => _.map(x?.parent, y => y === param))

            const isExist = _.indexOf(_.flatMap(x), true)

            if (isExist === -1) {


                //  // // console.log(params)
                //  // // console.log(ch)

                dispatch(fetchDynamicDetail(loc.pathname.split('/')[2], dateperiode, params, ch))


                if (cb)
                    cb(ch?.code)
            }
            else {
                segmentRef.current[isExist].scrollIntoView();
            }


        }
    }, [contents])

    const HeaderListener = (param, ch) => {

        const isExist = _.findIndex(contents, ['parent', param])
        let params = []

        if (ch?.parent) {
            _.map(ch.parent, x => params.push(x))
        }

        params.push(param)



        if (isExist === -1) {
            //            console.log('run again')

            dispatch(fetchDynamicDetail(loc.pathname.split('/')[2], dateperiode, params, ch))
        }
        else {
            //          console.log('run again x')
            segmentRef.current[isExist].scrollIntoView();
        }

    }

    const CellListener = (param, val, ch) => {


        const isExist = _.findIndex(contents, ['parent', param])
        let params = []


        if (ch?.parent) {
            _.map(ch.parent, x => params.push(x))
        }

        params.push(param)


        if (isExist === -1) {

            dispatch(fetchDynamicDetail(loc.pathname.split('/')[2], dateperiode, params, ch))
        }
        else {
            segmentRef.current[isExist].scrollIntoView();
        }



    }


    // ! VIEW UNTUK DATA YANG DILOAD SATU PERSATU ( ASYNC LOAD PER ITEM DATA GROUP )  
    const IncrementView = useMemo(
        () => _.map(contentsgroup, (x, s) => <DynamicContent key={`dc${s}`}
            groups={x} seq={s}
            segmentRef={segmentRef}
            dlistener={HeaderListener}
            cellListener={CellListener}
            dateperiode={dateperiode}
            search={search}
            search2={!_.isEmpty(activeProps?.filter1) && search2}
        />), [contentsgroup, search, search2, filterNav]
    )



    // ! TEMPLATE VIEW UNTUK DATA YANG KELUAR SEKALIGUS ( ONTIME  LOAD FOR ALL DATA GROUP ) 
    const OnetimeView = useMemo(
        () => _.map(contents, (x, s) =>
            <SingleContent key={`dc${s}`} groups={x} seq={s} segmentRef={e => segmentRef.current[s] = e} dlistener={HeaderListener} dateperiode={dateperiode} />),
        [contents]
    )


    if (isloading || loc.pathname.replaceAll('/', '') != reducerid)
        return (<LoadingStatus msg={loadingMessage} />)

    return (
        <ContentHeader
            title={getTitleFromComponent(data)}
            periodaction={periodHandler({ dateperiode })}
            filteraction={!_.isEmpty(activeProps?.filtertype)
                && { defaultValue: 'USTP', type: activeProps?.filtertype, label: 'Site', ...filterHandler({ search }) }}>
            <ContentFilter />
            {
                (() => {
                    if (activeProps?.parameter4 === 'SINGLE_LOAD') {


                        return IncrementView
                    } else {

                        return OnetimeView
                    }
                })()
            }
            {/*             {(activeProps?.parameter4 === 'SINGLE_LOAD' && contentsgroup) && IncrementView}
            {(activeProps?.parameter4 !== 'SINGLE_LOAD' && contentsgroup) && OnetimeView} */}
        </ContentHeader>
    )


}


const MapStateToProps = state => {


    return {
        data: state[state.auth.activeRoute]?.component,
        contents: (!_.isNil(Object.values(state)[INDEXDATATRANSAKSI]) ? _.filter(Object.values(state)[INDEXDATATRANSAKSI]['content']) : []),
        contentsgroup: _.map((!_.isNil(Object.values(state)[INDEXDATATRANSAKSI]) ? _.filter(Object.values(state)[INDEXDATATRANSAKSI]['content']) : []), x => { return { 'group': x.group, 'code': x.code, 'isload': x?.isload } }),
        loadingMessage: state.auth.loadingmessage,
        isloading: getLoadingStatus(state),
        dateperiode: QueryDatePeriodeNow(state),
        search: QuerySearch(state),
        search2: QuerySearch2(state),
        reducerid: QueryReducerID(state),
        activeProps: state.auth.activeProps,
        activeRoutes: state.auth.activeRoute,
        filterNav: state.auth.filtercontent,

        filterselected: state.auth.filterselected
    }
}

export default requireAuth(connect(MapStateToProps)(List))