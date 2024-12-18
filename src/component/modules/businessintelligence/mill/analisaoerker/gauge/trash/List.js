import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../../templates/LoadingStatus";
import TrashGauge from "../../../../../../templates/gauge/KotoranGauge";

const Lists = ({ fetchgauge1, p_date, p_site, titleTrash = "Kotoran" }) => {
  const dispatch = useDispatch();
  
  const TrashData = fetchgauge1.find((item) => item.KATEGORI === "KOTORAN");
  const valueTrash = TrashData ? TrashData.PCT : null;
  const formattedValueTrash = valueTrash ? valueTrash.toFixed(2) : null;
  const gaugeTitleTrash = TrashData ? `${titleTrash} = ${formattedValueTrash}` :`${titleTrash}`;
  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("4. Data Kotoran",formattedValueTrash);


  if (_.isNull(formattedValueTrash) || _.isUndefined(formattedValueTrash) 
  || _.isNull(TrashData) || _.isUndefined(TrashData)) {
    return (
      <Grid>
        <Grid.Column>
          <div style={{ padding: '2rem', margin: '10px', display: 'flex', height: '100%' }}>
            <LoadingStatus />
          </div>
          <div style={{ padding: '1.4rem' }}>
            <h3>{`${titleTrash} - Data Hari Ini Kosong`}</h3>
          </div>
        </Grid.Column>
      </Grid>
    );
  }

  return (
    <Grid>
      <TrashGauge valueTrash={formattedValueTrash} title={gaugeTitleTrash} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    fetchgauge1: state.businessintelligence.fetchgauge1,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
