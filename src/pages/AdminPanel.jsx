
import { Box, Button, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../assets/greenMap.png'
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const LeftNav = () => {
    const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const login_token = sessionStorage.getItem('token');
    if (!login_token) {
        navigate('/');
    }
}, []);
useEffect(() => {
  const checkExpiration = () => {
      const login_token = sessionStorage.getItem('token');
      const loginTime = sessionStorage.getItem('loginTime');
      const TEN_MINUTES = 120 * 60 * 1000; // 10 minutes in milliseconds

      if (!login_token || !loginTime || (Date.now() - loginTime) > TEN_MINUTES) {
          // If login_token or loginTime is not found, or if 10 minutes have passed, clear sessionStorage and redirect
          sessionStorage.clear();
          navigate('/');
      }
  };

  // Check expiration immediately on mount
  checkExpiration();

  // Set interval to check expiration every minute
  const interval = setInterval(checkExpiration, 60 * 1000); // 1 minute in milliseconds

  // Clear interval on component unmount
  return () => clearInterval(interval);
}, [navigate]); 


    const center = [31.52192, 74.36131]; // Center of the map
    const zoom = 13; // Initial zoom level
    const [startingPosition, setStartingPosition] = useState(0);
    const [endingPosition, setEndingPosition] = useState(0);
    const [pathCoordinates, setPathCoordinates] = useState([]);
    const [mapsData, setMapsData] = useState([]);

    const [txtLocationValue, settxtLocationValue] = useState([]);
    const [txtDirectionValue, settxtDirectionValue] = useState([]);
    
    const [markerPosition, setMarkerPosition] = useState([]);

