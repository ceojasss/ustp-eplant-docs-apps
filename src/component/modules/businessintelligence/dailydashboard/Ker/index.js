import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import format from "dateformat"
import LoadingStatus from "../../../../templates/LoadingStatus";
import LineChart from "../../../../templates/LineChart";

const Charts = ({ chart_7, site, p_date, title = "KER", label = "Tanggal" }) => {

  const dispatch = useDispatch();

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const labels = chart_7?.map((data) => data["MONTH"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Act",
        data: chart_7?.map((data) => data["OER"]),
        borderColor: "rgb(127, 255, 212)",
        // fill: true,
        backgroundColor: "rgba(127, 255, 212, 0.5)",
      },
    ],
    options,
  }


  useEffect(() => {

    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(chart_7) || _.isEmpty(chart_7) || _.isUndefined(chart_7)) return <LoadingStatus />;
  return (
      <LineChart data={data} title={title} label={label} />
  );
};

const mapStateToProps = (state) => {
  //console.log(state.dashboard.chart_7)
  return {
    chart_7: state.businessintelligence.fetch_data9,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
