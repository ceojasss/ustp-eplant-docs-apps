import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import { Grid } from "semantic-ui-react";
import {filteringTableMill} from "../../../../../../utils/BIHelper";
import RenderTable from "../../../../../templates/TableBI2";

const Lists = ({ data, p_month, p_year, p_site, p_group, title = "Table Karyawan" }) => {
  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    dispatch(fetchData(p_month, p_year, p_site, p_group));
  }, [dispatch, p_month, p_year, p_site, p_group]);

  useEffect(() => {
    if (data && data.component) {
      const filteredColumns = filteringTableMill(data.component, 'componenttabemp');
      setColumns(filteredColumns);
    }
  }, [data]);

  console.log("tabemp", data);

  if (_.isNull(data) || _.isEmpty(data) || _.isUndefined(data)) {
    return (
      <Grid>
        <Grid.Column>
          <div style={{ padding: "2rem", margin: "10px", display: "flex", height: "100%" }}>
            <LoadingStatus />
          </div>
        </Grid.Column>
      </Grid>
    );
  }
  return (
    <Grid>
      <Grid.Column>
        <RenderTable
          columns={columns}
          data={data.data}
          title={false}
          pagination={true}
        />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.businessintelligence.fetchtabemp,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
