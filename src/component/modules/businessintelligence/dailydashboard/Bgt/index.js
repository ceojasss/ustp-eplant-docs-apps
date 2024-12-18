import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
//import format from "dateformat"
import _ from "lodash";
import LoadingStatus from "../../../../templates/LoadingStatus";
import StatsChart from "../../../../templates/CardLongBI";

const Charts = ({ bgt, site, p_date, title = "BGT TBS" }) => {

  //console.log(bgt)

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(bgt) || _.isUndefined(bgt) || _.isEmpty(bgt)) return <LoadingStatus />;
  return (
      <StatsChart data={bgt} title={title} />
  );
};

const mapStateToProps = (state) => {
  return {
    bgt: state.businessintelligence.fetch_data2,
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
