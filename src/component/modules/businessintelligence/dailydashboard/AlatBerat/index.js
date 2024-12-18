import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
//import format from "dateformat"
import LoadingStatus from "../../../../templates/LoadingStatus";
//import CardChart from "../../../../templates/CardBI";
import CardChart2 from "../../../../templates/CardBI2";

const Charts = ({ alatberat, site, p_date, title = "Alat Berat" }) => {

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isNull(alatberat) || _.isUndefined(alatberat) || _.isEmpty(alatberat)) return <LoadingStatus />;
  
  return(
    <CardChart2
    data={alatberat}
    title={title}  
  />
  )
};

const mapStateToProps = (state) => {
  //console.log(_.find(state.businessintelligence.fetch_data, function(o) {return o.alatberat}))
  return {
    alatberat: state.businessintelligence.fetch_data5,
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
