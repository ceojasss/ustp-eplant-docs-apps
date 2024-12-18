import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import format from "dateformat"
import LoadingStatus from "../../../../templates/LoadingStatus";
import RenderTable from "../../../../templates/TableBI2";
import { Grid, Container} from "semantic-ui-react";

const Charts = ({ data, site, p_date, title = "CPO" }) => {
  //console.log(data)

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(fetchData(site, p_date));
  }, [dispatch, site, p_date]);

  if (_.isEmpty(data) || _.isUndefined(data) || _.isNull(data)) return <Container
  style={{
    textAlign: "center",
    margin: 150
  }}
  >
    <h2>Data Hari Ini Kosong</h2>
  </Container>
    return (
      // <TableChart data={data} title={title} />
      <RenderTable
                as={Grid.Column}
                columns={data['component']}
                data={data['data']}
                title={title} />
                // <RenderTable
                // as={Grid.Column}
                // columns={getColumn(data)}
                // data={data[0]} />
  );
  
};

const mapStateToProps = (state) => {
  //console.log(state.businessintelligence)
  return {
    //chart_8: state.dashboard.chart_8,
    data: state.businessintelligence.fetch_data10,
    // columns: getColumn(data)
    //site: state.auth.menu.user.site,
    //p_date: format((state.auth.menu.user.currentdate), "dd-mm-yyyy")
  };
};

export default connect(mapStateToProps, { fetchData })(Charts);
