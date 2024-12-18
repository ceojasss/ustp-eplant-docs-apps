import React, { useRef, useState, useEffect, useMemo } from "react"
import { useDispatch, connect } from 'react-redux'
import { Button, Divider, Form as FormUI, Grid, Header, Icon, Search, Segment, Table } from 'semantic-ui-react'
import { useForm, FormProvider } from "react-hook-form";
import _ from 'lodash'
import * as yup from 'yup'
import { useNavigate, useLocation, useParams } from "react-router-dom";

// *library imports placed above ↑
// *local imports placed below ↓

import ContentHeader from '../../../templates/ContentHeader'
import { ShowLov, resetLov, DialogConfirmation, resetTransaction } from "../../../../redux/actions"
import LoadingStatus from "../../../templates/LoadingStatus";
import ComponentAdaptersGroup from "../../../templates/forms/ComponentAdaptersGroup";
import { getFormComponent, InitValidation, useYupValidationResolver } from "../../../../utils/FormComponentsHelpler";

import '../../../Public/CSS/App.css'
import eplant from "../../../../apis/eplant";
import downloadclient from "../../../../apis/downloadclient";


const Form = ({ title, actions, formComps, initialValues, postdata, formValidationSchema, submitdata, actionlabel, resetTrx }) => {


    const { route } = useParams();
    const [isload, setLoading] = useState(false)

    const runreport = async () => {


        await downloadclient.get('/generate/test?0=9&1=2022', {}).then(response => {




            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'download.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();

            setLoading(false)

        })




    }



    const RenderForm = useMemo(() => {
        return <Segment raised style={{ width: '100%', marginLeft: "10px", marginRight: "70px", height: '60vh' }}>
            <Grid columns={2} stackable/*  textAlign='center' */>
                {/* <Divider vertical>Or</Divider> */}
                <Grid.Row  >
                    <Grid.Column color="yellow">
                        <Header content="List Report" />
                        <Table fixed celled selectable compact singleLine  >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Report</Table.HeaderCell>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>JohnJohnJohnJohnJohnJohnJohnJohn JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn</Table.Cell>
                                    <Table.Cell>No Action</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jamie</Table.Cell>
                                    <Table.Cell>Approved</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jill</Table.Cell>
                                    <Table.Cell>Denied</Table.Cell>
                                </Table.Row>
                                <Table.Row warning>
                                    <Table.Cell>John</Table.Cell>
                                    <Table.Cell>No Action</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jamie</Table.Cell>
                                    <Table.Cell positive>Approved</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jill</Table.Cell>
                                    <Table.Cell negative>Denied</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>JohnJohnJohnJohnJohnJohnJohnJohn JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn</Table.Cell>
                                    <Table.Cell>No Action</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jamie</Table.Cell>
                                    <Table.Cell>Approved</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jill</Table.Cell>
                                    <Table.Cell>Denied</Table.Cell>
                                </Table.Row>
                                <Table.Row warning>
                                    <Table.Cell>John</Table.Cell>
                                    <Table.Cell>No Action</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jamie</Table.Cell>
                                    <Table.Cell positive>Approved</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jill</Table.Cell>
                                    <Table.Cell negative>Denied</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>JohnJohnJohnJohnJohnJohnJohnJohn JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn</Table.Cell>
                                    <Table.Cell>No Action</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jamie</Table.Cell>
                                    <Table.Cell>Approved</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jill</Table.Cell>
                                    <Table.Cell>Denied</Table.Cell>
                                </Table.Row>
                                <Table.Row warning>
                                    <Table.Cell>John</Table.Cell>
                                    <Table.Cell>No Action</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jamie</Table.Cell>
                                    <Table.Cell positive>Approved</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jill</Table.Cell>
                                    <Table.Cell negative>Denied</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>

                    <Grid.Column color="red">
                        <Header content="Parameters" />
                        <Button primary onClick={() => {
                            setLoading(true);
                            runreport()
                        }} loading={isload} >Create</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment >
        /* return 
            <FormUI as={'form'} >
                <AsyncSelect />
            </FormUI>
        </Segment>
    */

    }, [isload])

    return (
        <ContentHeader
            title={title}
            btn1={null}
            children={RenderForm} />
    );

}

const mapStateToProps = (state) => {

    // console.log(state)
    return {
        actions: state.auth.modals.actionpick,
        formComps: getFormComponent(),
        postdata: _.isNil(state.auth.postdata) ? null : state.auth.postdata.data,
        formValidationSchema: state.auth.formValidationSchema,
        submitdata: _.isNil(state.auth.submitdata) ? null : state.auth.submitdata,
        resetTrx: state.auth.resetTrx,
        actionlabel: state.auth.actionlabel,
    }
}

export default connect(mapStateToProps, { DialogConfirmation })(Form)