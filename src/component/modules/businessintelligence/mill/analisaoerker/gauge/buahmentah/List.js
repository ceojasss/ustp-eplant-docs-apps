import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../../templates/LoadingStatus";
import BmGauge from "../../../../../../templates/gauge/TandanMentah";

const Lists = ({ fetchgauge1, p_date, p_site, titleBm = "Buah Mentah" }) => {
  const dispatch = useDispatch();

  const BmData = fetchgauge1.find((item) => item.KATEGORI === "TANDANMENTAH");
  const valueBm = BmData ? BmData.PCT : null;
  const formattedValueBm = valueBm ? valueBm.toFixed(2) : null;
  const gaugeTitleBm = BmData ? `${titleBm} = ${formattedValueBm}` : `${titleBm}`;
  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("7. Data Buah Mentah",formattedValueBm);

  if (_.isNull(formattedValueBm) || _.isUndefined(formattedValueBm)
  || _.isNull(BmData) || _.isUndefined(BmData)
  ) {
    return (
      <Grid>
          <Grid.Column>
            <div style={{padding:'2rem',margin:'10px', display: 'flex',  height:'100%' }}>
              <LoadingStatus/>
            </div>
            <div style={{padding:'1.2rem'}}>
                  <h3>{`${titleBm} - Data Hari Ini Kosong`}</h3>
            </div>
          </Grid.Column>
      </Grid>
    );
  }

 

  return (
    <Grid>
      <BmGauge valueBm={formattedValueBm} title={gaugeTitleBm} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    fetchgauge1: state.businessintelligence.fetchgauge1,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
