import { connect, useDispatch } from "react-redux";
import {fetchData, fetchData2} from "./Action";
import { useEffect } from "react";
import format from "dateformat"
import _ from "lodash";
import LoadingStatus from "../../../../templates/LoadingStatus";
import LineChart from "../../../../templates/LineChart";

const Charts = ({ actbgt, site, p_date, title = "Prod TBS Act Vs Bgt (Ton)", label = "Bulan" }) => {

  const dispatch = useDispatch();

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const labels = actbgt?.map((data) => data["BULAN"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Actual",
        data: actbgt?.map((data) => data["ACTUAL"]),
        borderColor: "rgb(127, 255, 212)",
        // fill: true,
        backgroundColor: "rgba(127, 255, 212, 0.5)",
      },
      {
        label: "Budget",
        data: actbgt?.map((data) => data["BUDGET"]),
        borderColor: "rgb(51, 131, 255)",
        // fill: true,
        backgroundColor: "rgba(51, 131, 255, 0.5)",
      },
    ],
    options,
  }


  useEffect(() => {


      dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(actbgt) || _.isEmpty(actbgt) || _.isUndefined(actbgt)) return <LoadingStatus />;
  return (
      <LineChart data={data} title={title} label={label} />
  );
};

const mapStateToProps = (state) => {
  //console.log(state.dashboard.chart_10)
  return {
    actbgt: state.businessintelligence.fetch_data12,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
