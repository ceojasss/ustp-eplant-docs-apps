import React, { useEffect, useState } from "react"
import _ from 'lodash'

import requireAuth from "../../../auth/requireAuth"
import eplant from "../../../../apis/eplant"
import { Container, Header, Label, List, Message, Segment, Table, TableBody, TableRow } from "semantic-ui-react"
import ContentHeader from "../../../templates/ContentHeader"

const ROUTES = '/tools'

const fetchDatas = async (cb) => {

    // console.log('fetchdata ')

    const response = await eplant.get(ROUTES)

    let ret

    if (_.isUndefined(response.data)) {
        // console.log(response.error)
        ret = response.error
    }
    else {
        // console.log(response.data)

        ret = response.data
    }

    if (cb) cb(ret)

}


const View = () => {

    const [data, setData] = useState([]);





    useEffect(() => {

        fetchDatas(x => {
            // setData(null)
            setData(x)
        })

        const myInterval = setInterval(() =>
            fetchDatas(x => {
                // setData(null)
                setData(x)
            }), 10000);


        return () => {
            // should clear the interval when the component unmounts
            clearInterval(myInterval);
        };

    }, [])


    return (
        <ContentHeader
            title={'Database Monitor'}
        >
            <Container style={{ overflowY: 'scroll', display: 'block', /*paddingLeft: '0.5cm',*/ paddingRight: '1.5cm', height: '80vh', width: '86vw', paddingBottom: '5px' }}>
                < Segment.Group >
                    < Segment>
                        <Header size="small">Database Schema Connection - Down</Header>
                    </Segment>
                    < Segment.Group horizontal style={{ backgroundColor: 'white' }} >
                        {_.map(data, (v, k) => {
                            return (v.status === "Database API Connection Offline") && <Segment>
                                <Label color="red" basic icon='unlink' content={` Schema ${v.pool}`} /></Segment>
                        }
                        )}
                    </Segment.Group>
                </Segment.Group>

                < Segment.Group >
                    < Segment>
                        <Header size="small">Database Schema Connection - Up</Header>
                    </Segment>
                    < Segment.Group compact horizontal style={{ backgroundColor: 'white' }} >
                        {_.map(data, (v, k) => {
                            return (v.status !== "Database API Connection Offline") &&
                                <Segment >
                                    Database Schema {v.pool}
                                    < Table size="small" compact='very' fixed collapsing>
                                        <Table.Header style={{ backgroundColor: 'gainsboro', position: 'sticky', top: '0', zIndex: '1' }}>
                                            <Table.Row>
                                                <Table.HeaderCell>Status Name</Table.HeaderCell>
                                                <Table.HeaderCell>Status Value</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>  {
                                            _.map(v.status, (v, k) => <Table.Body>
                                                <Table.Row >
                                                    <Table.Cell content={k} />
                                                    <Table.Cell content={v} />
                                                </Table.Row>
                                            </Table.Body>
                                            )
                                        }
                                    </Table>
                                </Segment>
                        })}
                    </Segment.Group>
                </Segment.Group>

            </Container>
        </ContentHeader >)
}


export default requireAuth(View)