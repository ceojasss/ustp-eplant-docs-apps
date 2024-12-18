import React from "react";
import { useDispatch, connect } from "react-redux";
import { Button, Segment } from "semantic-ui-react";
import { setLoadingModalBtn, setModalStates } from "../../../redux/actions";

import { Appresources } from "../ApplicationResources";


const DialogConfirm = ({ modals }) => {

    const dispatch = useDispatch()

    let _content

    console.log(modals.content)

    switch (modals.content) {
        case Appresources.TRANSACTION_ALERT.SAVE_CONFIRMATION:
        case Appresources.TRANSACTION_ALERT.SAVE_APPROVED_CONFIRMATION:
            _content = Appresources.BUTTON_LABEL.LABEL_SAVE
            break;
        case Appresources.TRANSACTION_ALERT.UPDATE_CONFIRMATION:
            _content = Appresources.BUTTON_LABEL.LABEL_UPDATE
            break;
        case Appresources.TRANSACTION_ALERT.DELETE_CONFIRMATION:
            _content = Appresources.BUTTON_LABEL.LABEL_DELETE
            break;
        default:
            _content = ''
            break;
    }

    return (
        <Segment basic floated='right'>
            <Button basic
                negative
                onClick={() => dispatch(setModalStates(Appresources.BUTTON_LABEL.LABEL_CANCEL))}
                content={Appresources.BUTTON_LABEL.LABEL_CANCEL}
            />
            <Button
                positive={[Appresources.BUTTON_LABEL.LABEL_DELETE, Appresources.BUTTON_LABEL.LABEL_REJECT].includes(_content) ? false : true}
                negative={[Appresources.BUTTON_LABEL.LABEL_DELETE, Appresources.BUTTON_LABEL.LABEL_REJECT].includes(_content) ? true : false}
                onClick={() => dispatch(setLoadingModalBtn(_content, modals.selectedvalue))} //dispatch(setModalStates(_content, extras))}
                content={_content}
                loading={modals.isloading}
            />
        </Segment>

    )
}

const mapStateToProps = state => {
    return {
        modals: state.auth.modals,
    }
}


export default connect(mapStateToProps)(DialogConfirm) 