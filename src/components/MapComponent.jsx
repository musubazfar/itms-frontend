import { MapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

export default function Maps({ extractedData }) {

  const extraction = extractedData?.flatMap(item => {
    return Object.values(item.directions).flatMap(direction => {
      return Object.values(direction.points).map(point => {
        const [start_lat, start_lng] = point.start_latlong.split(',').map(Number);
        return {
          start_lat,
          start_lng,
          mode_congestion: point.mode_congestion
        };
      });
    });
  }) || [];

const highCongestion = extraction.filter(item=>item.mode_congestion === "High")
const mediumCongestion = extraction.filter(item=>item.mode_congestion === "Medium")
const lowCongestion = extraction.filter(item=>item.mode_congestion === "Low")

const highPoints = highCongestion.map(item=>[item.start_lat, item.start_lng, 100])
const mediumPoints = mediumCongestion.map(item=>[item.start_lat, item.start_lng, 100])
const lowPoints = lowCongestion.map(item=>[item.start_lat, item.start_lng, 100])
  return (
    <Box sx={{height: '700px', width: "100%", paddingTop: 3, paddingBottom: 3}}>
    <MapContainer center={[31.504457, 74.331554]} zoom={14} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {highPoints.length > 0 && (
            <HeatmapLayer
            //   fitBoundsOnLoad
              // fitBoundsOnUpdate
              points={highPoints}
              longitudeExtractor={m => m[1]}
              latitudeExtractor={m => m[0]}
              intensityExtractor={m => m[2]}
              gradient={{ 1: 'red' }}
              radius={20}
            />
          )}
      {mediumPoints.length > 0 && (
            <HeatmapLayer
            //   fitBoundsOnLoad
              // fitBoundsOnUpdate
              points={mediumPoints}
              longitudeExtractor={m => m[1]}
              latitudeExtractor={m => m[0]}
              intensityExtractor={m => m[2]}
              gradient={{ 1: 'yellow' }}
              radius={20}
            />
          )}
      {lowPoints.length > 0 && (
            <HeatmapLayer
            //   fitBoundsOnLoad
              // fitBoundsOnUpdate
              points={lowPoints}
              longitudeExtractor={m => m[1]}
              latitudeExtractor={m => m[0]}
              intensityExtractor={m => m[2]}
              gradient={{ 1: 'green' }}
              radius={20}
            />
          )}
    </MapContainer>
    </Box>
  );
}
