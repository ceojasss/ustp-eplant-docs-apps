import React, { useEffect, useState } from "react";
import { useDispatch, connect, useSelector } from "react-redux";
import { Button, ButtonGroup, Container, Header } from "semantic-ui-react";
import { setLoadingModalBtn, setModalStates } from "../../../redux/actions";
import { Appresources } from "../ApplicationResources";
import ReactDatePicker from "react-datepicker";

const Confirmation = ({ modals }) => {
    const dispatch = useDispatch()

    let periode = new Date(useSelector((state) => state.auth.tableDynamicControl.dateperiode))
    let startperiode = new Date(periode.getFullYear(), periode.getMonth(), 1)
    //let endperiode = new Date(periode.getFullYear(), periode.getMonth() + 1, 0)

    const [dates, setDates] = useState(new Date());

    useEffect(() => {
        setDates(startperiode)
    }, [])

    let _content = Appresources.BUTTON_LABEL.LABEL_APPROVE;

    return (
        <Container style={{ paddingLeft: '0.8cm' }}>
            <Header content={modals.message} />
            <ReactDatePicker
                portalId="root-portal"
                openToDate={dates}
                inline
                selected={dates}
                onChange={(date) => setDates(date)}
                minDate={startperiode}
                adjustDateOnChange />
            <ButtonGroup widths={3}
                compact
                fluid>
                <Button basic
                    floated='left'
                    negative
                    onClick={() => dispatch(setModalStates(Appresources.BUTTON_LABEL.LABEL_CANCEL))}
                    content={Appresources.BUTTON_LABEL.LABEL_CANCEL}
                    icon='cancel' labelPosition='left'
                    style={{ marginRight: '0.5cm' }}
                />
                <Button
                    positive={_content === Appresources.BUTTON_LABEL.LABEL_DELETE ? false : true}
                    negative={_content === Appresources.BUTTON_LABEL.LABEL_DELETE ? true : false}
                    style={{ marginLeft: '0.5cm' }}
                    onClick={() => dispatch(setLoadingModalBtn(_content, { values: _content, approveDate: dates }))}
                    content={_content}
                    icon='right arrow' labelPosition='right'
                //loading={modals.isloading}
                />
            </ButtonGroup>

        </Container>
    )
}


const mapStateToProps = state => {
    return {
        modals: state.auth.modals,
    }
}

export default connect(mapStateToProps)(Confirmation) 