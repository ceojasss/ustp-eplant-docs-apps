import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import format from "dateformat"
import LoadingStatus from "../../../../templates/LoadingStatus";
import CardChart3 from "../../../../templates/CardBI3";

const Charts = ({ chart_5, site, p_date, title = "Rotasi Panen" }) => {

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(chart_5) || _.isUndefined(chart_5) || _.isEmpty(chart_5)) return <LoadingStatus />;
  return(
    <CardChart3
    data={chart_5}
    title={title}  
  />
  )
};

const mapStateToProps = (state) => {
  //console.log(state.dashboard)
  return {
    chart_5: state.businessintelligence.fetch_data7,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