// Fetch data from API
    const fetchData = async () => {
        try {
            const response = await fetch (`http://10.20.11.181:8001/coordinates?road_name=${txtLocationValue}&direction=${txtDirectionValue}&start_lat=${startingPosition[0]}&start_lon=${startingPosition[1]}&end_lat=${endingPosition[0]}&end_lon=${endingPosition[1]}`);
            const data = await response.json();
            console.log('API Response:', data);
            setMapsData(data); // Do something with the data
            // console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
    

        const sendData = {
            "road_name": `${txtLocationValue}`,
            "direction": `${txtDirectionValue}`,
            "start_postion": [startingPosition],
            "coordinates": mapsData,
            "end_position": [endingPosition]
          }
        try {
            const response = await axios.post('http://10.20.11.181:8001/process_coordinates', sendData);
            console.log("Send Data",sendData)
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
// //  Submit data to API
//     const formattedCoordinates = mapsData.map(coord =>(`[${coord[0]}, ${coord[1]}]`));
//     // const format = `(${startingPosition[0]}, ${startingPosition[1]})`, `${formattedCoordinates}`, `(${endingPosition[0]}, ${endingPosition[1]})`;
//     // const format = [`(${startingPosition[0]},${startingPosition[1]}),${formattedCoordinates},(${endingPosition[0]}, ${endingPosition[1]})`];
//     const format = [`[${startingPosition[0]},${startingPosition[1]}],${formattedCoordinates},[${endingPosition[0]},${endingPosition[1]}]`];
//     console.log(format)
//     const handleSubmit = async (event) => {
//     event.preventDefault(event);
//     const sendData = {
//         'road_name': txtLocationValue,
//         'direction': txtDirectionValue,
//         'data': format,
//     }
//         try {
//     const response = await axios.post('http://10.20.11.181:8001/process_coordinates', sendData);
//     console.log('Response:', response.data);
//        } catch (error) {
//     console.error('Error:', error);
//   }
// };
// handleSubmit(formData);

const handleLocation = (e) => {
    settxtLocationValue(e.target.value); 
};

const handleDirection = (e) => {
    settxtDirectionValue(e.target.value); 
};


// code of third click on map
    const handleReset = () => {
        setStartingPosition(0);
        setEndingPosition(0);
        setPathCoordinates([]);
        // setClickCount(0);
        setMapsData([]);
    };
    function AddMarkerOnClick() {
        const map = useMapEvents({

            click(e) {
                const clickedPosition = [e.latlng.lat, e.latlng.lng];
                if (!startingPosition) {
                    setStartingPosition(clickedPosition);
                } else if (!endingPosition) {
                    setEndingPosition(clickedPosition);
                    setPathCoordinates([startingPosition, clickedPosition]);
                }
                else {
                    handleReset();
                }
            },
        });
        return null;
    }

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        iconSize: [32, 32], // specify the size of the icon
        iconAnchor: [18, 18], // specify the anchor of the icon
    });

    // const handleMarkerDrag = (event) => {
    //     // setMarkerPosition(event.target.getLatLng());
    //     const newPosition = event.target.getLatLng();
    //     setMarkerPosition(newPosition);
    //   };

    const handleMarkerDrag = (index, event) => {
        const newCoordinates = [...mapsData];
        newCoordinates[index] = [event.target.getLatLng().lat, event.target.getLatLng().lng];
        setMapsData(newCoordinates);
    };
    console.log("New position",markerPosition)
    console.log("mapsData", mapsData)

    return (
        <>
        <Navbar>
            <Box component={'div'} className='left-box'>
                <List>
                    {/* <br /><br /> */}
                    <ListItemText>
                        <Typography sx={{ fontWeight: 'bold', color: '#000000af' }}>
                            &nbsp;&nbsp;Site Name:
                        </Typography>
                    </ListItemText>
                    <ListItem>
                        <TextField id="txtLocation" label="Enter Location" variant="outlined" value={txtLocationValue} onChange={handleLocation} />
                    </ListItem>
                    <ListItemText>
                        <Typography sx={{ fontWeight: 'bold', color: '#000000af' }}>
                            &nbsp;&nbsp;Direction:
                        </Typography>
                        </ListItemText>
                    <ListItem>
                        <TextField id="txtDirection" label="Enter Direction" variant="outlined" value={txtDirectionValue} onChange={handleDirection} />
                    </ListItem>
                    <br />
                    <ListItemText>
                        <Typography variant='body2' sx={{ fontWeight: '600', color: '#000000af' }}>
                            &nbsp;&nbsp;Starting Lat/Long:
                        </Typography>
                    </ListItemText>
                    <ListItem>
                        <TextField id="outlined-basic" label="Latitude" InputLabelProps={{ shrink: true, }} variant="outlined" value={startingPosition[0]} />&nbsp;&nbsp;
                        <TextField id="outlined-basic" label="Longitude" InputLabelProps={{ shrink: true, }} variant="outlined" value={startingPosition[1]} />
                    </ListItem>
                    <br />
                    <ListItemText>
                        <Typography variant='body2' sx={{ fontWeight: '600', color: '#000000af' }}>
                            &nbsp;&nbsp;Ending Lat/Long:
                        </Typography>
                    </ListItemText>
                    <ListItem>
                        <TextField id="outlined-basic" label="Latitude" InputLabelProps={{ shrink: true, }} variant="outlined" value={endingPosition[0]} />&nbsp;&nbsp;
                        <TextField id="outlined-basic" label="Longitude" InputLabelProps={{ shrink: true, }} variant="outlined" value={endingPosition[1]} />
                    </ListItem>
                    <br />
                    <ListItem sx={{ textAlign: 'right' }}>
                        <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button variant="contained" sx={{ backgroundColor: '3667a8' }} onClick={fetchData}>Fetch</Button>
                        </Box>
                    </ListItem>
                    
                </List>
            </Box>

            {/* // Central Box Map component*/}

            <Box component={'div'} className='central-box'>
                <Paper elevation={4} sx={{ height: 'fit-content', padding: '10px', borderRadius: '15px' }}>
                    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%', borderRadius: '15px' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <AddMarkerOnClick />
                        {startingPosition && (
                            <Marker position={startingPosition}>
                                <Popup>Starting Point: {startingPosition[0]}, {startingPosition[1]}</Popup>
                            </Marker>
                        )}
                        {endingPosition && (
                            <Marker position={endingPosition}>
                                <Popup>Ending Point: {endingPosition[0]}, {endingPosition[1]}</Popup>
                            </Marker>
                        )}
                        {/* {mapsData && mapsData.map((item) => (
                            <Marker position={item} icon={customIcon} draggable={true} eventHandlers={{
                                dragend: handleMarkerDrag
                              }} />
                        ))}; */}
                        {mapsData.map((position, index) => (
                            <Marker key={index} position={position} icon={customIcon} draggable={true} eventHandlers={{
                                dragend: (event) => handleMarkerDrag(index, event)
                            }} />
                        ))}
                    </MapContainer>
                </Paper>
                <br /><br />
                <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button variant="contained" disabled={!(startingPosition && endingPosition)} sx={{ backgroundColor: '3667a8' }} onClick={handleSubmit}  >Submit</Button>
                </Box>
            </Box>
            </Navbar>
        </>
    )
}

export default LeftNav

