import React, { useMemo } from "react"
import { Segment, Grid, Loader, Dimmer } from "semantic-ui-react"
import _ from 'lodash'
import { connect } from "react-redux"

import ListTableAction from "../ListTableAction"
import { Appresources } from "../ApplicationResources"


const DialogListAction = ({ modals }) => {

    const columns = useMemo(() => _.map(modals.lovdata.metaData, ({ name }) => ({ header: name, accessor: name })), [modals.lovdata.metaData])

    return (<Segment basic style={{ height: '60vh', marginTop: '-1.8em' }} >
        {
            (() => {
                if (modals.isloading)
                    return <Dimmer active inverted>
                        <Loader content={Appresources.TRANSACTION_ALERT.LOADING_STATUS} size="huge" />
                    </Dimmer>

                return <ListTableAction as={Grid.Column} columns={columns} data={modals.lovdata.rows} />
            })()
        }


    </Segment>)
}

const mapStateToProps = state => {
    return {
        modals: state.auth.modals,
        column: state.auth.modals.lovdata,
        //column: (state.auth.modals.modals.isl? '' : state.auth.modals.modals.lovdata.metaData)
    }
}


export default connect(mapStateToProps)(DialogListAction) 