import { connect, useDispatch } from "react-redux";
import { fetchProduksi } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import TableProduksiBulananDetail  from "../../../../../templates/TableProduksiBulananDetail";
import RenderTable from "../../../../../templates/TableBI2";
import { Grid } from "semantic-ui-react";
import { filtering7 } from "../../../../../../utils/FormComponentsHelpler";
const Lists = ({ data, p_year, p_intiplasma, p_plant, title = 'Produksi Bulanan Detail' }) => {


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduksi(p_year, p_intiplasma, p_plant));
  }, [dispatch, p_year, p_intiplasma, p_plant]);


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
      // columns={data['component']}
      columns={filtering7(data['component'])}
      data={data['data']}
      title={title} 
    />
             
);

};

const mapStateToProps = (state) => {
  console.log(state)
  return {
    data: state.dashboard.fetchproduksibulanandetail,
  };
};

export default connect(mapStateToProps, { fetchProduksi })(Lists);



