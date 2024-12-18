import { connect, useDispatch } from "react-redux";
import { fetchProduksi } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import TableArealStatement  from "../../../../../templates/TableArealStatement";
import RenderTable from "../../../../../templates/TableBI2";
import { Grid } from "semantic-ui-react";
// import TableArealStatement from "../../../../templates/TableBI2";
import { filteringTable } from "../../../../../../utils/FormComponentsHelpler";
import "../../../../../Public/CSS/Agro.css";

const Lists = ({ data, p_year, p_intiplasma, title = 'Areal Statement' }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduksi(p_year, p_intiplasma));
  }, [dispatch, p_year, p_intiplasma]);

  

  // if (_.isEmpty(data)) return <LoadingStatus />;
  if (_.isUndefined(data) || _.isEmpty(data)) {
    
    return (
      <Grid> 
        <Grid.Column>
          <div className="container-loading-status"  >
            <div style={{ zIndex: "0" }}>
              <LoadingStatus />
            </div>
            <div
              style={{ marginTop: "7rem", marginBottom: "3rem", zIndex: "1" }}
            >
              <h2>Data Hari Ini Kosong</h2>
            </div>
          </div>
        </Grid.Column>
      </Grid>
    );
  }

  return (
    // <TableChart data={data} title={title} />
    <RenderTable
      as={Grid.Column}
      columns={filteringTable(data['component'])}
      // tabletype={filteringTable(data)}
      data={data['data']}
      title={title} 
    />
             
);

};

const mapStateToProps = (state) => {
  console.log('state : ',state)
  return {
    data: state.dashboard.fetchareastatement,
  };
};

export default connect(mapStateToProps, { fetchProduksi })(Lists);

