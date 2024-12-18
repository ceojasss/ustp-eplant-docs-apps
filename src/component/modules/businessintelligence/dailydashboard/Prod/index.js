import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
//import format from "dateformat"
import LoadingStatus from "../../../../templates/LoadingStatus";
import StatsChart from "../../../../templates/StatsChart";

const Charts = ({ prod, site, p_date, title = "PROD TBS" }) => {

const dispatch = useDispatch();

  useEffect(() => {

dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(prod) || _.isUndefined(prod) || _.isEmpty(prod)) return <LoadingStatus />;

  return (
      <StatsChart data={prod} title={title} />
  );
};

const mapStateToProps = (state) => {
  //console.log(_.find(state.businessintelligence.fetch_data, 'prod'))
  return {
    prod: state.businessintelligence.fetch_data1
  };
};
export default connect(mapStateToProps, { fetchData })(Charts);
