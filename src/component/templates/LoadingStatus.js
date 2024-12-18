import React from 'react'
import { Loader, Dimmer, Grid } from 'semantic-ui-react'
import { Appresources } from './ApplicationResources'
import _ from 'lodash'

const LoadingStatus = ({ msg, sizes }) =>
(
    <Grid centered style={{ paddingTop: "25%" }}>
        <Dimmer active inverted>
            <Loader
                size={_.isUndefined(sizes) ? 'huge' : sizes}
                content={_.isEmpty(msg) ? Appresources.TRANSACTION_ALERT.LOADING_STATUS : msg} />
        </Dimmer>
    </Grid>
)


export default LoadingStatus
