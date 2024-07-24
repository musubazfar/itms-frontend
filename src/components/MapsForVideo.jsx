import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from 'react';
import L from 'leaflet';
import location from '../assets/location.png'

const MapsForVideo = ({data}) => {
    // const [name, mode_congestion, start_latlong, end_latlong, point_id] = data
    const extractProperties = (obj) => {
        const {
          start_latlong,
          end_latlong
        } = obj;
      
        return {
          start_latlong,
          end_latlong
        };
      };
      const {start_latlong, end_latlong } = extractProperties(data);

    const customIcon = new L.Icon({
        iconUrl: location,
        iconSize: [30, 30], // size of the icon
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      });

    const start = start_latlong.split(',')
    const start_lat = parseFloat(start[0])
    const start_long = parseFloat(start[1])

    const end = end_latlong.split(',')
    const end_lat = parseFloat(end[0])
    const end_long = parseFloat(end[1])

    const polylinePositions = [
        [start_lat, start_long],
        [end_lat , end_long]
      ];

    return (
        <MapContainer center={[start_lat, start_long]} zoom={14} style={{ height: "100%", width: "100%"}}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[start_lat, start_long]} icon={customIcon}></Marker>
            <Marker position={[end_lat, end_long]} icon={customIcon}></Marker>
            <Polyline positions={polylinePositions} color="red" />
            
        </MapContainer>
    );
};

export default MapsForVideo;
