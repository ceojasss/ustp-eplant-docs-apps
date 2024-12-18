import { connect, useDispatch } from "react-redux";
import { fetchProduksi } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import TableArealStatement  from "../../../../../templates/TableArealStatement";
// import RenderTable from "../../../../../templates/TableBI2Lama";
import RenderTable from "../../../../../templates/TableBI2";

import { Grid } from "semantic-ui-react";
// import TableArealStatement from "../../../../templates/TableBI2";
import { filtering4 } from "../../../../../../utils/FormComponentsHelpler";


const Lists = ({ data, p_month,p_year, p_intiplasma, title = 'Yield vs Potensi' }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduksi(p_month, p_year,  p_intiplasma));
  }, [dispatch, p_month, p_year, p_intiplasma]);

  console.log('yield potensi  list :',data);

  if (_.isUndefined(data) || _.isEmpty(data)) {
    return (
      <Grid> 
        <Grid.Column>
          <div className="container-loading-status" >
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
      columns={filtering4(data['component'])}
      data={data['data']}
      title={title} 
    />
             
);

};

const mapStateToProps = (state) => {
  console.log('state fetch yield potensi : ',state)
  return {
    data: state.dashboard.fetchyieldpotensi,
  };
};

export default connect(mapStateToProps, { fetchProduksi })(Lists);

