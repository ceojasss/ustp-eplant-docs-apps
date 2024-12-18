import { connect, useDispatch, useSelector } from "react-redux";
import { fetchProduksi, fetchDataMap } from "./Action";
import React, { useEffect, useState, Fragment} from "react";
import { MapContainer, TileLayer, GeoJSON, Popup, Tooltip } from 'react-leaflet';
import _ from "lodash";
import LoadingStatus from "../../../../../templates/LoadingStatus";
import TableArealStatement from "../../../../../templates/TableArealStatement";
import RenderTable from "../../../../../templates/TableBI2";

import { Grid, Select, Tab, Segment } from "semantic-ui-react";
// import TableArealStatement from "../../../../templates/TableBI2";
import { filtering5 } from "../../../../../../utils/FormComponentsHelpler";

function getColor(warna) {
  return warna == 'MERAH' ? '#e81c1c' :
  warna == 'HIJAU' ? '#2fcc16' :
  warna == 'KUNING' ? '#dbe619' : '#59FD02';
}


const Lists = ({ data, p_month, p_year, p_site, p_intiplasma, fetchactpotmap, title = 'Act vs Pot' }) => {


  const [mapKey, setMapKey] = useState(0);
  console.log('isi p_site di lists : ', { p_site })
  console.log('isi p_intiplasma di lists : ', { p_intiplasma })

  // GCM
  // const center = [-2.1395368701903377, 111.15711375194213]

  // SJE
  // const center = [-2.4059, 111.1014]

  // SLM

  const center = []
  if (p_site === 'SLM') {
    center.push(-2.860200, 112.409500);
  } else if (p_site === 'GCM') {
    center.push(-2.1395368701903377, 111.15711375194213);
  } else if (p_site === 'SJE') {
    center.push(-2.4059, 111.1014);
  } else if (p_site === 'SBE') {
    center.push(-2.3196, 111.2798);
  } else {
    // Handle SMG case
    center.push(-2.1634, 111.2858);
  }
  
  console.log('titik  center : ',center)
  const dispatch = useDispatch();
  useEffect(() => {



    dispatch(fetchProduksi(p_month, p_year, p_site, p_intiplasma));

  }, [dispatch, p_month, p_year, p_site, p_intiplasma]);


  useEffect(() => {


    dispatch(fetchDataMap(p_site))
    setMapKey((prevKey) => prevKey + 1);
  }, [dispatch, p_site]);

   console.log('act vs pot  list :', data);


  if (_.isUndefined(data) || _.isEmpty(data)) {
    return (
      <Grid> 
        <Grid.Column>
          <div className="container-loading-status"  >
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
  console.log('fetch act pot map', fetchactpotmap)
  return (
    <Grid divided='vertically' columns={2}>
      <Grid.Row >
        <Grid.Column>

          <MapContainer
            key={mapKey}
            center={center}
            zoom={13}
            style={{ height: '60vh', width: '100%' }}
          >
            {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
            {fetchactpotmap && fetchactpotmap.features
              ? fetchactpotmap.features.map((state) => {
                const coordinates = state.geometry.coordinates[0].map((item) => [
                  item[1],
                  item[0],
                ]);
                const blk = state.properties.BLOK;
                const afd = state.properties.AFDELING;
                const kbn = state.properties.KEBUN;

                const warna = state.properties.WARNA;

console.log('cek data all : ',state.properties);
                return (
                  <GeoJSON
                    key={state.properties.id}
                    data={state}
                    pathOptions={{
                      // fillColor: '#a5a5a5',
                      fillColor: getColor(warna),
                      fillOpacity: 0.7,
                      weight: 2,
                      opacity: 1,
                      dashArray: 3,
                      color: 'black',
                    }}
                    positions={coordinates}
                    eventHandlers={{
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                          dashArray: '',
                          fillColor: '#706769',
                          fillOpacity: 0.7,
                          weight: 2,
                          opacity: 1,
                          color: 'black',
                        });
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                          fillOpacity: 0.7,
                          weight: 2,
                          dashArray: '3',
                          color: 'black',
                          // fillColor: '#a5a5a5',
                          fillColor: getColor(warna),
                        });
                      },
                      click: (e) => {
                        // Tindakan yang ingin Anda lakukan saat diklik
                      },
                    }}
                  >
                    <Popup>
                      <h3><b>Kebun :</b> {kbn}</h3>
                      <h3><b>Afdeling :</b> {afd}</h3>
                      <h3><b>Blok :</b> {blk}</h3>
                    </Popup>
                  </GeoJSON>
                );
              })
              : null}
          </MapContainer>

        </Grid.Column>
        <Grid.Column>
          <RenderTable
            as={Grid.Column}
            columns={filtering5(data['component'])}
            data={data['data']}
            title={title}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>

  );
};

const mapStateToProps = (state) => {
  console.log('state: ', state)
  return {
    data: state.dashboard.fetchactpot,
    fetchactpotmap: state.dashboard.fetchactpotmap
  };
};

export default connect(mapStateToProps, { fetchProduksi })(Lists);

