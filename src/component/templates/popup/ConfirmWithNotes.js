import React, { useEffect, useState } from "react";
import { useDispatch, connect, useSelector } from "react-redux";
import { Button, Container, Header, Segment } from "semantic-ui-react";
import { setLoadingModalBtn, setModalStates } from "../../../redux/actions";
import { Appresources } from "../ApplicationResources";

const ConfirmationWithNotes = ({ modals }) => {
    const dispatch = useDispatch()

    const [notes, setNotes] = useState('');

    let _content = modals.message

    return (
        <Container style={{ paddingLeft: '0.8cm' }}>
            <Header content={`*** Catatan ${_content}`} />
            <textarea style={{ width: '100%', height: '5em' }} onBlur={(e) => setNotes(e.target.value)} />
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
                    onClick={() => dispatch(setLoadingModalBtn(_content, { values: _content, notes: notes }))}
                    content={_content}
                    icon='right arrow' labelPosition='right'
                //loading={modals.isloading}
                />
            </Segment>
            {notes}
        </Container>

    )
}


const mapStateToProps = state => {
    return {
        modals: state.auth.modals,
    }
}

export default connect(mapStateToProps)(ConfirmationWithNotes) 