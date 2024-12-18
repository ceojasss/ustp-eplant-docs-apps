import React from "react";
import { useDispatch, connect } from "react-redux";
import { Button, Segment } from "semantic-ui-react";
import { setLoadingModalBtn, setModalStates } from "../../../redux/actions";
import { Appresources } from "../ApplicationResources";

const Confirmation = ({ modals }) => {
    const dispatch = useDispatch()

    // // console.log('LOD GIADLOG', modals)

    console.log(modals)

    let _content = modals.message

    return (
        <Segment basic floated="right">
            <Button basic
                negative
                onClick={() => dispatch(setModalStates(Appresources.BUTTON_LABEL.LABEL_CANCEL))}
                content={Appresources.BUTTON_LABEL.LABEL_CANCEL}
                icon='cancel' labelPosition='left'
            />
            <Button
                positive={[Appresources.BUTTON_LABEL.LABEL_DELETE, Appresources.BUTTON_LABEL.LABEL_REJECT].includes(_content) ? false : true}
                negative={[Appresources.BUTTON_LABEL.LABEL_DELETE, Appresources.BUTTON_LABEL.LABEL_REJECT].includes(_content) ? true : false}
                onClick={() => dispatch(setLoadingModalBtn(_content, modals.selectedvalue))}
                content={_content}
                icon='right arrow' labelPosition='right'
            //loading={modals.isloading}
            />
        </Segment>

    )
}


const mapStateToProps = state => {
    return {
        modals: state.auth.modals,
    }
}

export default connect(mapStateToProps)(Confirmation) 