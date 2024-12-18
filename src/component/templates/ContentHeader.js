import React, { useEffect } from "react";
import _ from 'lodash';
import { Container, Header, Segment, Breadcrumb, Grid, Divider, Message } from "semantic-ui-react";
import { connect, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';

// *library imports placed above ↑
// *local imports placed below ↓
import { resetModalStates, setModalStates } from "../../redux/actions"

import DatePeriodHeader from "./main_container/DatePeriodHeader";
import Modals from "./popup/Modals"
import { Appresources } from "./ApplicationResources";
import { BreadcrumbNavs } from "./main_container/BreadCrumbsNav";
import { RESET_MODAL } from "../../redux/actions/types";
import DialogContainer from "./popup/DialogContainer";
import ErrorMessageContainer from "./ErrorMessageContainer";
import NavigationHeader from "./main_container/NavigationHeader";
import PeriodHeader from "./main_container/PeriodHeader";
import SearchHeader from "./main_container/SearchHeader";
import { APP_TITLES } from "../Constants";
import { ErrorData } from "../../utils/DataHelper";
import { getFormComponent, getFormListComponent } from "../../utils/FormComponentsHelpler";


import 'react-toastify/dist/ReactToastify.css'
import FilterHeader from "./main_container/FilterHeader";
import FilterHeader2 from "./main_container/FilterHeader2";

const ErrorBox = ({ errorData }) => <Message
    negative
    icon='unlinkify'
    header='Fetching Data Error'
    content={errorData}
    style={{ marginRight: '2cm' }}
/>

const ContentHeader = ({ children, title, btn1, btn2, caltype, searchaction, filteraction, filteraction2, periodaction, modalContent, modalResult, modalState, errorData, sidebarvisible }) => {
    const dispatch = useDispatch()

    document.title = ` ${APP_TITLES} - ${title}`

    // * README: HANDLE CRUD STATUS

    useEffect(() => {
        if (modalResult) {

            document.querySelector("#root").removeAttribute("inert");

            const { error, detail } = modalContent
            const options = {
                onOpen: () => dispatch({ type: RESET_MODAL }),
                autoClose: 2000,
                hideProgressBar: false,
                position: toast.POSITION.TOP_CENTER,
                pauseOnHover: true,
                theme: 'colored'
                // and so on ...
            };

            if (error) {
                toast.error(Appresources.TRANSACTION_ALERT.SAVE_FAILED, options)
            }
            else {
                toast.success(modalResult, options)
            }
        }

    }, [modalResult])

    //  console.log('filter', filteraction, filteraction2)

    return (
        <React.Fragment>
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                style={{ marginLeft: '-10%' }}
            />
            <Segment basic style={{ marginLeft: '30px', marginTop: '3px', paddingTop: '2px', paddingBottom: '5px' }}>
                <Header as={'h2'} floated="left" content={title} />
                {!sidebarvisible && <Breadcrumb style={{ paddingTop: '10px' }}  ><BreadcrumbNavs /> </Breadcrumb>}
            </Segment>
            {!sidebarvisible ? <Divider style={{ marginTop: '-10px', marginLeft: '10px', marginRight: 'auto' }} /> :
                <Divider style={{ marginTop: '30px', marginLeft: '10px', marginRight: '280px' }} />}
            <Container key='content-container' as={Segment} basic style={{ width: 'auto', marginRight: '100px' }}>
                <Grid style={{ width: (!sidebarvisible ? '100%' : '85%') }} >
                    {sidebarvisible && <Grid.Row><Grid.Column style={{ marginTop: '-20px' }} as={Breadcrumb} children={<BreadcrumbNavs />} /></Grid.Row>}
                    <Grid.Row style={sidebarvisible ? { marginTop: '-20px', marginLeft: '0.4cm' } : { marginLeft: '0.7cm' }}>
                        {!_.isUndefined(errorData) ? '' : btn1 && <NavigationHeader buttons={btn1} buttonReport={btn2} />}
                        <ErrorMessageContainer />
                        {!_.isUndefined(filteraction) && <FilterHeader searchaction={filteraction} />}
                        {!_.isUndefined(filteraction2) && <FilterHeader2 searchaction={filteraction2} />}
                        {!_.isUndefined(caltype) ? caltype === 'false' ? <PeriodHeader periodaction={periodaction} /> : <DatePeriodHeader periodaction={periodaction} /> : <PeriodHeader periodaction={periodaction} />}
                        {!_.isUndefined(searchaction) ? <SearchHeader searchaction={searchaction} /> : <Grid.Column floated='right' width={2} ></Grid.Column>}
                        {/*  {!_.isUndefined(searchaction) && <SearchHeader searchaction={searchaction} />} */}
                    </Grid.Row>
                    <Grid.Row style={sidebarvisible ? { paddingLeft: '0.1cm', innerHeight: '100%', paddingRight: '0.15cm', marginTop: '-10px' }
                        : { paddingLeft: '0.5cm', innerHeight: '100%', paddingRight: '0.5cm', marginTop: '-10px' }} >
                        {!_.isEmpty(errorData) ? <ErrorBox errorData={errorData} /> : children}
                    </Grid.Row>
                </Grid>
                {modalState && <Modals onClose={() => dispatch(setModalStates(''))} open={(modalState === undefined ? false : modalState)} >
                    <DialogContainer />
                </Modals >}
            </Container>
        </React.Fragment >)
}

const mapStateToProps = (state) => {
    //  console.log(getFormComponent())
    return {
        dateperiode: state.auth.tableDynamicControl.dateperiode,
        button: _.filter(state.auth.menu.dashboard, { 'parameter5': 'Card' }),
        modalResult: state.auth.modals.result,
        modalContent: state.auth.modals.content,
        modalState: state.auth.modals.state,
        errorData: ErrorData(),
        sidebarvisible: state.auth.sidevisible,
        caltype: !_.isNil(getFormListComponent()) ? _.size(getFormListComponent()) > 0 ? _.get(getFormListComponent()[0], 'caltype') : _.get(getFormComponent()[0], 'caltype') : null
    }
}

export default connect(mapStateToProps, { resetModalStates, setModalStates })(ContentHeader)