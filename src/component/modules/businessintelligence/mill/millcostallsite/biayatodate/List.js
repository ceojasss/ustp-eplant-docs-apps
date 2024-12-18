import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect ,useState } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";

import { Grid } from "semantic-ui-react";


import {filteringTableMill} from "../../../../../../utils/BIHelper";

import RenderTable from "../../../../../templates/TableBI2"

const Lists = ({ data,p_period, p_year, title ='Biaya Year To Date'}) => {

  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    dispatch(fetchData(p_period, p_year));
  }, [dispatch, p_period, p_year]);

  useEffect(() => {
    if (data && data.component) {
      const filteredColumns = filteringTableMill(data.component, 'componentbiayayeartodate');
      setColumns(filteredColumns);
    }
  }, [data]);

  // console.log("Table Cost", data.data);

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
          title={title}
          pagination={false}
        />
      </Grid.Column>
    </Grid>
  );

};

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    data: state.businessintelligence.fetchbiayatodate,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
