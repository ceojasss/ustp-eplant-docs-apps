import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux'
import _ from 'lodash'

import store from '../../redux/reducers';
import { activeRoutes } from '../../redux/actions';
import { ACTIVE_PROPS, RESET_NAV, UPDATE_NAV_PERIOD, UPDATE_NAV_PERIOD_NOW } from '../../redux/actions/types';


const Routing = ({ actives, children }, props) => {

    const location = useLocation()
    const dispatch = useDispatch()
    const st = store.getState()

    const renderPlain = () => <div>{children}</div>

    const renderWith = () => <>{children}</>


    useEffect(() => {
        // // console.log('change', location.pathname)


        if ((location.pathname.split("/").length - 1) === 2) {


            if (store.asyncReducers && actives.activeRoute !== location.pathname.replaceAll('/', '')) {
                dispatch({ type: RESET_NAV })
                store.removeReducer(actives.activeRoute);
            }

            dispatch(activeRoutes(location.pathname.replaceAll('/', ''),
                () => {

                    const findr = _.split(location.pathname, '/')

                    let checkMenu = _.find(st.auth.menu.values, ['controlsystem', findr[1]])?.childs


                    if (_.size(st.auth?.menu) === 0) {
                        // console.log('menu empty , change route ', st.auth?.menu)

                    } else {

                        dispatch({ type: ACTIVE_PROPS, payload: _.find(_.flatMap(checkMenu, x => x.childs), ['route', findr[2]]) })

                        const date = new Date()

                        dispatch({ type: UPDATE_NAV_PERIOD_NOW, payload: date.setDate(date.getDate() - 1) })

                    }
                }))

        }

    }, [dispatch, location.pathname])




    if (location.pathname === '/signin') {
        return renderPlain()
    }
    else {

        return renderWith()
    }

}

const mapStateToProps = (state) => {
    return {
        actives: state.auth
    }
}
export default connect(mapStateToProps, { activeRoutes })(Routing)