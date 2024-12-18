import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import format from "dateformat"
import LoadingStatus from "../../../../templates/LoadingStatus";
import RenderTable from "../../../../templates/TableBI2";
import { Grid, Container } from "semantic-ui-react";

const Charts = ({ data, site, p_date, title = "Kernel" }) => {
// console.log(data,site)
  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isEmpty(data) || _.isUndefined(data) || _.isNull(data)) return <Container
  style={{
    textAlign: "center",
    margin: 50
  }}
  >
    <h2>Data Hari Ini Kosong</h2>
  </Container>
    return (
      <RenderTable
                as={Grid.Column}
                columns={data['component']}
                data={data['data']}
                title={title} />
);
};

const mapStateToProps = (state) => {
  //console.log(state.dashboard)
  return {
    data: state.businessintelligence.fetch_data11,
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
