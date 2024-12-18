import { connect, useDispatch } from "react-redux";
import { fetchData, fetchData2 } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import LineChart from "../../../../../templates/LineChart";

const Charts = ({ fetchjamtbs, p_site, p_date, title = "Jam Penerimaan Tbs (Ton)" }) => {
  const containerStyle = {
    position: "relative",
    border: "1px solid black",
    height: "35vh",
    width: "120vh",
    paddingBottom:'2.5rem',
    overflow:'auto'
  };

  const dispatch = useDispatch();

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        maxTicksLimit: fetchjamtbs?.length,
      },
    },
    tension: 0.2
    // Tambahkan opsi lain sesuai kebutuhan
  };

  const labels = fetchjamtbs?.map((data) => data["JAM"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Jumlah",
        data: fetchjamtbs?.map((data) => data["JML"]),
        borderColor: "rgba(8, 0, 255, 0.8)",
        fill: false,
        backgroundColor: "rgba(8, 0, 255, 0.8)",
      },
    ],
  };

  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("1.Data Jam Tbs",data);

  if (_.isNull(fetchjamtbs) || _.isUndefined(fetchjamtbs) || _.isEmpty(fetchjamtbs)) {
    return (
      <Grid>
        <Grid.Column>
          <div style={{ border:'2px solid black', padding: '2rem', margin: '10px', display: 'flex', height: '100%' }}>
            <LoadingStatus />
          </div>
          <div style={{ padding: '0.5rem' }}>
            <h3>{`${title} - Data Hari Ini Kosong`}</h3>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
  return (
    <Grid>
       <LineChart data={data} options={options} containerStyle={containerStyle} title={title} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    fetchjamtbs: state.businessintelligence.fetchjamtbs,
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
