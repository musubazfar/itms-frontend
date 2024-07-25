// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { Box, Button } from "@mui/material";
// import "leaflet/dist/leaflet.css";
// import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
// import L from "leaflet"; // Ensure Leaflet is imported for custom icons
// import mapMarker from "../assets/mapMarker.png";
// import { useState } from "react";
// import {Modal} from "@mui/material";

// const customIcon = new L.Icon({
//   iconUrl: mapMarker, // Replace with the path to your custom icon
//   iconSize: [26, 26], // Set the size of the icon
// });

// export default function Maps({ extractedData }) {
//   const [showMarkers, setShowMarkers] = useState(true); // State to toggle markers

//   const extraction =
//     extractedData?.flatMap((item) => {
//       return Object.values(item.directions).flatMap((direction) => {
//         return Object.values(direction.points).map((point) => {
//           const [start_lat, start_lng] = point.start_latlong
//             .split(",")
//             .map(Number);
//           return {
//             start_lat,
//             start_lng,
//             mode_congestion: point.mode_congestion,
//             name: point.name,
//             point_id: point.point_id,
//             start_latlng: point.start_latlong,
//             end_latlng: point.end_latlong
//           };
//         });
//       });
//     }) || [];

//   const highCongestion = extraction.filter(
//     (item) => item.mode_congestion === "High"
//   );
//   const mediumCongestion = extraction.filter(
//     (item) => item.mode_congestion === "Medium"
//   );
//   const lowCongestion = extraction.filter(
//     (item) => item.mode_congestion === "Low"
//   );

//   const highPoints = highCongestion.map((item) => [
//     item.start_lat,
//     item.start_lng,
//     100,
//   ]);
//   const mediumPoints = mediumCongestion.map((item) => [
//     item.start_lat,
//     item.start_lng,
//     100,
//   ]);
//   const lowPoints = lowCongestion.map((item) => [
//     item.start_lat,
//     item.start_lng,
//     100,
//   ]);

//   const handleChange = (event, index) => {
//     setSelectedCameras({
//       ...selectedCameras,
//       [index]: event.target.value,
//     });
//   };

//   const handleOpen = (content) => {
//     setModalContent(content);
//     setOpen(true);
//     const stringArray = content.map(item => `${item.point_id}`);
//     const postData = async () => {
//       try {
//         const sendData = {
//           road_points: stringArray,
//         };
//         const response = await axios.post(
//           import.meta.env.VITE_CAMERA_STATUS,
//           sendData,
//           {
//             headers: {
//               'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Include the bearer token in the Authorization header
//               'Content-Type': 'application/json' // Ensure the content type is set correctly
//             }
//           }
//         );
//         setPostResponse(response.data);
//       } catch (error) {
//               if (error.response && error.response.status === 401) {
//                 navigate("/");
//                 sessionStorage.clear();
//               } else {
//                 console.error(error)
//               }
//             }
//     };

//     postData();
//   };
//   const handleClose = () => {
//     setOpen(false);
//     setModalContent(null);
//     setPostResponse("");
//   };

//   const [openVideoModal, setOpenVideoModal] = useState(false);
//   const [nestedModalData, setNestedModalData] = useState(null);
//   const [nestedMatchValue, setNestedMatchValue] = useState(null);

//   const handlePlayClick = (data, matchValue) => {
//     setNestedModalData(data);
//     setNestedMatchValue(matchValue);
//     setOpenVideoModal(true);
//     setStreamResponse(`${import.meta.env.VITE_CAMERA_STREAM}?point_id=${data.point_id}&camera_id=${matchValue}&token=${sessionStorage.getItem('token')}`);
//   }

//   // const handleNestedClose = () => setNestedOpen(false);
//   const handleVideoModalClose = () => {
//     const stopStream = async () => {
//       try{
//         const obj = {
//           point_id: nestedModalData.point_id,
//           camera_id: nestedMatchValue
//         }
//         const response = await axios.post(import.meta.env.VITE_STOP_CAMERA_STREAM, obj, {
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Include the bearer token in the Authorization header
//             'Content-Type': 'application/json' // Ensure the content type is set correctly
//           }
//         })
//       } catch (error) {
//         if (error.response && error.response.status === 401) {
//           navigate("/");
//           sessionStorage.clear();
//         } else {
//           console.error(error)
//         }
//       }
//     };
//     stopStream();
//     setOpenVideoModal(false);
//     setVideoError(null);
//     setStreamResponse(null);
//     setSelectedCameras('')
//     setNestedModalData(null);
//     setNestedMatchValue(null);
//   };



