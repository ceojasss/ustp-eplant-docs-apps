import React, { useMemo, useRef } from "react"
import { Segment, Grid, Loader, Dimmer } from "semantic-ui-react"
import _ from 'lodash'
import { connect } from "react-redux"

import ListTableAction from "../LovTable"
import { Appresources } from "../ApplicationResources"


const DialogListofValues = ({ modals, column }) => {
    const searchRef = useRef(null);
    const columns = useMemo(() => _.map(modals.lovdata.metaData, ({ name }) => ({ header: name, accessor: name })), [column])

    // console.log('open modal')

    if (!_.isEmpty(searchRef.current))
        searchRef.current.focus();

    return (<Segment basic /*style={{ height: '60vh', marginTop: '-1.8em' }}*/ >
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
        column: state.auth.modals.lovdata
    }
}


export default connect(mapStateToProps)(DialogListofValues) 