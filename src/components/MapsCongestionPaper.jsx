import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import L from 'leaflet';
import cameraIcon from '../assets/camera_icon.png';
import locIcon from '../assets/location.png';

const MapsCongestionPaper = ({ data, camera }) => {
  const [startLat, startLong] = data?.start_latLong
    .split(",")
    .map((coord) => parseFloat(coord.trim()));

  const [endLat, endLong] = data?.end_latLong
    .split(",")
    .map((coord) => parseFloat(coord.trim()));

  const customIcon = new L.Icon({
    iconUrl: cameraIcon,
    iconSize: [30, 30], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  });

  
  const locationIcon = new L.Icon({
    iconUrl: locIcon,
    iconSize: [30, 30], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  });


  const polylinePositions = [
    [startLat, startLong],
    [endLat, endLong]
  ];

  return (
    <MapContainer
      center={[startLat, startLong]}
      zoom={14}
      style={{ height: "250px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[startLat, startLong]} icon={locationIcon}/>
      <Marker position={[endLat, endLong]} icon={locationIcon}/>
      <Polyline positions={polylinePositions} color="red" />
      {camera && camera.map((item) => (
        <Marker key={item.id} position={[item.lat, item.long]} icon={customIcon} />
      ))}
    </MapContainer>
  );
};

export default MapsCongestionPaper;