//   return (
//     <>
//     <Box
//       sx={{
//         height: "700px",
//         width: "100%",
//         paddingTop:   3,
//         paddingBottom: 3,
//         position: "relative",
//       }}
//     >
//       <MapContainer
//         center={[31.504457, 74.331554]}
//         zoom={14}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {showMarkers &&
//           extraction.map((item) => (
//             <Marker
//               key={`${item.start_lat}-${item.start_lng}`}
//               position={[item.start_lat, item.start_lng]}
//               icon={customIcon}
//             >
//               <Popup>
//                 <div style={{textAlign: 'center'}}>
//                 {`Name: ${item.name}`}
//                 <Button onClick={() => handleOpen(extraction)}>View Details</Button>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         {highPoints.length > 0 && (
//           <HeatmapLayer
//             points={highPoints}
//             longitudeExtractor={(m) => m[1]}
//             latitudeExtractor={(m) => m[0]}
//             intensityExtractor={(m) => m[2]}
//             gradient={{ 1: "red" }}
//             radius={20}
//           />
//         )}
//         {mediumPoints.length > 0 && (
//           <HeatmapLayer
//             points={mediumPoints}
//             longitudeExtractor={(m) => m[1]}
//             latitudeExtractor={(m) => m[0]}
//             intensityExtractor={(m) => m[2]}
//             gradient={{ 1: "yellow" }}
//             radius={20}
//           />
//         )}
//         {lowPoints.length > 0 && (
//           <HeatmapLayer
//             points={lowPoints}
//             longitudeExtractor={(m) => m[1]}
//             latitudeExtractor={(m) => m[0]}
//             intensityExtractor={(m) => m[2]}
//             gradient={{ 1: "green" }}
//             radius={20}
//           />
//         )}
//       </MapContainer>
//       {/* Add a button to toggle markers */}
//       <Button
//         variant="contained"
//         onClick={() => setShowMarkers(!showMarkers)}
//         sx={{
//           position: "absolute",
//           top: 27,
//           right: 16,
//           zIndex: 1000,
//         }}
//       >
//         {showMarkers ? "Hide Markers" : "Show Markers"}
//       </Button>
//     </Box>
//     <Modal open={open} onClose={handleClose}>
//         <Box sx={modalStyle}>
//           {modalContent && (
//             <>
//               <Button
//                 endIcon={<CloseIcon />}
//                 sx={{ position: "absolute", right: 0 }}
//                 onClick={handleClose}
//               />
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: "bold" }}>
//                         Location
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>
//                         Congestion Level
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Options</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {modalContent &&
//                       modalContent
//                         .map((item, index) => {
//                           const keys = Object.keys(postResponse);
//                           const searchValue = String(item.point_id);
//                           let matchKey = null;
//                           let matchValue = null;


//                           for (const key of keys) {
//                             if (key === searchValue) {
//                               matchKey = key;
//                               matchValue = postResponse[key]; 
//                               break;
//                             }
//                           }
//                           let iconComponent;
//                           if (!postResponse) {
//                             iconComponent = (
//                               <CircularProgress
//                                 size={20}
//                                 sx={{ color: "darkgreen" }}
//                               /> // or any other loading indicator you prefer
//                             );
//                           } else if (!matchValue) {
//                             iconComponent = (
//                               <VideocamOff
//                                 sx={{ color: "grey", cursor: "not-allowed" }}
//                                 onClick={() =>
//                                   handlePlayClick(
//                                     item,
//                                     selectedCameras[index]
//                                   )
//                                 }
//                               />
//                             );
//                           } else {
//                             iconComponent = (
//                               <>
//                                 <FormControl
//                                   variant="outlined"
//                                   fullWidth
//                                   sx={{ mt: 1, mb: 1 }}
//                                 >
//                                   <InputLabel
//                                     id="select"
//                                     sx={{
//                                       fontSize: "0.7rem",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     Cameras
//                                   </InputLabel>
//                                   <Select
//                                     labelId={`select-label-${index}`}
//                                     label="Camera"
//                                     value={selectedCameras[index] || ""}
//                                     onChange={(event) =>
//                                       handleChange(event, index)
//                                     }
//                                     sx={{ height: 36, width: 100 }} // Adjust height and width as needed
//                                   >
//                                     {matchValue?.map((camera) => (
//                                       <MenuItem
//                                         key={camera.camera_id}
//                                         value={camera.camera_id}
//                                         sx={{
//                                           display: "flex",
//                                           alignItems: "center",
//                                         }}
//                                         disabled={!camera.status}
//                                       >
//                                         {camera.status ? (
//                                           <VideocamOn
//                                             sx={{
//                                               color: "green",
//                                               cursor: "pointer",
//                                             }}
//                                           />
//                                         ) : (
//                                           <VideocamOff
//                                             sx={{
//                                               color: "red",
//                                               cursor: "not-allowed",
//                                             }}
//                                           />
//                                         )}
//                                         {camera.camera_id}
//                                       </MenuItem>
//                                     ))}
//                                   </Select>
//                                 </FormControl>
//                                 <Button
//                                   variant="contained"
//                                   onClick={() =>
//                                     handlePlayClick(
//                                       item,
//                                       selectedCameras[index]
//                                     )
//                                   }
//                                   disabled={!selectedCameras[index]}
//                                 >
//                                   Play
//                                 </Button>
//                               </>
//                             );
//                           }
//                           return (
//                             <TableRow key={index} style={{ cursor: "pointer" }}>
//                               <TableCell
//                                 sx={{
//                                   backgroundColor:
//                                     index % 2 ? "lightgrey" : "white",
//                                 }}
//                               >
//                                 {item.name}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   backgroundColor:
//                                     index % 2 ? "lightgrey" : "white",
//                                 }}
//                               >
//                                 {item.mode_congestion}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   backgroundColor:
//                                     index % 2 ? "lightgrey" : "white",
//                                 }}
//                               >
//                                 <Box
//                                   sx={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                   }}
//                                 >
//                                   {iconComponent}
//                                 </Box>
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </>
//           )}
//         </Box>
//       </Modal>
//       {/* -------------------------------Nested Modal for click on 1st modal----------------------------------- */}
//       <Modal open={openVideoModal} onClose={handleVideoModalClose}>
//         <Box
//           sx={{
//             ...modalStyle,
//             width: "80%",
//             height: "80%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           }}
//         >
//           <Button
//             endIcon={<CloseIcon />}
//             sx={{ position: "absolute", right: 0 }}
//             onClick={handleVideoModalClose}
//           />
//           <Box sx={{ height: "48%", width: "100%" }}>
//   {streamResponse && <img style={{height: '100%', width: '100%'}} src={streamResponse} alt="Video Stream" />}
// </Box>
//           <Box sx={{ height: "48%", width: "100%" }}>
//             <MapsForVideo data={nestedModalData} />
//           </Box>
//         </Box>
//       </Modal>
//     </>
//   );
// }


// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   minWidth: `50%`,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
//   maxHeight: "80%",
//   overflow: "auto",
// };


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import L from "leaflet"; // Ensure Leaflet is imported for custom icons
import mapMarker from "../assets/mapMarker.png";
import { useState } from "react";
import axios from 'axios'; // Make sure to import axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import VideocamOn from '@mui/icons-material/Videocam'; // Import VideocamOn
import VideocamOff from '@mui/icons-material/VideocamOff'; // Import VideocamOff
import MapsForVideo from "./MapsForVideo";

const customIcon = new L.Icon({
  iconUrl: mapMarker, // Replace with the path to your custom icon
  iconSize: [26, 26], // Set the size of the icon
});

export default function Maps({ extractedData }) {
  const [showMarkers, setShowMarkers] = useState(true); // State to toggle markers
  const [modalContent, setModalContent] = useState(null);
  const [open, setOpen] = useState(false);
  const [postResponse, setPostResponse] = useState("");
  const [selectedCameras, setSelectedCameras] = useState({});
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [nestedModalData, setNestedModalData] = useState(null);
  const [nestedMatchValue, setNestedMatchValue] = useState(null);
  const [streamResponse, setStreamResponse] = useState(null);
  const [videoError, setVideoError] = useState(null);

  const navigate = useNavigate();

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
            point_id: point.point_id,
            start_latlng: point.start_latlong,
            end_latlng: point.end_latlong
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

  const handleChange = (event, index) => {
    setSelectedCameras({
      ...selectedCameras,
      [index]: event.target.value,
    });
  };

  const handleOpen = (content) => {
    setModalContent(content);
    setOpen(true);
    const stringArray = content.map(item => `${item.point_id}`);
    const postData = async () => {
      try {
        const sendData = {
          road_points: stringArray,
        };
        const response = await axios.post(
          import.meta.env.VITE_CAMERA_STATUS,
          sendData,
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Include the bearer token in the Authorization header
              'Content-Type': 'application/json' // Ensure the content type is set correctly
            }
          }
        );
        setPostResponse(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
          sessionStorage.clear();
        } else {
          console.error(error);
        }
      }
    };

    postData();
  };

  const handleClose = () => {
    setOpen(false);
    setModalContent(null);
    setPostResponse("");
  };

  const handlePlayClick = (data, matchValue) => {
    setNestedModalData(data);
    setNestedMatchValue(matchValue);
    setOpenVideoModal(true);
    setStreamResponse(`${import.meta.env.VITE_CAMERA_STREAM}?point_id=${data.point_id}&camera_id=${matchValue}&token=${sessionStorage.getItem('token')}`);
  };

  const handleVideoModalClose = () => {
    const stopStream = async () => {
      try {
        const obj = {
          point_id: nestedModalData.point_id,
          camera_id: nestedMatchValue
        };
        await axios.post(import.meta.env.VITE_STOP_CAMERA_STREAM, obj, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Include the bearer token in the Authorization header
            'Content-Type': 'application/json' // Ensure the content type is set correctly
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
          sessionStorage.clear();
        } else {
          console.error(error);
        }
      }
    };
    stopStream();
    setOpenVideoModal(false);
    setVideoError(null);
    setStreamResponse(null);
    setSelectedCameras({});
    setNestedModalData(null);
    setNestedMatchValue(null);
  };

  return (
    <>
      <Box
        sx={{
          height: "700px",
          width: "100%",
          paddingTop: 3,
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
            extraction.map((item) => {
              console.log(item); // Add this line to log each item
              return (
                <Marker
                  key={`${item.start_lat}-${item.start_lng}`}
                  position={[item.start_lat, item.start_lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      {`Name: ${item.name}`}
                      <Button onClick={() => handleOpen([item])}>View Details</Button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {modalContent && (
            <>
              <Button
                endIcon={<CloseIcon />}
                sx={{ position: "absolute", right: 0 }}
                onClick={handleClose}
              />
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Congestion Level</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modalContent &&
                      modalContent.map((item, index) => {
                        const keys = Object.keys(postResponse);
                        const searchValue = String(item.point_id);
                        let matchKey = null;
                        let matchValue = null;

                        for (const key of keys) {
                          if (key === searchValue) {
                            matchKey = key;
                            matchValue = postResponse[key];
                            break;
                          }
                        }

                        let iconComponent;
                        if (!postResponse) {
                          iconComponent = (
                            <CircularProgress
                              size={20}
                              sx={{ color: "darkgreen" }}
                            />
                          );
                        } else if (!matchValue) {
                          iconComponent = (
                            <VideocamOff
                              sx={{ color: "grey", cursor: "not-allowed" }}
                              onClick={() =>
                                handlePlayClick(item, selectedCameras[index])
                              }
                            />
                          );
                        } else {
                          iconComponent = (
                            <>
                              <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 1, mb: 1 }}
                              >
                                <InputLabel
                                  id="select"
                                  sx={{
                                    fontSize: "0.7rem",
                                    alignItems: "center",
                                  }}
                                >
                                  Cameras
                                </InputLabel>
                                <Select
                                  labelId={`select-label-${index}`}
                                  label="Camera"
                                  value={selectedCameras[index] || ""}
                                  onChange={(event) =>
                                    handleChange(event, index)
                                  }
                                  sx={{ height: 36, width: 100 }}
                                >
                                  {matchValue?.map((camera) => (
                                    <MenuItem
                                      key={camera.camera_id}
                                      value={camera.camera_id}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                      disabled={!camera.status}
                                    >
                                      {camera.status ? (
                                        <VideocamOn
                                          sx={{
                                            color: "green",
                                            cursor: "pointer",
                                          }}
                                        />
                                      ) : (
                                        <VideocamOff
                                          sx={{
                                            color: "red",
                                            cursor: "not-allowed",
                                          }}
                                        />
                                      )}
                                      {camera.camera_id}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  handlePlayClick(item, selectedCameras[index])
                                }
                                disabled={!selectedCameras[index]}
                              >
                                Play
                              </Button>
                            </>
                          );
                        }

                        return (
                          <TableRow key={index} style={{ cursor: "pointer" }}>
                            <TableCell
                              sx={{
                                backgroundColor: index % 2 ? "lightgrey" : "white",
                              }}
                            >
                              {item.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: index % 2 ? "lightgrey" : "white",
                              }}
                            >
                              {item.mode_congestion}
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: index % 2 ? "lightgrey" : "white",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {iconComponent}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Modal>
      <Modal open={openVideoModal} onClose={handleVideoModalClose}>
        <Box
          sx={{
            ...modalStyle,
            width: "80%",
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Button
            endIcon={<CloseIcon />}
            sx={{ position: "absolute", right: 0 }}
            onClick={handleVideoModalClose}
          />
          <Box sx={{ height: "48%", width: "100%" }}>
            {streamResponse && <img style={{ height: '100%', width: '100%' }} src={streamResponse} alt="Video Stream" />}
          </Box>
          <Box sx={{ height: "48%", width: "100%" }}>
            <MapsForVideo data={nestedModalData} />
          </Box>
        </Box>
      </Modal>
    </>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: `50%`,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80%",
  overflow: "auto",
};
