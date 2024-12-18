import CardChart from "../../../../templates/CardBI";
import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import format from "dateformat"
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../templates/LoadingStatus";

const ChartsCard = ({ chart_3_rawat,site, p_date, title = "RAWAT" }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(chart_3_rawat) || _.isUndefined(chart_3_rawat) || _.isEmpty(chart_3_rawat)) return <LoadingStatus />;

  return(
        <CardChart
        data={chart_3_rawat}
        title={title}  
      />
      )
};

const mapStateToProps = (state) => {
  return {
    chart_3_rawat: state.businessintelligence.fetch_data4,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(ChartsCard);
