import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import Chart from "../../../../../templates/HorizontalBarChart";

const Lists = ({ fetchrankkerja, p_month, p_year, p_site,title='Top Rank Pekerjaan' }) => {
  const dispatch = useDispatch();

  const chartData = fetchrankkerja?.map((data) => ({
    GROUP_JABATAN: data["GROUP_JABATAN"],
    JAM: data["JAM"],
  }));

  const labels = chartData?.map((data) => data.GROUP_JABATAN);

  const totalData = chartData?.length; 
  const chartWidth = 200; 
  const barThicknessRatio = chartWidth / totalData;
  

  const data = {
    labels:labels,
    datasets: [
      {
        label: "JAM",
        data: chartData?.map((data) => data.JAM),
        borderColor: "rgba(6, 91, 32, 1)",
        backgroundColor: "rgba(7, 163, 54, 1)",
        barThickness: barThicknessRatio,
      },
    ],
  };

  useEffect(() => {
    dispatch(fetchData(p_month, p_year, p_site));
  }, [dispatch, p_month, p_year, p_site]);

  if (_.isNull(fetchrankkerja) || _.isUndefined(fetchrankkerja) || _.isEmpty(fetchrankkerja)) {
    return (
      <Grid>
        <Grid.Column>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          <div style={{  zIndex:'1',padding: '0.5rem', textAlign: 'center' }}>
               <h3>{`${title} - Data Hari Ini Kosong`}</h3>
          </div>
          <div style={{marginTop:'10rem',zIndex:'0' }}>
            <LoadingStatus />
          </div>
      </div>

        </Grid.Column>
      </Grid>
    );
  }
  return (
    <Grid>
        <Chart data={data} title={title} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    fetchrankkerja: state.businessintelligence.fetchrankkerja,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
