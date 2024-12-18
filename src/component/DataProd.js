import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {Statistic} from "semantic-ui-react";
import _ from "lodash";
import {connect, useDispatch} from "react-redux";
import {fetchChart , fetchDasboard} from "../redux/actions";
import LoadingStatus from "./templates/LoadingStatus";


const CardData = ({chart}) => {
    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(fetchChart())
        

    }, [dispatch])
    
    if (_.isNull(chart))
        return (<LoadingStatus />)

    return (<>
        <Statistic.Group>
            {chart?.map((data)=>{
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
        </Statistic.Group>
    </>)
}



const mapStateToProps = (state) => {
    console.log(state.dashboard.chart)
    return {
        // jsonData: _.filter(state.auth.menu.dashboard, { 'parameter5': 'Card' }),
        chart: state.dashboard.chart,
        // chartbgt: state.dashboard.chartbgt
    }

}
export default connect(mapStateToProps, { fetchChart })(CardData)

