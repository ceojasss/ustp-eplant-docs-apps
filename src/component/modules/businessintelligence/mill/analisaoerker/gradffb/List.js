import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import Chart from "../../../../../templates/VerticalBarChar";

const Lists = ({ fetchgradffb, p_date, p_site, title = "Grading FFA" }) => {
  const dispatch = useDispatch();

  const containerStyle = {
    width: '45vh',
    height: '40vh',
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        display: true,
      },
    },
  };

  const chartData = fetchgradffb?.map((data) => ({
    TIMBANG: data["TIMBANG"],
    SORTASI: data["SORTASI"],
  }));

  const labels = chartData?.map((data) => "INTI");

  const data = {
    labels,
    datasets: [
      {
        label: "TIMBANG",
        data: chartData?.map((data) => data.TIMBANG),
        borderColor: "rgba(0, 94, 1, 1)",
        backgroundColor: "rgba(0, 186, 1, 0.8)",
        barThickness: "60",
      },
      {
        label: "SORTASI",
        data: chartData?.map((data) => data.SORTASI),
        borderColor: "rgba(0, 0, 225, 1)",
        backgroundColor: "rgba(0, 56, 225, 1)",
        barThickness: "60",
      },
    ],
    options,
  };

  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("9. Data GraddingBar",fetchgradffb);

  if (_.isNull(fetchgradffb) || _.isUndefined(fetchgradffb) || _.isEmpty(fetchgradffb)) {
    return (
      <Grid>
        <Grid.Column>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <LoadingStatus />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <h2 style={{ textAlign: 'center' }}>{`${title} - Data Hari Ini Kosong`}</h2>
          </div>
        </Grid.Column>
      </Grid>
    );
  }

  console.log('chart', data)
  return (
    <Grid>
      <Chart options={options} data={data} containerStyle={containerStyle} title={title} />
    </Grid>
  );
};



const mapStateToProps = (state) => {
  return {
    fetchgradffb: state.businessintelligence.fetchgradffb,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
