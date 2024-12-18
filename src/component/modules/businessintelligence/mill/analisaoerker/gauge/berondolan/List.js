import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../../templates/LoadingStatus";
import BrondolanGauge from "../../../../../../templates/gauge/BerondolanGauge";

const Lists = ({ fetchgauge1, p_date, p_site, titleBrondolan = "Berondolan" }) => {
  const dispatch = useDispatch();

  const BrondolanData = fetchgauge1.find((item) => item.KATEGORI === "BRONDOLAN");
  const valueBrondolan = BrondolanData ? BrondolanData.PCT : null;
  const formattedValueBrondolan = valueBrondolan ? valueBrondolan.toFixed(2) : null;
  const gaugeTitleBrondolan = BrondolanData ? `${titleBrondolan} = ${formattedValueBrondolan}` : `${titleBrondolan}`;
  
  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("5. Data Berondolan",formattedValueBrondolan);


  if (_.isNull(formattedValueBrondolan) || _.isUndefined(formattedValueBrondolan) 
  || _.isNull(BrondolanData) || _.isUndefined(BrondolanData) ) {
    return (
      <Grid>
          <Grid.Column>
            <div style={{padding:'2rem',margin:'10px', display: 'flex',  height:'100%' }}>
              <LoadingStatus/>
            </div>
            <div style={{padding:'1.3rem'}}>
            <h3>{`${titleBrondolan} - Data Hari Ini Kosong`}</h3>
            </div>
          </Grid.Column>
      </Grid>
    );
  }

  

  return (
    <Grid>
      <BrondolanGauge valueBrondolan={formattedValueBrondolan} title={gaugeTitleBrondolan} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    fetchgauge1: state.businessintelligence.fetchgauge1,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
