import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect ,useState } from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";

import { Grid } from "semantic-ui-react";

import {filteringTableMill} from "../../../../../../utils/BIHelper";

import RenderTable from "../../../../../templates/TableBI2"

const Lists = ({  data, p_year, p_site, title='Cost Palm Prod (TON): ' + p_site   }) => {
  

  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    dispatch(fetchData(p_year,p_site,));
  }, [dispatch ,p_year,p_site,]);

  useEffect(() => {
    if (data && data.component) {
      const filteredColumns = filteringTableMill(data.component,'componenttabcostpalmprod');
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
    data: state.businessintelligence.fetchcostpalmprod,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
