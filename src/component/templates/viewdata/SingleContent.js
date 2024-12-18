import React, { useEffect } from "react"
import _ from "lodash"

import { Header, Segment } from "semantic-ui-react"
import LoadingStatus from "../LoadingStatus"
import TableData from "./TableContainer"
import { useDispatch, useSelector } from "react-redux"


const SingleContent = ({ groups, segmentRef, seq, dateperiode, dlistener }) => {

    const dispatch = useDispatch()

    const contents = useSelector(st => st[st.auth.activeRoute]['content'])

    const contentval = _.find(contents, { 'group': groups.group, 'code': groups.code })


    useEffect(() => {

        if (_.isUndefined(contentval?.isload)) {
            console.log(contentval)

            //     dispatch(fetchContent(contentval, contentval.route, contentval.code, dateperiode))
        }


    }, [dateperiode, contentval])


    if (_.isUndefined(groups)) {

        return <LoadingStatus />
    }
    else {


        return < div className={`container-segment-${seq}`}
            key={`cs-${seq}`}
        //  ref={(element) => segmentRef?.current[seq] = element}
        >
            <Segment.Group
                compact horizontal key={`sg${seq}`}
                style={{
                    margin: '4px',
                    maxWidth: '80vw',
                    maxHeight: '80vh',
                    overflowX: 'auto',
                    borderLeft: '5px solid white',
                    borderRight: '5px solid white'
                }} >

                <Segment  >
                    <Header as='h5' content={contentval.group} style={{ position: 'sticky', top: '0', zIndex: '1' }} />
                    {(_.isNil(contentval.content) ? <>No Data</> : < TableData
                        content={contentval}
                        dates={dateperiode}
                        headerListener={(params) => {
                            dlistener(params, contentval)
                        }} />)}
                </Segment>


            </Segment.Group >
        </div >
    }

}

export default SingleContent