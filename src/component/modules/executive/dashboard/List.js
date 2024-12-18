import React, { useDebugValue, useEffect, useMemo, useRef } from "react"
import { Button, Container, Header, Segment, } from "semantic-ui-react"
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'
import { useNavigate, useLocation } from "react-router-dom"
// *library imports placed above ↑
// *local imports placed below ↓

import { fetchContentFilter, fetchContentList, fetchDataheader, fetchDynamicDetail, fetchfilter, fetchfilter2 } from "../ModuleAction"
import LoadingStatus from "../../../templates/LoadingStatus"
import requireAuth from "../../../auth/requireAuth"
import ContentHeader from "../../../templates/ContentHeader"

import reducer from "../ModuleReducer"
import {
    changeReducer, getLoadingStatus, getTitleFromComponent, periodHandler,
    filterHandler2, QueryReducerID, QuerySearch, filterHandler, QueryDatePeriodeNow, QuerySearch2
} from "../../../../utils/FormComponentsHelpler"
import store from "../../../../redux/reducers"
import { ACTIVE_PROPS, RELOAD_CONTENT, SET_LOADING_STATUS, UPDATE_LISTDATA } from "../../../../redux/actions/types"
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


const List = ({ data, dateperiode, reducerid, search, search2,
    loadingMessage, isloading, activeProps, contents, contentsgroup, activeRoutes, filterNav }) => {
    const loc = useLocation()
    const dispatch = useDispatch()


    let segmentRef = useRef([]);

    useEffect(() => {
        changeReducer(loc.pathname.replaceAll('/', ''), reducer);
    }, [loc])


    useEffect(() => {


        const st = store.getState()
        const findr = _.split(loc.pathname, '/')

        let checkMenu = _.find(st.auth.menu.values, ['controlsystem', findr[1]])?.childs

        dispatch({
            type: ACTIVE_PROPS,
            payload: _.find(_.flatMap(checkMenu, x => { return x.childs ? x.childs : x }), ['route', findr[2]])
        })

        if (activeProps?.filter1) {
            dispatch(fetchfilter2(activeProps?.filter1))
        }
    }, [activeProps])



    useEffect(() => {



        if (activeRoutes === loc.pathname.replaceAll('/', '')) {

            if (!_.isUndefined(dateperiode) && !_.isNil(activeProps) && !_.isNil(search)) {

                if (activeProps?.parameter4 === 'SINGLE_LOAD') {

                    if (_.isEmpty(contentsgroup)) {
                        // // console.log('re-fecth')

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
                        dispatch({ type: RELOAD_CONTENT })
                    }

                } else {
                    // // console.log('fecth')
                    dispatch(fetchDataheader(loc.pathname.split('/')[2], dateperiode))
                }


            }
        }
    }, [activeProps, activeRoutes, dateperiode/*, search, search2, filterNav*/])



    useEffect(() => {


        if (!_.isEmpty(contentsgroup)) {
            // // console.log('filter Changed', search, search2, filterNav)
            dispatch({ type: RELOAD_CONTENT })
        }
    }, [search, search2, filterNav])






    useEffect(() => {
        if (!_.isEmpty(segmentRef.current))
            segmentRef?.current[_.size(contents) - 1]?.scrollIntoView();

    }, [contents]);


    const headerlistener = (param, ch) => {

        //  // // console.log('click ', param, ch)

        const isExist = _.findIndex(contents, ['parent', param])
        let params = param


        //  console.log(ch)

        if (ch?.parent) {
            _.map(ch.parent, x => params.push(x))
        }
        /* 
                if ((param)) {
                    // // console.log('notarray ')
                    params.push(param)
                } else {
                    _.merge(params, param) 
    }*/

        //  // // console.log(params, param)

        if (isExist === -1) {

            //dispatch({ type: SET_LOADING_STATUS, payload: true })

            dispatch(fetchDynamicDetail(loc.pathname.split('/')[2], dateperiode, params, ch))
        }
        else {
            segmentRef.current[isExist].scrollIntoView();
        }
    }


    const cellListener = (param, val, ch) => {

        const isExist = _.findIndex(contents, ['parent', param])
        let params = []


        //  // // console.log(ch)

        if (ch?.parent) {
            _.map(ch.parent, x => params.push(x))
        }

        params.push(param)

        // // console.log(params)

        if (isExist === -1) {

            dispatch(fetchDynamicDetail(loc.pathname.split('/')[2], dateperiode, params, ch))
        }
        else {
            segmentRef.current[isExist].scrollIntoView();
        }


    }
    // // // console.log(contentsgroup)

    // ! VIEW UNTUK DATA YANG DILOAD SATU PERSATU ( ASYNC LOAD PER ITEM DATA GROUP )  
    const IncrementView = useMemo(

        () => _.map(contentsgroup, (x, s) => {

            return <DynamicContent key={`dc${s}`}
                groups={x} seq={s}
                segmentRef={segmentRef}
                dlistener={headerlistener}
                cellListener={cellListener}
                dateperiode={dateperiode}
                search={search}
                search2={!_.isEmpty(activeProps?.filter1) && search2}
            /*     filterselected={filterselected} */
            />
        }),
        [contentsgroup, search, search2, filterNav]
    )

    // ! TEMPLATE VIEW UNTUK DATA YANG KELUAR SEKALIGUS ( ONTIME  LOAD FOR ALL DATA GROUP ) 
    const OnetimeView = useMemo(
        () => _.map(contents, (x, s) =>
            <SingleContent key={`dc${s}`} groups={x} seq={s} segmentRef={segmentRef} dlistener={headerlistener} dateperiode={dateperiode} />),
        [contents]
    )



    if (loc.pathname.replaceAll('/', '') != reducerid || isloading)
        return (<LoadingStatus msg={loadingMessage} />)



    return (
        <ContentHeader
            title={getTitleFromComponent(data)}
            periodaction={periodHandler({ dateperiode })}
            filteraction={{ defaultValue: 'USTP', type: 'button', label: 'Site', ...filterHandler({ search }) }}
            filteraction2={activeProps?.filter1 && { type: 'select', label: 'Group', ...filterHandler2({ search2 }) }}>
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
        </ContentHeader>
    )



}



const MapStateToProps = state => {

    //    // // console.log(state)

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