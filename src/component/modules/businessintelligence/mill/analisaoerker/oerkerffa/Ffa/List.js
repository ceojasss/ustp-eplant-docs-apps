import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../../templates/LoadingStatus";
import FfaGauge from "../../../../../../templates/gauge/FfaGauge";

const Lists = ({ fetchgauge, p_date, p_site, titleFfa = "FFA"}) => {
  const dispatch = useDispatch();
  
  const FfaData = fetchgauge.find(item => item.INDICATORNAME === 'Oil Quality - FFA');
  const valueFfa = FfaData ? FfaData.VAL : null;
  const gaugeTitleFfa = FfaData ? `${titleFfa} = ${valueFfa}` : `${titleFfa}`;

  // console.log("3.Data FFA",valueFfa);

  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  if (_.isNull(valueFfa) || _.isUndefined(valueFfa) || _.isNull(FfaData) || _.isUndefined(FfaData)) {
    return (
      <Grid>
        <Grid.Column>
          <div style={{ padding: '2rem', margin: '10px', display: 'flex', height: '100%' }}>
            <LoadingStatus />
          </div>
          <div style={{ padding: '0.5rem' }}>
            <h3>{`${titleFfa} - Data Hari Ini Kosong`}</h3>
          </div>
        </Grid.Column>
      </Grid>
    );
  }

  return (
    <Grid>
      <FfaGauge valueFfa={valueFfa} title={gaugeTitleFfa} />
     </Grid>
  );
};

const mapStateToProps = (state) => {
  // console.log("1.State ffa",state);
  return {
    fetchgauge: state.businessintelligence.fetchgauge,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
