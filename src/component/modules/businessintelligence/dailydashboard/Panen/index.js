import CardChart from "../../../../templates/CardBI";
import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import format from "dateformat"
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../templates/LoadingStatus";

const ChartsCard = ({ chart_3_panen, site, p_date, title = "PANEN" }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(chart_3_panen) || _.isEmpty(chart_3_panen) || _.isUndefined(chart_3_panen)) return <LoadingStatus />;

  return(
        <CardChart
        data={chart_3_panen}
        title={title}  
      />
      )
};

const mapStateToProps = (state) => {
  //console.log(state.businessintelligence.fetch_data3)
  return {
    chart_3_panen: state.businessintelligence.fetch_data3,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(ChartsCard);
