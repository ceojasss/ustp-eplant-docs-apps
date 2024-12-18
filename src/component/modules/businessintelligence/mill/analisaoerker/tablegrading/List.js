import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import { Grid } from "semantic-ui-react";
import { QueryData,changeReducer} from "../../../../../../utils/FormComponentsHelpler";
import { getColumnMill } from "../../../../../../utils/BIHelper";
import RenderTable from "../../../../../templates/TableBI2";


const Lists = ({data,p_date,p_site,title = "Table Gradding"}) => {

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("DATA", data);

  if (_.isNull(data[0]) || _.isEmpty(data[0]) || _.isUndefined(data[0])) {
    return (
      <Grid>
        <Grid.Column >
          <Grid.Row >
          <h2 style={{ textAlign: 'center' }}>{`${title} - Data Hari Ini Kosong`}</h2>
          </Grid.Row>
          <Grid.Row>
          <div style={{position:'absolute',padding: "2rem",margin: "10px",display: "flex",height: "100%",width:"80%"}}>
            <LoadingStatus />
          </div>
          </Grid.Row>
          </Grid.Column>
      </Grid>
    );
  }

  return (
      <Grid style={{width:'95%'}}>
      <RenderTable
       columns={getColumnMill(data,'componentanalisaoerker')}
       data={data[0]}
       title={title}
       pagination={false}
      />
      </Grid>
  );
};

const mapStateToProps = state => {
  // console.log("STATE", state);
  return {
    data: QueryData(state)
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
