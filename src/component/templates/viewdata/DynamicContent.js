import React, { useEffect, useMemo, useState } from "react"
import _ from "lodash"

import { Header, Icon, ItemContent, Message, Modal, Popup, Segment } from "semantic-ui-react"
import LoadingStatus from "../LoadingStatus"
import TableData from "./TableContainer"
import { useDispatch, useSelector } from "react-redux"
import { fetchDashboard } from "../../modules/executive/ModuleAction"
import StatisticView from "./StatisticContainer"
import { useLocation } from "react-router-dom"
import LineGraph from "./LIneGraphContainer"
import Gauge from "./GaugeContainer"
import BarChart from "./BarChartContainer"

import BarLine from "./BarLineContainer"

import PieGraph from "./PieGraphContainer"
import BarChartHorizontal from "./BarChartHorizonalContainer"
import ContainerMap from "./MapContainer"
import { xlsFromTable } from "../../../utils/DataHelper"

const DynamicContent = ({ groups, segmentRef, seq, dateperiode, dlistener, search, search2, /* filterselected, */ cellListener }) => {

    const dispatch = useDispatch()
    const contents = useSelector(st => st[st.auth.activeRoute]['content'])
    const contentval = _.find(contents, { 'group': groups?.group, 'code': groups?.code })

    const filtercontent = useSelector(st => st.auth.filtercontent)

    const loc = useLocation()

    const [popped, Popping] = useState(false)


    //   console.log('rendered', contentval?.group, contentval?.isload)
    //console.log('rendered')

    let label = ''

    const listlabel = _.filter(filtercontent, ({ group }, fi) => !_.isEmpty(group.remarks))

    // console.log(listlabel)

    _.map(listlabel, ({ group }, fi) => {

        if (listlabel.length === 1) {

            label += `( ${group.group} : ${group.remarks} )`
        }
        else {

            if (fi === 0) {
                label += `( `
            }

            label += ` ${group.group} : ${group.remarks} `

            if (fi === listlabel.length - 1) {
                label += `)`
            } else {
                label += `,`
            }
        }
    })

    /* useEffect(() => {

        if (_.isUndefined(contentval?.isload) && loc.pathname.split('/')[1] === 'executive') {

            dispatch(fetchContent(contentval, contentval?.route, contentval?.code, dateperiode))
        }

    }, [dateperiode, contentval]) */

    useEffect(() => {

        //        const load = _.isUndefined(contents?.isload) ? true : contentval?.isload



        dispatch(fetchDashboard(contentval, contentval?.route, contentval?.code, dateperiode, search, search2, filtercontent))


    }, [filtercontent, dateperiode, contentval, search, search2])


    const chartStyle = {
        position: 'relative',
        height: popped ? '60vh' : '40vh',
        width: popped ? '65vw' : '40vw'
    }


    const itemContent = (cv) => {

        if (cv?.returntype === 'data') {
            return <TableData
                content={cv}
                dates={dateperiode}
                headerListener={(x) => {
                    // console.log('content', contents)

                    dlistener(x, cv)
                }}
                cellListener={cellListener} />
        } else if (cv?.returntype === 'stat_1') {
            return <StatisticView
                content={cv}
                dates={dateperiode}
                headerListener={(params) => {
                    dlistener(params, cv)
                }} />
        }
        else if (cv?.returntype === 'graph_1') {
            return <LineGraph
                content={cv}
                dates={dateperiode}
                chartStyle={chartStyle}
                headerListener={(params) => {
                    dlistener(params, cv)
                }} />

        } else if (cv?.returntype === 'graph_bar_1') {
            return <BarChart
                content={cv}
                chartStyle={chartStyle}
                dates={dateperiode}
                headerListener={(params) => {
                    dlistener(params, cv)
                }}
            />

        }
        else if (cv?.returntype === 'graph_bar_line') {
            return <BarLine
                content={cv}
                chartStyle={chartStyle}
                dates={dateperiode}
                headerListener={(params) => {
                    dlistener(params, cv)
                }}
            />

        } else if (cv?.returntype === 'graph_bar_2') {
            return <BarChartHorizontal
                content={cv}
                dates={dateperiode}
                chartStyle={chartStyle}
                headerListener={(params) => {
                    dlistener(params, cv)
                }} />

        }
        else if (cv?.returntype === 'graph_pie_1') {
            return <PieGraph
                content={cv}
                dates={dateperiode}
                chartStyle={chartStyle}
                headerListener={(params) => {
                    dlistener(params, cv)
                }} />

        } else if (cv?.returntype === 'gauge') {
            return <Gauge
                content={cv}
                dates={dateperiode}
                headerListener={(params) => {
                    dlistener(params, cv)
                }} />

        } else if (cv?.returntype === 'map') {
            return <ContainerMap
                content={cv}
                dates={dateperiode}
                headerListener={(params) => {
                    dlistener(params, cv)
                }} />
        }
    }





    const Content = useMemo(() => {

        const display_width = contentval?.display_width
        const display_height = contentval?.display_height


        return < div className={`container-segment-${seq}`} key={`cs-${seq}`} ref={segmentRef}
        /* style={{
            maxWidth: !popped ? display_width : '100vw',
                margin: '4px',
        }} */>
            <Segment.Group

                raised key={`sg${seq}`}
                style={{
                    margin: '4px',
                    maxWidth: !popped ? display_width : '100vw',
                    backgroundColor: 'white'
                    //  maxHeight: !popped ? display_height : '70vh'
                }} >
                {!popped && <Segment clearing style={{
                    fontSize: 'smaller',
                    fontWeight: 'bold',/* 
                    marginBottom: '-10px',
                    paddingTop: '10px' */
                }} >
                    {contentval?.group} {label}
                    <Popup
                        trigger={<Icon fitted name={popped ? 'window minimize' : 'window maximize'}
                            link onClick={() => { Popping(!popped) }}
                            style={{ float: 'inline-end' }} />}
                        content={!popped ? 'Maximize Content' : 'Minimize Content'}
                        position='top center'
                        size="mini"
                        inverted
                    />
                    {contentval?.returntype === 'data' &&
                        <Popup
                            trigger={<Icon fitted name={'file excel'}
                                link onClick={() => {
                                    //console.log(contentval)
                                    xlsFromTable(contentval, dateperiode)
                                }} style={{
                                    float: 'inline-end',
                                    paddingInlineEnd: '5px'
                                }} />}
                            content={'Export To Xls'}
                            position='top center'
                            size="mini"
                            inverted
                        />
                    }
                </Segment>}
                <Segment style={{
                    paddingTop: '0',
                    /*   width: !popped ? display_width : '100vw', */
                    /* maxWidth: !popped ? display_width : '100vw',*/
                    maxHeight: !popped ? display_height : '70vh',
                    overflowX: 'auto',
                    position: 'sticky', top: '0',
                    overflowY: 'auto',
                    marginLeft: '0.2em',
                    marginBottom: '0.5em',
                }} >
                    {(_.isUndefined(contentval?.isload) || (!_.isUndefined(contentval?.isload) && contentval.isload)) ?
                        <Segment basic style={{ minWidth: '5cm', minHeight: '3cm' }}
                            content={<LoadingStatus sizes='small' msg={`Loading Data ${contentval?.group} ....`} />} />
                        :
                        ((_.size(contentval?.content?.rows) === 0  /* && !contentval?.isload  */) ?
                            < Header as='h4' style={{ paddingTop: '1em' }} color="red" >
                                <Icon.Group size="large">
                                    <Icon size='large' color='red' name='file text outline' />
                                    <Icon size='small' color='red' name='dont' style={{ paddingRight: '1em' }} />
                                </Icon.Group> No Data To Show</Header>
                            :
                            itemContent(contentval)
                        )}
                </Segment>
            </Segment.Group ></div>
    }, [contentval?.isload, popped, /*search, search2*/])

    //{/* <Message size="mini" negative><Message.Header>No Data</Message.Header></Message> */ }

    if (_.isUndefined(groups)) {
        return <LoadingStatus />
    }
    else {
        if (!popped) {
            return Content
            /* return < div className={`container-segment-${seq}`} key={`cs-${seq}`} ref={segmentRef} style={{ width: '500px' }}>
                {Content}
            </div> */
        } else {
            return <Modal
                onClose={() => Popping(false)}
                onOpen={() => Popping(true)}
                open={popped}
                //size='fullscreen'
                size={(contentval?.returntype === 'data') ? "fullscreen" : 'small'}
                style={{
                    marginLeft: '2.5em', width: '70vw', height: '80vh'
                }}
            >
                <Modal.Header > {contentval?.group}
                    <Header as='h6' floated='right' >
                        <Popup
                            trigger={<Icon fitted name={popped ? 'window minimize' : 'window maximize'} size="mini" link onClick={() => {
                                Popping(!popped)
                            }} />}
                            content={!popped ? 'Maximize Content' : 'Minimize Content'}
                            position='left center'
                            size="mini"
                            inverted
                            style={{ zIndex: '999999999999' }}
                        />
                    </Header>
                </Modal.Header>
                {(contentval?.returntype === 'data') ?
                    Content
                    :
                    <Modal.Content image >{Content} </Modal.Content>
                }

            </Modal >
        }
    }

}


export default DynamicContent