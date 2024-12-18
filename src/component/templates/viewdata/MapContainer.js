import React from "react"
import wellknown from 'wellknown';

import 'leaflet/dist/leaflet.css'


import _ from 'lodash'

import { MapContainer, GeoJSON, Popup as LPopup, TileLayer } from "react-leaflet";
// *library imports placed above ↑
// *local imports placed below ↓



const getColor = (warna) => {
    return warna == 'MERAH' ? '#e81c1c' :
        warna == 'HIJAU' ? '#2fcc16' :
            warna == 'KUNING' ? '#dbe619' : '#59FD02';
}

const geoJsonData = [
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        515117.786505064,
                        9763483.382071692
                    ],
                    [
                        515264.83157243766,
                        9763591.802270958
                    ],
                    [
                        515266.60350489523,
                        9763592.47006696
                    ],
                    [
                        515276.8695810456,
                        9763597.109122694
                    ],
                    [
                        515290.7968120603,
                        9763604.427633028
                    ],
                    [
                        515292.0996554615,
                        9763605.387437662
                    ],
                    [
                        515294.29305004235,
                        9763606.247262647
                    ],
                    [
                        515295.191847072,
                        9763606.59719142
                    ],
                    [
                        515304.55912619084,
                        9763611.376218664
                    ],
                    [
                        515313.53885063156,
                        9763615.955286609
                    ],
                    [
                        515330.129489352,
                        9763624.443558848
                    ],
                    [
                        515332.2239338048,
                        9763625.453353304
                    ],
                    [
                        515332.4053423777,
                        9763625.543334989
                    ],
                    [
                        515332.9000930358,
                        9763625.863269871
                    ],
                    [
                        515340.3378445897,
                        9763630.572311355
                    ],
                    [
                        515356.48320772126,
                        9763639.700453348
                    ],
                    [
                        515363.3602418648,
                        9763643.13975329
                    ],
                    [
                        515370.2372760074,
                        9763647.638837514
                    ],
                    [
                        515379.76122616976,
                        9763652.66781388
                    ],
                    [
                        515382.40814218856,
                        9763652.397868827
                    ],
                    [
                        515383.95836091787,
                        9763653.47764904
                    ],
                    [
                        515384.07380273845,
                        9763646.918984039
                    ],
                    [
                        515386.18473887816,
                        9763612.166057898
                    ],
                    [
                        515385.3519086009,
                        9763583.88181507
                    ],
                    [
                        515385.1292708069,
                        9763576.183382064
                    ],
                    [
                        515385.1292708069,
                        9763533.062159268
                    ],
                    [
                        515385.6570048416,
                        9763494.959914865
                    ],
                    [
                        515385.9208718585,
                        9763464.266162492
                    ],
                    [
                        515384.86540379,
                        9763401.828871422
                    ],
                    [
                        515384.24696546607,
                        9763370.72520248
                    ],
                    [
                        515384.06555689126,
                        9763361.607058454
                    ],
                    [
                        515382.77095933724,
                        9763299.799639173
                    ],
                    [
                        515382.48235478625,
                        9763286.202406852
                    ],
                    [
                        515381.12179047894,
                        9763261.347466005
                    ],
                    [
                        515378.25223666336,
                        9763208.678186683
                    ],
                    [
                        515378.24399082176,
                        9763147.060728734
                    ],
                    [
                        515378.24399082176,
                        9763120.926048374
                    ],
                    [
                        515378.24399082176,
                        9763112.257812772
                    ],
                    [
                        515378.24399082176,
                        9763110.588152625
                    ],
                    [
                        515378.24399082176,
                        9763109.09845585
                    ],
                    [
                        515378.25223666336,
                        9763103.679558849
                    ],
                    [
                        515354.22384638526,
                        9763103.999493724
                    ],
                    [
                        515349.85354890674,
                        9763104.059481516
                    ],
                    [
                        515335.0605042409,
                        9763104.249442846
                    ],
                    [
                        515330.50879818946,
                        9763104.319428606
                    ],
                    [
                        515307.4781550709,
                        9763104.619367555
                    ],
                    [
                        515301.78027666174,
                        9763104.699351272
                    ],
                    [
                        515238.01516272034,
                        9763104.429406216
                    ],
                    [
                        515156.5297293877,
                        9763105.489190502
                    ],
                    [
                        515127.33944058046,
                        9763106.04907654
                    ],
                    [
                        515123.11756830383,
                        9763106.129060255
                    ],
                    [
                        515114.77277387585,
                        9763107.74873058
                    ],
                    [
                        515114.57487361133,
                        9763114.25740576
                    ],
                    [
                        515116.57861377485,
                        9763119.516335316
                    ],
                    [
                        515117.8979488611,
                        9763203.119318172
                    ],
                    [
                        515118.12058665976,
                        9763261.147506703
                    ],
                    [
                        515118.16181587987,
                        9763271.385422802
                    ],
                    [
                        515118.9946461553,
                        9763327.593981713
                    ],
                    [
                        515119.21728394926,
                        9763342.820882324
                    ],
                    [
                        515119.1843005754,
                        9763346.550123248
                    ],
                    [
                        515118.95341693144,
                        9763372.454850415
                    ],
                    [
                        515118.4256828977,
                        9763408.177579159
                    ],
                    [
                        515118.4256828977,
                        9763444.160254989
                    ],
                    [
                        515118.0463740602,
                        9763467.59548482
                    ],
                    [
                        515117.8979488611,
                        9763476.44368379
                    ],
                    [
                        515117.786505064,
                        9763483.382071692
                    ]
                ]
            ]
        },
        "properties": {
            "TYPE": null,
            "BLOK": "F021",
            "KEBUN": "KBN1",
            "AFDELING": "AFD-III",
            "SITE": "GCM",
            "MAPS": "BLOK",
            "STREET": null,
            "SLENGTH": null,
            "WARNA": "HIJAU"
        }
    }
]


