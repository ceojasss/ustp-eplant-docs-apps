import { connect, useDispatch } from "react-redux";
import { fetchProduksi } from "./Action";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import TableProduksiBulanan  from "../../../../../templates/TableProduksiBulanan";
import BarChart from "../../../../../templates/BarChart"
import RenderTable from "../../../../../templates/TableBI2";
import { filtering2 } from "../../../../../../utils/FormComponentsHelpler";

const Lists = ({ datas, p_year, p_site, p_plant, p_estate, p_division, p_intiplasma, title = 'Produksi Bulanan' }) => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchProduksi(p_year, p_site, p_plant, p_estate, p_division, p_intiplasma));
  }, [dispatch, p_year, p_site, p_plant, p_estate, p_division, p_intiplasma]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };


  console.log('checking data  : ',datas.data)
  

  const databulan = datas.data == null ? 'tidak ada' : datas.data == undefined ? 'tidak' : Object.entries(datas.data).map((data,index) =>  {
  

    // _.isUndefined(datas.data)&&_.isNull(datas.data) 
      return {
        'Jan': data[1].bln01,
        'Feb': data[1].bln02,
        'Mar': data[1].bln03,
        'Apr': data[1].bln04,
        'May': data[1].bln05,
        'Jun': data[1].bln06,
        'Jul': data[1].bln07,
        'Aug': data[1].bln08,
        'Sep': data[1].bln09,
        'Okt': data[1].bln10,
        'Nov': data[1].bln11,
        'Des': data[1].bln12
      }
    }
  )

  // const dat = [databulan,[],[]]

  
  console.log('data bulan :', databulan);

  // console.log('cek data :', datas?.map((data) =>  data))ss

  const data = {
    // labels,
    datasets: [    
      {
        label: 'Actual',
        data: databulan[0],
        backgroundColor: 'rgb(255, 0, 0)',
      },
      {
        label: 'Budget',
        // data: datas?.map((data) => dat),
        data: databulan[1],
        backgroundColor: 'rgb(0, 0, 255)',
      },
      {
        label: 'Sensus',
        data: databulan[3],
        backgroundColor: 'rgb(0, 232, 72)',
      },
      {
        label: 'Potensi',
        data: databulan[5],
        backgroundColor: 'rgb(255, 255, 0)',
      },
    ], 
    options
  };

  console.log('data', data)


  // if (_.isNull(datas)) return <LoadingStatus />;
  if (_.isUndefined(data) || _.isEmpty(data) || _.isNull(data)) {
    return (
      <Grid> 
        <Grid.Column>
          <div className="container-loading-status">
            <div style={{ zIndex: "0" }}>
              <LoadingStatus />
            </div>
            <div
              style={{ marginTop: "7rem", marginBottom: "3rem", zIndex: "1" }}
            >
              <h2>Data Hari Ini Kosong</h2>
            </div>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
    return (
      

      <Grid>
        <Grid.Row>
          <Grid.Column>
            <RenderTable
              as={Grid.Column}
              // columns={datas['component']}
              columns={filtering2(datas['component'])}
              data={datas['data']}
              title={title} 
            />,
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <BarChart data={data} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
  );

};

const mapStateToProps = (state) => {

  console.log('state > produksi perbulan',state)
  return {
    datas: state.dashboard.fetchproduksibulanan,
  };
};

export default connect(mapStateToProps, { fetchProduksi })(Lists);



