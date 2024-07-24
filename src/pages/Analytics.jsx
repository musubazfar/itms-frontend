import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Button,
  Grid,
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import LineGraph from "../components/LineGraph";
import MapComponent from "../components/MapComponent";
import { useNavigate } from "react-router-dom";


const Analytics = () => {
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

/*----------------------------------------------------------------filtering stuff---------------------------------------------------------------*/
/*----------------------------------------------------------------Filtering Data for Live Maps----------------------------------------------------------------------*/
  

/*-------------------------------------------------------State Declarations--------------------------------------------------------*/
  const [apiResponse, setApiResponse] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [directions, setDirections] = useState([]);
  const [subLocation, setSubLocation] = useState([]);
  const [selectedSubLocation, setselectedSubLocation] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [pastResponse, setPastResponse] = useState([]);
  const [maps, setMaps] = useState(null);
  const [lineChart, setLineChart] = useState(null);
  const maxDateTime = dayjs()
    .subtract(1, "hour")
    .minute(0)
    .second(0)
    .millisecond(0);

    const postData = async () => {
        try {
          const searchData = {
            road_name: selectedRoad,
            direction: selectedDirection,
            road_point: selectedSubLocation.length < 1 ? "" : selectedSubLocation,
            start_time: startTime.format("DD/MM/YYYY HH:mm"),
            end_time: `${startTime.format("DD/MM/YYYY")} ${endTime.format("HH:mm")}`,
          };
          const response = await axios.post(
            "https://api-itms.psca.gop.pk/query_road_data/",
            searchData
          );
          setPastResponse(response.data);
    
        } catch (error) {
          console.error("Error searching:", error);
        }
      };

  const handleStartTimeChange = (newValue) => {
    if (newValue.isAfter(maxDateTime)) {
      alert("You cannot select a future date and time.");
    } else {
      setStartTime(newValue);
    }
  };

  const handleEndTimeChange = (newTime) => {
    setEndTime(newTime);
  };

  /*----------------------------------------------------------------------------------------------------------------------------*/
  const handleRoadChange = (event) => {
    const selectedRoadName = event.target.value;
    setSelectedRoad(selectedRoadName);

    // Find the road object in the JSON data
    const selectedRoadData = apiResponse.find(
      (item) => item.name === selectedRoadName
    );
    if (selectedRoadData) {
      // Set the directions for the selected road
      setDirections(
        selectedRoadData.data.find((item) => item.time === "Current Time")
          .directions
      );
    }
  };

  // Function to handle change in the "Select Direction" dropdown
  const handleDirectionChange = (event) => {
    const selectedDirection = event.target.value;
    setSelectedDirection(selectedDirection);

    // Find the direction object in the directions array
    const selectedDirectionData = directions.find(
      (direction) => direction.direction === selectedDirection
    );
    if (selectedDirectionData) {
      // Log the start latitude and longitude
      // console.log(selectedDirectionData);
      setSubLocation(selectedDirectionData?.points.map((item) => item.name));
    }
  };

  const handleSubLocation = (event) => {
    const abc = event.target.value;
    setselectedSubLocation(abc);
  };

  return (
    <Navbar>
      <Box className="container" width={'100%'} height={'100%'} marginTop={13.2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <Box>
              <List md={{ display: "flex" }}>
                <ListItem>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Road
                    </InputLabel>
                    <Select
                      labelId="road-select-label"
                      id="road-select"
                      value={selectedRoad}
                      onChange={handleRoadChange}
                      label="Select Road"
                    >
                      {apiResponse?.map((item) => (
                        <MenuItem key={item.name} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Direction
                    </InputLabel>
                    <Select
                      labelId="direction-select-label"
                      id="direction-select"
                      value={selectedDirection}
                      onChange={handleDirectionChange}
                      label="Select Direction"
                    >
                      {directions?.map((direction, index) => (
                        <MenuItem key={index} value={direction.direction}>
                          {direction.direction}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
              <List sx={{ display: "flex" }}>
                <ListItem sx={{ maxWidth: "50%" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Sub location
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedSubLocation}
                      label="Select Sub location"
                      onChange={handleSubLocation}
                      disabled={!selectedDirection}
                    >
                      {subLocation?.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
              <Divider sx={{ borderBottomWidth: 3 }} />
              <List sx={{ display: "flex", overflow: "auto" }}>
                <ListItem sx={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Start Time"
                      value={startTime}
                      maxDateTime={maxDateTime}
                      onChange={handleStartTimeChange}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                </ListItem>
                <ListItem sx={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["TimePicker"]}
                      sx={{ width: "100%", padding: 0 }}
                    >
                      <TimePicker
                        label="End Time"
                        value={endTime}
                        // maxTime={dayjs().subtract(1, 'hour')}
                        onChange={handleEndTimeChange}
                        sx={{ width: "100%" }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </ListItem>
              </List>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#4676ad" }}
                  onClick={postData}
                  disabled={
                    !(selectedRoad && selectedDirection && startTime && endTime)
                  }
                >
                  Submit
                </Button>
              </Box>
              <Box>
                <LineGraph data={lineChart} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Box
              width={"100%"}
              height={"65vh"}
              boxSizing={"border-box"}
              p={1}
              sx={{ backgroundColor: "#e1fad8" }}
            >
              <MapComponent extractedData={maps} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Navbar>
  );
};

export default Analytics;
