import React, { useMemo } from "react"
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Grid, Header, Icon, Label } from "semantic-ui-react"
import _ from 'lodash'



const NavigationHeader = ({ buttons, buttonReport, transactionStatus, actionlabel, actionstatus, modaltrx, buttonBackHandler, isUpdate }) => {

    const navigate = useNavigate()
    const location = useLocation();
    const arrNav = location.pathname.split('/')

    let trxnav = arrNav[3] === undefined ? '' : arrNav[3]


    const ButtonReport = useMemo(() => {
        return _.map(buttonReport, (r, idx) => <Button
            key={`R.${idx}`}
            color={_.isUndefined(r.color) ? "red" : r.color}
            basic={_.isUndefined(r.btnBasic) ? false : r.btnBasic}
            icon={r.btnIcon}
            className="btnControlView"
            style={{ display: r.hidden }}
            content={r.btnTitle}
            floated="right"
            onClick={r.reportHandler}
            size="tiny"
            labelposition="right" />)
    }, [buttonReport])

    const handlerBack = () => {

        if (_.isUndefined(buttonBackHandler)) {
            navigate(-1)

        } else {
            buttonBackHandler()
        }

    }

    if (buttons?.type === 'icon') {
        return <Grid.Column floated='left'
            width={5}
 /*            style={{ paddingTop: '1cm' }} */>
            {/* <Icon link
                size="large"
                style={{ marginLeft: '0.1cm', paddingTop: '0.4cm' }}
                name={buttons?.btnIcon}
                onClick={buttons?.addClickHandler}
            /> */}
            <Header
                as='h5'
                style={{ marginLeft: '0.1cm', paddingTop: '0.4cm' }}>
                <Icon className="tooltip"
                    link
                    name={buttons?.btnIcon}
                    color={buttons?.color}
                    onClick={buttons?.addClickHandler}>
                    <span className={"tooltiptextTop"}
                        style={{ marginLeft: '1px' }}
                    >{`Change ${buttons?.btnLabel}`}</span>
                </Icon>
                <Header.Content  >{buttons?.btnLabel} </Header.Content>
            </Header>
        </Grid.Column >
        /*   <Icon link
          size="large"
          style={{ marginLeft: '0.4cm', paddingTop: '0.4cm' }}
          name={buttons?.btnIcon}
          onClick={buttons?.addClickHandler}
      /> */
    } else {


        if (trxnav.match(/^(new|edit|mango|pineapple)$/)) {

            return (
                <Grid.Column floated='left' width={15} style={{ marginLeft: '0.8cm' }}  >
                    <Button
                        primary
                        icon='reply'
                        className="btnControlAdd"
                        style={{ marginLeft: '-0.4cm' }}
                        content='Kembali'
                        floated="left"
                        onClick={handlerBack}
                        size="tiny"
                        labelposition="left"
                    />
                    {isUpdate != 'V' && <Button
                        positive
                        icon={buttons.btnIcon}
                        className="btnControlAdd"
                        style={{ marginLeft: '10px' }}
                        content={actionlabel}
                        floated="left"
                        disabled={!actionstatus}
                        onClick={buttons.addClickHandler}
                        size="tiny"
                        // size="tiny"
                        labelposition="right"
                    />}
                    {!_.isUndefined(buttonReport) &&
                        ButtonReport
                    }
                    {!_.isEmpty(transactionStatus) &&
                        <Label basic
                            size="large"
                            color='green'
                            content='Data Saved'
                            icon='checkmark'
                            style={{ marginLeft: '10px', marginTop: '1px' }}
                        />
                    }
                </Grid.Column >)
        } else {
            return (
                // <Grid.Column floated='left' width={5} style={{ marginTop: '5px' }}>
                <Grid.Column floated='left'
                    width={5}
                    style={{ marginTop: '10px' }}>
                    <Button
                        positive
                        //disabled
                        icon={buttons?.btnIcon}
                        className="btnControlAdd"
                        content={buttons?.btnLabel}
                        onClick={buttons?.addClickHandler}
                        size="mini"
                        disabled={buttons?.disabled === 'true' ? true : false}
                        labelposition="right"
                    />

                </Grid.Column >)
        }

    }
}


const mapStateToProps = (state) => {
    //// console.log(state.auth)
    return {
        transactionStatus: state.auth.transactionStatus,
        actionlabel: state.auth.actionlabel,
        actionstatus: state.auth.actionstatus,
        modaltrx: null,//state.auth.modalstrx,
        isUpdate: !_.isNil(state.auth.activeProps) ? state.auth.activeProps.isupdate : null
    }
}

export default connect(mapStateToProps)(NavigationHeader)