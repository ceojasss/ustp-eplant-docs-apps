import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import format from "dateformat"
import LoadingStatus from "../../../../templates/LoadingStatus";
import CardChart from "../../../../templates/CardBI";
import CardChart2 from "../../../../templates/CardBI2";

const Charts = ({ chart_4_dt, site, p_date, title = "Dump Truck", description, value }) => {

  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(chart_4_dt)) return <LoadingStatus />;

  return(
    <CardChart2
    data={chart_4_dt}
    title={title}  
  />
  )
};

const mapStateToProps = (state) => {
  //console.log(state.dashboard.chart_4_dt)
  return {
    chart_4_dt: state.businessintelligence.fetch_data6,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
