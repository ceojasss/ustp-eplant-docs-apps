import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import _ from "lodash";
import LoadingStatus from "../../../../../../templates/LoadingStatus";
import OerGauge from "../../../../../../templates/gauge/OerGauge";

const List = ({ fetchgauge, p_date, p_site, titleOer = "OER" }) => {
  const dispatch = useDispatch();

  const OerData = fetchgauge.find((item) => item.INDICATORNAME === "OER");
  const valueOer = OerData ? OerData.VAL : null;
  const gaugeTitleOer = OerData ? `${titleOer} = ${valueOer}` : `${titleOer}`;

  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("1.Data Oer",valueOer);

 
  if (_.isNull(valueOer) || _.isUndefined(valueOer) || _.isNull(OerData) || _.isUndefined(OerData)) {
    return (
      <Grid>
        <Grid.Column>
          <div style={{ padding: '2rem', margin: '10px', display: 'flex', height: '100%' }}>
            <LoadingStatus />
          </div>
          <div style={{ padding: '0.5rem' }}>
            <h3>{`${titleOer} - Data Hari Ini Kosong`}</h3>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
  

  return (
    <Grid>
          <OerGauge valueOer={valueOer} title={gaugeTitleOer} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  console.log(state.businessintelligence.fetchgauge)
  return {
    fetchgauge: state.businessintelligence.fetchgauge,
  };
};

export default connect(mapStateToProps, { fetchData })(List);
