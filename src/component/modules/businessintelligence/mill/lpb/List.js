import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../templates/LoadingStatus";


import { Grid } from "semantic-ui-react";


import { QueryData,changeReducer} from "../../../../../utils/FormComponentsHelpler";
import { getColumnMill } from "../../../../../utils/BIHelper";

import RenderTable from "../../../../templates/TableBI2"

const Lists = ({  data, p_year, p_site, title ='Laporan Produksi Bulanan : ' + p_site  }) => {

  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(fetchData(p_year,p_site,));
  }, [dispatch ,p_year,p_site,]);


  // console.log("LPB",data);

  if (_.isNull(data[0])||_.isEmpty(data[0])|| _.isUndefined(data[0])) {
    return (
      <Grid>
  <Grid.Column>
    <div style={{marginTop:'3rem',justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
      <div style={{ zIndex: '0' }}>
        <LoadingStatus />
      </div>
      <div style={{marginTop:'7rem',marginBottom:'3rem',zIndex: '1' }}>
        <h2>Data Tahun Ini Kosong</h2>
      </div>
    </div>
  </Grid.Column>
</Grid>
    );
  }
  return (
    <RenderTable
      columns={getColumnMill(data,'componentlpb')}
      data={data[0]}
      title={title}
      pagination={true}
    />
  );


};

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    data :QueryData(state),
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
