import React, { useEffect } from "react";
import ContentHeader from "./templates/ContentHeader";
import { Outlet } from 'react-router-dom'
import { connect, useDispatch } from "react-redux";
import CardDynamic from "./templates/Card";
import _ from "lodash"
import LoadingStatus from "./templates/LoadingStatus";
import { fetchDasboard } from "../redux/actions"
import { Link } from "react-router-dom";
import { NumberFormat } from "./Constants";




//"../../../../redux/reducers"

/*=============================================================================
 |         Dept:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - 
 |                - 
 |          
 |  Description:  Template Content Application
 |                Enclosed within ContentHeader element                 
 |                Parent Value & Components : 
 |                          - Title           (String)
 |                          - Button New Data (Function)
 |
 *===========================================================================*/

const Dashboard = ({ jsonData, dashboard }) => {
    // // console.log(_.filter(jsonData,['title']))
    // // console.log(dashboard)
    if (_.size(jsonData) == 1)
        dashboard = _.uniqBy(dashboard, jsonData)

    const dispatch = useDispatch()


    useEffect(() => {

        dispatch(fetchDasboard())

    }, [dispatch])

    // if (_.isUndefined(jsonData) || _.isUndefined(dashboard))
    //     return (<LoadingStatus />)
    if (_.isEmpty(dashboard) || _.isEmpty(jsonData))
        return (<>
            <ContentHeader title="Application Dashboard" />
            <Outlet />
        </>)
    return (
        <>
            <ContentHeader title="Application Dashboard"            >
                {dashboard.map((data, i) => {
                    // // console.log(data,i)
                    return <CardDynamic
                        icon={jsonData[i]['parameter6']}
                        color={jsonData[i]['parameter7']}
                        total={(NumberFormat(_.get(data, 'TOTAL')))}
                        key={`card-${i}`}
                        name={
                            <Link
                                to={`/${jsonData[i].controlsystem}/${jsonData[i].route}`}
                                state={{ route: `/${jsonData[i].controlsystem}/${jsonData[i].route}` }} >
                                {_.get(data, 'NAME')}
                            </Link>} ></CardDynamic>
                })}
            </ContentHeader >
            <Outlet />
        </>
    )
}

const mapStateToProps = (state) => {
    // // console.log(state)
    // // console.log(state.dashboard.dashboard,'-',state.auth.menu.dashboard)
    return {
        jsonData: _.filter(state.auth.menu.dashboard, { 'parameter5': 'Card' }),
        dashboard: state.dashboard.dashboard
    }

}

export default connect(mapStateToProps, { fetchDasboard })(Dashboard)