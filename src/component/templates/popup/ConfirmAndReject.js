import React, { useState } from "react";
import _ from 'lodash'
import { useDispatch, connect } from "react-redux";
import { Button, Form, Grid, Header, TextArea } from "semantic-ui-react";
import { setLoadingModalBtn, setModalStates } from "../../../redux/actions";
import { Appresources } from "../ApplicationResources";

const CnR = ({ modals }) => {
    const dispatch = useDispatch()

    const [reject, diReject] = useState(false)
    const [rejectNotes, SetRejectNotes] = useState('')
    const [rejectWarning, setWarning] = useState('')



    let _content = modals.message



    return <Grid style={{ marginLeft: '10px' }}>
        {reject &&
            <>
                <Grid.Row columns={4} >
                    <Header as='h4'
                        icon={(!_.isEmpty(rejectWarning) ? 'warning sign' : 'pencil')}
                        content={(!_.isEmpty(rejectWarning) ? rejectWarning : 'Rejection Notes')}
                        color={(!_.isEmpty(rejectWarning) ? 'red' : 'blue')}
                        style={{ marginLeft: '15px' }}
                    />
                    <Grid.Column stretched width={16} >
                        <Form focus>
                            <TextArea rows={4}
                                style={{ fontSize: '12pt' }}
                                value={rejectNotes}
                                onChange={async (e, data) => {
                                    SetRejectNotes(data.value)
                                    setWarning('')
                                }} />
                        </Form>
                    </Grid.Column>
                </Grid.Row>

            </>
        }
        <Grid.Row columns={4}>
            <Grid.Column floated="left" stretched  >
                <Button
                    negative
                    onClick={() => {
                        if (!reject) {
                            diReject(true)

                        } else {
                            if (_.isEmpty(rejectNotes)) {
                                setWarning('Rejection Notes Tidak Boleh Kosong')
                            } else {
                                dispatch(setLoadingModalBtn(Appresources.BUTTON_LABEL.LABEL_LANJUT_REJECT, null, rejectNotes))
                            }
                        }
                    }}
                    content={(reject ? Appresources.BUTTON_LABEL.LABEL_LANJUT_REJECT : Appresources.BUTTON_LABEL.LABEL_REJECT)}
                    icon='thumbs down'
                    labelPosition='left'
                    floated="left"
                />
            </Grid.Column>
            <Grid.Column floated="right" stretched={reject}>
                <Button basic
                    negative
                    onClick={() => dispatch(setModalStates(Appresources.BUTTON_LABEL.LABEL_CANCEL))}
                    content={Appresources.BUTTON_LABEL.LABEL_CANCEL}
                    icon='cancel' labelPosition='left'
                />
                {!reject &&
                    <Button
                        positive={_content === Appresources.BUTTON_LABEL.LABEL_DELETE ? false : true}
                        negative={_content === Appresources.BUTTON_LABEL.LABEL_DELETE ? true : false}
                        onClick={() => dispatch(setLoadingModalBtn(_content, modals.selectedvalue))}
                        content={_content}
                        icon='right arrow'
                        labelPosition='right'
                    //loading={modals.isloading}
                    />}
            </Grid.Column>
        </Grid.Row>
    </Grid >
}


const mapStateToProps = state => {
    return {
        modals: state.auth.modals,
    }
}

export default connect(mapStateToProps)(CnR) 