const convertToGeoJSON = (rows) => {
    // console.log('rows:', rows); // Check the value of 'rows'


    const features = rows.map(row => {

        // const coord = wkx.Geometry.parse(row.koordinat);
        //        const geoJsonObject = JSON.parse(coord.toGeoJSON());

        const coord = wellknown.parse(row.koordinat);


        return {
            type: 'Feature',
            geometry: coord,
            properties: {
                TYPE: row.type,
                BLOK: row.blok,
                KEBUN: row.kebun,
                AFDELING: row.afdeling,
                //   properties: row.properties,
                SITE: row.site,
                MAPS: row.maps,
                STREET: row.street,
                SLENGTH: row.slength,
                WARNA: row.warna
            }
        };
    });

    const geoJSON = {
        type: 'FeatureCollection',
        features: features
    };

    return geoJSON;
}

const ContainerMap = ({ content/*, dates*/, headerListener }) => {
    //  console.log('content', content)

    const site_location = content?.content?.rows[0].sitelocation

    const center = _.split(site_location, ';')
    const fetchactbudgetmap = convertToGeoJSON(content?.content?.rows)

    if (_.isEmpty(fetchactbudgetmap))
        return <>fetch map dong</>

    console.log(center)

    const mapstyle = {
        color: 'blue', // outline color
        fillColor: 'yellow', // fill color
        fillOpacity: 0.5, // opacity of the fill
        weight: 2 // outline weight
    };



    /*  return <MapContainer center={center} zoom={11.5}
          style={{ height: "400px", width: "30vw" }}>
         <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OsM</a> contributors'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />
 
 
         {fetchactbudgetmap.features.map((feature, index) => {
             // console.log('feat', feature)
 
             return < GeoJSON key={index} data={feature} style={mapstyle} />
         })}
 
     </MapContainer> */

    return <MapContainer
        key={`map.${content?.code}`}
        center={center}
        zoom={11.5}
        style={{ height: '55vh', width: '30vw' }}
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OsM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={fetchactbudgetmap} style={{
            color: 'green', // outline color
            fillColor: 'yellow', // fill color
            fillOpacity: 0.5, // opacity of the fill
            weight: 2 // outline weight
        }} />
        {fetchactbudgetmap && fetchactbudgetmap.features
            ? _.map(fetchactbudgetmap.features, (state, idx) => {

                const coordinates = state.geometry.coordinates[0].map((item) => [
                    item[1],
                    item[0],
                ]);

                const blk = state.properties.BLOK;
                const afd = state.properties.AFDELING;
                const kbn = state.properties.KEBUN;

                const warna = state.properties.WARNA;

                console.log(warna)


                const vparam = _.compact(_.map(state.properties, (z, i) => {
                    if (i !== 'properties') {
                        return { 'key': i, 'val': z }
                    } else {
                        return;
                    }
                }))

                return (
                    <GeoJSON
                        key={`gj.${idx}`}
                        data={state}
                        pathOptions={{
                            // fillColor: '#a5a5a5',
                            fillColor: getColor(warna),
                            fillOpacity: 0.5,
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
                                    fillColor: getColor(warna),
                                });
                            },
                            click: (e) => {

                                // console.log(vparam)
                                headerListener(vparam)
                                //headerListener()
                            },
                        }}
                    >
                        <LPopup>
                            <p><b>Kebun :</b> {kbn}</p>
                            <p><b>Afdeling :</b> {afd}</p>
                            <p><b>Blok :</b> {blk}</p>
                        </LPopup>
                    </GeoJSON>
                );
            })
            : null}
    </MapContainer>
}

export default ContainerMap