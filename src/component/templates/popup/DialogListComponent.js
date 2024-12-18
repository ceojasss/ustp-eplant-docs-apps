import React from "react"
import { Segment, Loader, Dimmer } from "semantic-ui-react"

import { connect } from "react-redux"

import { Appresources } from "../ApplicationResources"
import ListComponentAction from "../ListComponentAction"


const DialogListAction = ({ modals }) => {


    return (<Segment basic style={{ height: '10vh', marginTop: '-1.8em' }} >
        {
            (() => {
                if (modals.isloading)
                    return <Dimmer active inverted>
                        <Loader content={Appresources.TRANSACTION_ALERT.LOADING_STATUS} size="huge" />
                    </Dimmer>

                return <ListComponentAction />

                // <ListTableAction as={Grid.Column} columns={columns} data={modals.lovdata.rows} />
            })()
        }


    </Segment>)
}

const mapStateToProps = state => {
    // console.log(state.auth.modals)
    return {
        modals: state.auth.modals,
        column: state.auth.modals.lovdata,
        //column: (state.auth.modals.modals.isl? '' : state.auth.modals.modals.lovdata.metaData)
    }
}


export default connect(mapStateToProps)(DialogListAction) 