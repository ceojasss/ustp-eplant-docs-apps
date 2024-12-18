
import React, { useState } from "react"

import _ from 'lodash'
import { connect, useDispatch, useSelector } from "react-redux"
import { Button, Segment, Grid, Message, Modal, Container, ModalActions, Header } from "semantic-ui-react"
import { RESET_ERROR_MODAL_STATE } from "../../redux/actions/types"
import { Appresources } from "./ApplicationResources"
import "./../Public/CSS/App.css"
import { getFormComponent, getFormListComponent } from "../../utils/FormComponentsHelpler"
import { toast } from "react-toastify"
import { CopyText } from "../../utils/DataHelper"
import { resetErrorTransaction } from "../../redux/actions"

const ErrorMessageContainer = ({ trxError }) => {
    const dispatch = useDispatch()
    const pd = useSelector(state => state.auth.postdata)
    const formComp = getFormComponent()
    const formComps = getFormListComponent()

    const [open, setOpen] = useState(false)


    let messages

    if (!_.isEmpty(pd)) {
        messages = { formComp: formComp, formComps: formComps, data: pd.data }
    }

    if (trxError) {
        if (!_.isEmpty(trxError.error) && !_.isEmpty(pd.data)) {
            return (
                <Grid.Column style={{ marginLeft: '850px', marginTop: '-30px' }}>
                    <Message
                        icon='exclamation'
                        onDismiss={() => { dispatch(resetErrorTransaction()) }}
                        as={Grid.Row.Column}
                        error
                        header={`${Appresources.TRANSACTION_ALERT.TRANSACTION_ERROR}`}
                        list={[trxError.error, trxError.detail,
                        <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                            onOpen={() => setOpen(true)}
                            size="tiny"
                            trigger={<Button negative basic fluid content='Tampilkan Data API Terkirim { jSON }' />}>
                            <Modal.Header>API Data jSON</Modal.Header>
                            <Modal.Content scrolling>{JSON.stringify(messages)} </Modal.Content>
                            <ModalActions>
                                <Button primary icon='copy' content='Copy Data To Clipboard' labelPosition="left"
                                    onClick={() => {
                                        CopyText(JSON.stringify(messages), () => {
                                            setOpen(false)
                                            toast.success('data copied to clipboard..!')
                                        })

                                    }
                                    } />
                                <Button positive onClick={() => setOpen(false)}> Tutup </Button>
                            </ModalActions>
                        </Modal>
                        ]} />
                </Grid.Column >
            )
        }
        else {
            return (
                <Grid.Column style={{ paddingLeft: '80px', marginTop: '-30px' }} >
                    <Message
                        icon='exclamation'
                        size="tiny"
                        error
                        onDismiss={() => { dispatch(resetErrorTransaction()) }}
                        style={{ width: '35vw' }}
                        header={`${Appresources.TRANSACTION_ALERT.TRANSACTION_ERROR}`}
                        content={<div style={{ whiteSpace: "pre-line" }}>
                            {trxError}
                        </div>} />
                </Grid.Column >
            )
        }
    } else {
        return (
            <Message
                as={Grid.Row.Column}
                hidden
            />
        )
    }
}

const mapStateToProps = (state) => {

    return {

        trxError: state.auth.transactionError
    }
}

export default connect(mapStateToProps)(ErrorMessageContainer)

