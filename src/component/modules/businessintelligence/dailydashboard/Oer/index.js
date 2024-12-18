import { connect, useDispatch } from "react-redux";
import {fetchData, fetchData2} from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../templates/LoadingStatus";
import LineChart from "../../../../templates/LineChart";

const Charts = ({ chart_6, site, p_date, title = "OER", label = "Tanggal" }) => {

  const dispatch = useDispatch();

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const labels = chart_6?.map((data) => data["MONTH"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Act",
        data: chart_6?.map((data) => data["OER"]),
        borderColor: "rgb(95, 158, 160)",
        // fill: true,
        backgroundColor: "rgba(95, 158, 160, 0.5)",
      },
    ],
    options,
  }


  useEffect(() => {


      dispatch(fetchData(site, p_date));

  }, [dispatch, site, p_date]);

  if (_.isNull(chart_6) || _.isUndefined(chart_6) || _.isEmpty(chart_6)) return <LoadingStatus />;
  return (
      <LineChart data={data} title={title} label={label} />
  );
};

const mapStateToProps = (state) => {
  //console.log(state.dashboard.chart_6)
  return {
    chart_6: state.businessintelligence.fetch_data8,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
