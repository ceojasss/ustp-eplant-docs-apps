import React, { useMemo } from "react"
import { Segment, Loader, Dimmer, Button, Container } from "semantic-ui-react"
import _ from 'lodash'
import { connect } from "react-redux"
import { Appresources } from "../ApplicationResources"
import '../../Public/CSS/App.css'

const DialogReportData = ({ modals }) => {


    const ButtonReport = useMemo(() => {

        let url_preview = _.mapKeys(modals.result, function (value, key) {
            return key.match(/^v_url_preview.*$/)
        })

        url_preview = Object.values(_.omit(url_preview, null))

        return _.map(modals.count, (r, idx) => <Button
            key={`R.${idx}`}
            color="red"
            // basic
            icon={'file pdf outline'}
            className="btnControlView"
            // style={{ display: r.hidden }}
            content={`View Report ${r.input.replace('v_url_preview', '') && r.input.replace('v_url_preview_', '')} `}
            // floated="center"
            onClick={() => { window.open(url_preview[idx]) }}
            size="small"
            labelposition="center" />)
    }, [modals])

    return (<Segment basic  >
        {
            (() => {
                if (modals.isloading)
                    return <Dimmer active inverted>
                        <Loader content={Appresources.TRANSACTION_ALERT.LOADING_STATUS} size="huge" />
                    </Dimmer>
                return <> <Container textAlign={"center"}>
                    {ButtonReport}
                </Container>
                    {/* <Buttons modals={modals}/> */}
                </>
            })()
        }
    </Segment >)
}

const mapStateToProps = state => {
    // // console.log(state.auth.modals)
    return {
        modals: state.auth.modals,
    }
}


export default connect(mapStateToProps)(DialogReportData) 