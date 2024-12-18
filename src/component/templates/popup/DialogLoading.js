import React from "react"
import { Segment, Loader, Dimmer } from "semantic-ui-react"


const DialogLoading = ({ message }) => {

    //    // console.log('masukklk', props)

    return (<Segment basic style={{ height: '10vh', marginTop: '-1.8em' }}>
        <Dimmer active inverted>
            <Loader content={message} size="huge" />
        </Dimmer>
    </Segment>)
}

export default (DialogLoading) 