import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box, Button } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import L from "leaflet"; // Ensure Leaflet is imported for custom icons
import mapMarker from "../assets/mapMarker.png";
import { useState } from "react";

const customIcon = new L.Icon({
  iconUrl: mapMarker, // Replace with the path to your custom icon
  iconSize: [26, 26], // Set the size of the icon
});

export default function Maps({ extractedData }) {
  const [showMarkers, setShowMarkers] = useState(true); // State to toggle markers

  const extraction =
    extractedData?.flatMap((item) => {
      return Object.values(item.directions).flatMap((direction) => {
        return Object.values(direction.points).map((point) => {
          const [start_lat, start_lng] = point.start_latlong
            .split(",")
            .map(Number);
          return {
            start_lat,
            start_lng,
            mode_congestion: point.mode_congestion,
            name: point.name,
          };
        });
      });
    }) || [];

  const highCongestion = extraction.filter(
    (item) => item.mode_congestion === "High"
  );
  const mediumCongestion = extraction.filter(
    (item) => item.mode_congestion === "Medium"
  );
  const lowCongestion = extraction.filter(
    (item) => item.mode_congestion === "Low"
  );

  const highPoints = highCongestion.map((item) => [
    item.start_lat,
    item.start_lng,
    100,
  ]);
  const mediumPoints = mediumCongestion.map((item) => [
    item.start_lat,
    item.start_lng,
    100,
  ]);
  const lowPoints = lowCongestion.map((item) => [
    item.start_lat,
    item.start_lng,
    100,
  ]);

  return (
    <Box
      sx={{
        height: "700px",
        width: "100%",
        paddingTop:   3,
        paddingBottom: 3,
        position: "relative",
      }}
    >
      <MapContainer
        center={[31.504457, 74.331554]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showMarkers &&
          extraction.map((item) => (
            <Marker
              key={`${item.start_lat}-${item.start_lng}`}
              position={[item.start_lat, item.start_lng]}
              icon={customIcon}
            >
              <Popup>
                {`Name: ${item.name}`}
                <br />
              </Popup>
            </Marker>
          ))}
        {highPoints.length > 0 && (
          <HeatmapLayer
            points={highPoints}
            longitudeExtractor={(m) => m[1]}
            latitudeExtractor={(m) => m[0]}
            intensityExtractor={(m) => m[2]}
            gradient={{ 1: "red" }}
            radius={20}
          />
        )}
        {mediumPoints.length > 0 && (
          <HeatmapLayer
            points={mediumPoints}
            longitudeExtractor={(m) => m[1]}
            latitudeExtractor={(m) => m[0]}
            intensityExtractor={(m) => m[2]}
            gradient={{ 1: "yellow" }}
            radius={20}
          />
        )}
        {lowPoints.length > 0 && (
          <HeatmapLayer
            points={lowPoints}
            longitudeExtractor={(m) => m[1]}
            latitudeExtractor={(m) => m[0]}
            intensityExtractor={(m) => m[2]}
            gradient={{ 1: "green" }}
            radius={20}
          />
        )}
      </MapContainer>
      {/* Add a button to toggle markers */}
      <Button
        variant="contained"
        onClick={() => setShowMarkers(!showMarkers)}
        sx={{
          position: "absolute",
          top: 27,
          right: 16,
          zIndex: 1000,
        }}
      >
        {showMarkers ? "Hide Markers" : "Show Markers"}
      </Button>
    </Box>
  );
}
