import React from 'react'
import {statesData} from './DataMap'
import {
    MapContainer,
    Polygon,
    TileLayer
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import "./App.css"


const center = [40.63463151377654, -97.89969605983609]
const url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=auqzKN4c5zLvLDelQc3b"
console.log(url);

export default function Map(){
    return (
        <MapContainer
            center={center}
            zoom={10}
            style={{width: '100vw', height: '100vh'}}
        >
        <TileLayer
            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=auqzKN4c5zLvLDelQc3b"    
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />

        

        {}
            

        {
            statesData.features.map((state) => {
                const coordinates = state.geometry.coordinates[0].map((item) => [item[1], item[0]]);

                return (<Polygon 
                    pathOptions={{
                        fillColor: '#FD8D3C',
                        fillOpacity: 0.7,
                        weight: 2,
                        opacity: 1,
                        dashArray: 3,
                        color: 'white',
                        fillColor:'#FD8D3C'
                    }}
                    positions={coordinates}
                    eventHandlers={{
                        mouseover: (e) => {
                           const layer = e.target;
                           layer.setStyle({
                            fillOpacity: 0.7,
                            weight: 5,
                            dashArray: "3" , 
                            color: '#666',
                            fillColor: '#D45962'
                           })

                        },
                        mouseout: (e) => {
                            const layer = e.target;
                            layer.setStyle({
                            fillOpacity: 0.7,
                            weight: 2,
                            dashArray: "3" , 
                            color: 'white',
                            fillColor:'#FD8D3C'
                           })
                        },
                        click: (e) => {

                        }
                    }}
                />)
            })
        }
       
        </MapContainer>

    )
}