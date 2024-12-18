import React, { useEffect } from "react";
import ContentHeader from "./templates/ContentHeader";
import { Outlet } from 'react-router-dom'
import { connect, useDispatch } from "react-redux";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import _ from "lodash"
import LoadingStatus from "./templates/LoadingStatus";
import { fetchDasboard } from "../redux/actions"
import { Link } from "react-router-dom";
import { Feed, Header, List, Segment } from "semantic-ui-react";



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

const Home = ({ jsonData, dashboard }) => {
    // // console.log(_.filter(jsonData,['title']))
    // // console.log(dashboard)
    if (_.size(jsonData) == 1)
        dashboard = _.uniqBy(dashboard, jsonData)

    const dispatch = useDispatch()
    const events = {
        events: [
            {
                id: 'x',
                title: 'Clock in',
                start: new Date(1702203015000),
            }, {
                id: 'x',
                title: 'Clock out',
                start: new Date(1702203015000),
            },
            /*             { title: 'Clock out', start: new Date(1702462215000), color: '#ff9f89' }, */

        ],
        eventColor: '#8E44AD'
    }
    const renderEventContent = (eventInfo) => {

        console.log(eventInfo)




        return (
            < div>
                <i>{eventInfo.timeText}</i> &nbsp;
                <b>{eventInfo.event.title}</b>

            </div >
        )
    }



    useEffect(() => {

        dispatch(fetchDasboard())

    }, [dispatch])

    // if (_.isUndefined(jsonData) || _.isUndefined(dashboard))
    //     return (<LoadingStatus />)
    if (_.isEmpty(dashboard) || _.isEmpty(jsonData))
        return (<>
            <ContentHeader title="Home" />
            <Outlet />
        </>)
    return (<ContentHeader title="Home" >
        <Segment.Group compact key={`sg`} raised
            style={{
                margin: '4px',
                maxWidth: '50vw',
                maxHeight: '80vh',
                borderLeft: '5px solid white',
                borderRight: '5px solid white'
            }} >
            <Segment >
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView='dayGridMonth'
                    height='auto'
                    weekends={true}
                    events={events}
                    eventContent={renderEventContent}
                />
            </Segment>
        </Segment.Group >
        <Segment style={{
            margin: '4px',
            maxWidth: '50vw',
            height: '30vh',
            borderLeft: '5px solid white',
            borderRight: '5px solid white'
        }}  >
            {/*             <Header content='Reminder' dividing /> */}
            <Header as='h5' icon='info circle' content='Information' dividing />
            <List>
                <List.Item>Sisa Cuti{' '}  <b>5 Hari</b></List.Item>
                <List.Item>Saldo Plafond Rawat Jalan{' '}  <a>3000,0000</a></List.Item>
                <List.Item>Sisa Cuti{' '}  <b>5 Hari</b></List.Item>
                <List.Item>Sisa Cuti{' '}  <b>5 Hari</b></List.Item>
            </List>
        </Segment>
    </ContentHeader >
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

export default connect(mapStateToProps, { fetchDasboard })(Home)