import React, {useEffect, useState} from "react";
import { Line } from 'react-chartjs-2';
import axios from "axios";
import { Table } from "semantic-ui-react";
import _ from "lodash";
import {connect, useDispatch} from "react-redux";
import {fetchCpoTable} from "../redux/actions";
import LoadingStatus from "./templates/LoadingStatus";


const CpoTable = ({cpotable}) => {
    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(fetchCpoTable())
        

    }, [dispatch])
    
    if (_.isNull(cpotable))
        return (<LoadingStatus />)

    return (<>
        {/* <Statistic.Group>
            {cpotable?.map((data)=>{
                return (
                    <>
                        <Statistic>
                            <Statistic.Label>
                                PROD_HI
                            </Statistic.Label>
                            <Statistic.Value>
                                {data['PROD_HI']}
                            </Statistic.Value>
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>
                                PROD_BI
                            </Statistic.Label>
                            <Statistic.Value>
                                {data['PROD_BI']}
                            </Statistic.Value>
                          
                        </Statistic>
                        <Statistic>
                            <Statistic.Label>
                                PROD_SBI
                            </Statistic.Label>
                            <Statistic.Value>
                                {data['PROD_SBI']}
                            </Statistic.Value>
                           
                        </Statistic>
                    </>
                )
            })}
        </Statistic.Group> */}
        <Table celled>
        <Table.Header>
        <Table.Row>
            <Table.HeaderCell>Desc</Table.HeaderCell>
            <Table.HeaderCell>Today</Table.HeaderCell>
            <Table.HeaderCell>MTD</Table.HeaderCell>
            <Table.HeaderCell>YTD</Table.HeaderCell>
        </Table.Row>
        </Table.Header>
        <Table.Body>
            {cpotable?.map((data) => {
                return(<>
                    <Table.Row>
                        <Table.Cell>{data['DESCRIPTION']}</Table.Cell>
                        <Table.Cell>{data['OER_HI']}</Table.Cell>
                        <Table.Cell>{data['OER_BI']}</Table.Cell>
                        <Table.Cell>{data['OER_SBI']}</Table.Cell>
                    </Table.Row>                    
                </>)

            })}
            </Table.Body>
        </Table>
    </>)
}



const mapStateToProps = (state) => {
    console.log(state.dashboard.cpotable)
    return {
        // jsonData: _.filter(state.auth.menu.dashboard, { 'parameter5': 'Card' }),
        cpotable: state.dashboard.cpotable,
        // cpotablebgt: state.dashboard.cpotablebgt
    }

}
export default connect(mapStateToProps, { fetchCpoTable })(CpoTable)

