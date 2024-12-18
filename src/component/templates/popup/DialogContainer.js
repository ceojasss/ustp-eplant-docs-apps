import React from "react";
import { connect } from "react-redux";
import { Container, Divider, Header, List, Segment } from "semantic-ui-react";
import _ from 'lodash'

import { Appresources } from "../ApplicationResources";
import DialogListAction from "./DialogListAction";
import DialogConfirm from "./DialogConfirm";
import DialogListOfValues from "./DialogListOfValues";
import DialogLoading from "./DialogLoading";
import DialogListLinkedData from "./DialogListLinkedData";
import DialogListCompany from "./DialogListCompany";
import DialogReportData from "./DialogReportData";
import DialogInputGrid from "./DialogInputGrid";
import Confirmation from "./Confirmation";
import CnR from "./ConfirmAndReject";
import DialogListComponent from "./DialogListComponent";
import ConfirmWithDate from "./ConfirmWithDate";
import DialogListViewData from "./DialogListViewData";
import DialogListViewDataLazy from "./DialogListViewDataLazy";
import DialogScanQR from "./DialogScanQR";
import DialogWebcam from "./DialogWebcam";
import DialogScanComponentQR from "./DialogScanComponentQR";
import DialogListLinkedDataHeader from "./DialogListLinkedDataHeader";
import ConfirmWithNotes from "./ConfirmWithNotes";




const ListExampleDivided = ({ inserts, updates, deletes }) => {

    const ListInfo = ({ message, count, header, icons, colorcode }) => < List.Item >
        <List.Icon color={colorcode} name={icons} size='large' verticalAlign='middle' />
        <List.Content>
            <List.Header style={{ color: colorcode }} content={header} />
            <List.Description content={`${count} Data Will Be ${message}`} />
        </List.Content>
    </List.Item >



    return <List divided relaxed>
        {_.size(inserts) > 0 && <ListInfo message='Created' count={_.size(inserts)} header='Insert' icons='plus square outline' colorcode='green' />}
        {_.size(updates) > 0 && <ListInfo message='Updated' count={_.size(updates)} header='Changes' icons='write square' colorcode='blue' />}
        {_.size(deletes) > 0 && <ListInfo message='Removed' count={_.size(deletes)} header='Delete' icons='trash alternate outline' colorcode='red' />}
    </List>
}


const DialogContainer = ({ modals, postdatas }) => {



    const DialogFailed = () => {
        return (<div>
            <Segment basic padded textAlign='center' >
                <Header as='h2' textAlign='center' icon='dont' content='API Not Found !' />
            </Segment>
        </div>
        )
    }


    if (modals.contentType === Appresources.TRANSACTION_ALERT.DIALOG_SCAN_QR)
        return <DialogScanQR />
        
    if (modals.contentType === Appresources.TRANSACTION_ALERT.DIALOG_WEBCAM)
        return <DialogWebcam datas={modals}/>

    if (modals.contentType === Appresources.TRANSACTION_ALERT.DIALOG_COMPONENT_QR)
        return <DialogScanComponentQR />

    return (
        <Container >
            <Header as={'h2'} content={modals.content} style={{ marginLeft: '1em' }} />
            <Divider as={Segment.basic} style={{ marginLeft: '1.8em', marginRight: '1em' }} />
            {(!_.isEmpty(postdatas) && modals.contentType === Appresources.TRANSACTION_ALERT.DIALOG_CONFIRM) && <Header as={'h4'} content={<ListExampleDivided {...postdatas} />} style={{ marginLeft: '3em' }} />}
            {
                (() => {
                    switch (modals.contentType) {
                        case Appresources.TRANSACTION_ALERT.LOADING_FAILED:
                            return <DialogFailed />
                        case Appresources.TRANSACTION_ALERT.LOV:
                            return <DialogListOfValues />
                        case Appresources.TRANSACTION_ALERT.LOV_ACTION:
                            return <DialogListAction />
                        case Appresources.TRANSACTION_ALERT.LOV_ACTION_COMPONENT:
                            return <DialogListComponent />
                        case Appresources.TRANSACTION_ALERT.LOV_LINKED_DATA:
                            return <DialogListLinkedData />
                        case Appresources.TRANSACTION_ALERT.LOV_LINKED_DATA_HEADER:
                            return <DialogListLinkedDataHeader />
                        case Appresources.TRANSACTION_ALERT.LOV_VIEW_DATA:
                            return <DialogListViewData />
                        case Appresources.TRANSACTION_ALERT.LOV_VIEW_DATA_BASIC:
                            return <DialogListViewDataLazy />
                        case Appresources.TRANSACTION_ALERT.LOV_REPORT_DATA:
                            return <DialogReportData />
                        case Appresources.TRANSACTION_ALERT.DIALOG_COMPANY:
                            return <DialogListCompany />
                        case Appresources.TRANSACTION_ALERT.CUSTOM_CONFIRMATION:
                            return <Confirmation />
                        case Appresources.TRANSACTION_ALERT.CONFIRMATION_NOTES:
                            return <ConfirmWithNotes />
                        case Appresources.TRANSACTION_ALERT.CONFIRMATION_OR_REJECT:
                            return <CnR />
                        case Appresources.TRANSACTION_ALERT.DATE_CONFIRMATION:
                            return <ConfirmWithDate />
                        case Appresources.TRANSACTION_ALERT.INPUT_ON_DIALOG:
                            return <DialogInputGrid />
                        case Appresources.TRANSACTION_ALERT.DIALOG_LOADING:
                        case Appresources.TRANSACTION_ALERT.SAVE_PROCESS:
                        case Appresources.TRANSACTION_ALERT.UPDATE_PROCESS:
                        case Appresources.TRANSACTION_ALERT.LOADING_STATUS:
                            return <DialogLoading message={modals.contentType} />
                        default:
                            return <DialogConfirm />
                    }
                    //} 
                })()
            }
        </Container>)

}

const mapStateToProps = (state) => {

    //// console.log(state.auth.postdata)
    return {
        modals: state.auth.modals,
        postdatas: !_.isEmpty(state.auth.postdata) && state.auth.postdata.data
    }

}

export default connect(mapStateToProps)(DialogContainer)
//export default connect(mapStateToProps, { resetModalStates, setModalStates })(ContentHeader) 