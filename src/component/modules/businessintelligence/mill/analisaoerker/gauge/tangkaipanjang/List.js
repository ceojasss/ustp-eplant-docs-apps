import { connect, useDispatch } from "react-redux";
import { fetchData } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../../templates/LoadingStatus";
import TpGauge from "../../../../../../templates/gauge/TangkaiPanjang";

const Lists = ({ fetchgauge1, p_date, p_site, titleTp = "Tangkai Panjang" }) => {
  const dispatch = useDispatch();

  const TpData = fetchgauge1.find((item) => item.KATEGORI === "TANGKAIPANJANG");
  const valueTp = TpData ? TpData.PCT : null;
  const formattedValueTp = valueTp ? valueTp.toFixed(2) : null;
  const gaugeTitleTp = TpData ? `${titleTp} = ${formattedValueTp}` : `${titleTp}`;
  
  useEffect(() => {
    dispatch(fetchData(p_date, p_site));
  }, [dispatch, p_date, p_site]);

  // console.log("6. Data TangkaiPanjang",formattedValueTp);


  if (_.isNull(formattedValueTp) || _.isUndefined(formattedValueTp) 
  || _.isNull(TpData)|| _.isUndefined(TpData)) {
    return (
      <Grid>
          <Grid.Column>
            <div style={{padding:'2rem',margin:'10px', display: 'flex',  height:'100%' }}>
              <LoadingStatus/>
            </div>
            <div style={{padding:'1.1rem'}}>
               <h3>{`${titleTp} - Data Hari Ini Kosong`}</h3>
            </div>
          </Grid.Column>
      </Grid>
    );
  }

  

  return (
    <Grid>
      <TpGauge valueTp={formattedValueTp} title={gaugeTitleTp} />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    fetchgauge1: state.businessintelligence.fetchgauge1,
  };
};

export default connect(mapStateToProps, { fetchData })(Lists);
