import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import PieChart from "../../../../../templates/PieChart";

const Lists = ({ fetchbreeder, p_date, p_site,title='Breeding' }) => {

  const containerStyle = {
    width:'45vh',
    height: '40vh',
  };

  const dispatch = useDispatch();

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels:{
          padding:10,
        }
      },
    },
  };

  const chartData = fetchbreeder?.map((data) => ({
    BREEDER: data["BREEDER"],
    PCT: data["PCT"],
  }));

  const labels = chartData?.map((data) => data.BREEDER);

  const data = {
    labels,
    datasets: [
      {
        data: chartData?.map((data) => data.PCT),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF8F00",
          "#00C853",
          "#9C27B0",
          // Add more colors as needed
        ],
        borderColor: "black",
        borderWidth: 0.5,
      },
    ],
    options,
  };

  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);
  // console.log("11. Data Breeder",fetchbreeder);
  
  if (_.isNull(fetchbreeder) || _.isUndefined(fetchbreeder) || _.isEmpty(fetchbreeder)) {
    return (
      <Grid>
      <Grid.Column>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <LoadingStatus />
          </div>
        <div style={{ marginTop: '1.5rem' }}>
          <h2 style={{ textAlign: 'center' }}>{`${title} - Data Hari Ini Kosong`}</h2>
        </div>
      </Grid.Column>
    </Grid>
    );
  }
  return (
    <Grid>
      <PieChart options={options} data={data} containerStyle={containerStyle} title={title}/>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    fetchbreeder: state.businessintelligence.fetchbreeder,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
