import React from 'react'
import { Loader, Dimmer, Grid } from 'semantic-ui-react'
import { Appresources } from './ApplicationResources'

const LoadingModules = () =>
(
    <Grid centered style={{ paddingTop: "25%" }}>
        <Dimmer active inverted>
            <Loader size='huge' content={Appresources.TRANSACTION_ALERT.LOADING_MDOULES} />
        </Dimmer>
    </Grid>
)


export default LoadingModules