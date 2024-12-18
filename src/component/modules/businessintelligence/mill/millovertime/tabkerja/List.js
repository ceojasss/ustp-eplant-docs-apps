import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect ,useState} from "react";
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import { Grid } from "semantic-ui-react";

// import RenderTable from "../../../../../templates/TableBI2";

import {filteringTableMill} from "../../../../../../utils/BIHelper";

import RenderTable from "../../../../../templates/TableBI2"

const Lists = ({ data, p_month, p_year, p_site, title='Kategori'}) => {


  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    dispatch(fetchData(p_month,p_year,p_site));
  }, [dispatch, p_month,p_year,p_site]);

  useEffect(() => {
    if (data && data.component) {
      const filteredColumns = filteringTableMill(data.component, 'componenttabkerja');
      setColumns(filteredColumns);
    }
  }, [data]);
  


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
          pagination={false}
        />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  // console.log(`State`, state);
  return {
    data: state.businessintelligence.fetchtabkerja
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
