import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../../templates/LoadingStatus";
import KerGauge from "../../../../../../templates/gauge/KerGauge";

const Lists = ({ fetchgauge, p_date, p_site, titleKer = "KER"}) => {
  const dispatch = useDispatch();

  const KerData = fetchgauge.find(item => item.INDICATORNAME === 'KER');
  const valueKer = KerData ? KerData.VAL : null;
  const gaugeTitleKer = KerData ? `${titleKer} = ${valueKer}` : `${titleKer}`;

  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("2.Data KER",valueKer);


  if (_.isNull(valueKer) || _.isUndefined(valueKer) || _.isNull(KerData) || _.isUndefined(KerData)) {
    return (
      <Grid>
        <Grid.Column>
          <div style={{ padding: '2rem', margin: '10px', display: 'flex', height: '100%' }}>
            <LoadingStatus />
          </div>
          <div style={{ padding: '0.5rem' }}>
            <h3>{`${titleKer} - Data Hari Ini Kosong`}</h3>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
  return (
    <Grid>
          <KerGauge valueKer={valueKer} title={gaugeTitleKer} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  // console.log("2.State Ker",state);
  return {
    fetchgauge: state.businessintelligence.fetchgauge,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
