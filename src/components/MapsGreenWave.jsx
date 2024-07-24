import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import L from "leaflet";
import dayjs from "dayjs";
import greenLight from "../assets/green_light-transformed.png"
import yellowLight from "../assets/yellow_light-transformed.png"

const greenSignal = new L.Icon({
  iconUrl: greenLight,
  iconSize: [40, 40],
  iconAnchor: [16, 32], 
});

const yellowSignal = new L.Icon({
  iconUrl: yellowLight,
  iconSize: [24, 32], 
  iconAnchor: [16, 32], 
});

const MapsGreenWave = () => {
  const data = [
    [31.565497, 74.314230],
    [31.561994, 74.319329],
    [31.559684, 74.324534],
    [31.557762, 74.327998],
    [31.554347, 74.335923],
    [31.550882, 74.341995],
    [31.544365, 74.349796],
    [31.539952, 74.354140],
  ];

  const cantt_signals = [
    [31.530198, 74.368812],
    [31.529960, 74.376622],
    [31.529832, 74.379444],
    [31.529805, 74.382351]
  ]

  const currentTime = dayjs();
  const eveningStart = dayjs().hour(19).minute(0).second(0);
  const canttStart = dayjs().hour(9).minute(0).second(0);
  const eveningEnd = dayjs().hour(23).minute(59).second(59);
  const canttEnd = dayjs().hour(23).minute(59).second(59);


  const getIcon = () => {
    if (currentTime.isAfter(eveningStart) && currentTime.isBefore(eveningEnd)) {
      return greenSignal;
    } else {
      return yellowSignal;
    }
  };
  const canttIcon = () => {
    if (currentTime.isAfter(canttStart) && currentTime.isBefore(canttEnd)) {
      return greenSignal;
    } else {
      return yellowSignal;
    }
  };

  return (
    <MapContainer
      center={[31.544297, 74.349849]}
      zoom={15}
      style={{ height: "90.5vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((position, index) => (
        <Marker key={index} position={position} icon={getIcon()} />
      ))}
      {cantt_signals.map((position, index) => (
        <Marker key={index} position={position} icon={canttIcon()} />
      ))}
    </MapContainer>
  );
};

export default MapsGreenWave;
