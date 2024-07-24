import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Paper,
  TableHead,
  Typography,
  styled,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Button,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideocamOn from "@mui/icons-material/VideocamTwoTone";
import VideocamOff from "@mui/icons-material/VideocamOffTwoTone";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import MapsForVideo from "./MapsForVideo";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the StyledPaper component with a prop for background color
const StyledPaper = styled(Paper)(({ theme, bgColor }) => ({
  padding: theme.spacing(2),
  boxShadow: theme.shadows[5],
  width: "159px",
  height: "148px",
  backgroundColor: bgColor,
  borderRadius: "30px",
}));

// Define the SimplePaper component
export default function SimplePaper({ paperData }) {
  const [postResponse, setPostResponse] = useState("");
  const [data, setData] = useState([paperData])
  const [streamResponse, setStreamResponse] = useState(null);
  const [selectedCameras, setSelectedCameras] = useState("");
  // 1st Modal state and handlers
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const navigate = useNavigate();

  let bgColor = "white";

  // Check if both columns are the same
  const firstRow = Object.values(paperData.directions)[0];
  const secondRow = Object.values(paperData.directions)[1];
  const totalPoints1stRow = Object.keys(firstRow.points).length;
  const totalPoints2ndRow = Object.keys(secondRow.points).length;
  const congestion_points_1st_row = Object.values(firstRow.points).filter(item => item.mode_congestion === "High").map(item => item.mode_congestion).length
  const congestion_points_2nd_row = Object.values(secondRow.points).filter(item => item.mode_congestion === "High").map(item => item.mode_congestion).length
  const firstRowBgColor1 =
    congestion_points_1st_row > totalPoints1stRow * 0.35
      ? "lightPink"
      : "lightGreen";
  const firstRowBgColor2 =
    congestion_points_2nd_row > totalPoints2ndRow * 0.35
      ? "lightPink"
      : "lightGreen";
  if (firstRowBgColor1 === firstRowBgColor2) {
    bgColor = firstRowBgColor1;
  } else {
    bgColor = "white";
  }

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
                console.error(error)
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
  // 2nd Modal state and handlers
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [nestedModalData, setNestedModalData] = useState(null);
  const [nestedMatchValue, setNestedMatchValue] = useState(null);

  const handlePlayClick = (data, matchValue) => {
    setNestedModalData(data);
    setNestedMatchValue(matchValue);
    setOpenVideoModal(true);
    setStreamResponse(`${import.meta.env.VITE_CAMERA_STREAM}?point_id=${data.point_id}&camera_id=${matchValue}&token=${sessionStorage.getItem('token')}`);
  }

  // const handleNestedClose = () => setNestedOpen(false);
  const handleVideoModalClose = () => {
    const stopStream = async () => {
      try{
        const obj = {
          point_id: nestedModalData.point_id,
          camera_id: nestedMatchValue
        }
        const response = await axios.post(import.meta.env.VITE_STOP_CAMERA_STREAM, obj, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Include the bearer token in the Authorization header
            'Content-Type': 'application/json' // Ensure the content type is set correctly
          }
        })
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
          sessionStorage.clear();
        } else {
          console.error(error)
        }
      }
    };
    stopStream();
    setOpenVideoModal(false);
    setVideoError(null);
    setStreamResponse(null);
    setSelectedCameras('')
    setNestedModalData(null);
    setNestedMatchValue(null);
  };

  return (
    <>
      <StyledPaper bgColor={bgColor}>
        {/* Typography components with conditional font color */}
        <Typography sx={{ ...headings, fontSize: '18px', fontWeight: '1000' }}>{data?.map(item => item.name)}</Typography>
        <Divider />
        <Table size="small" padding="none">
          <TableHead>
            <TableRow>
              {Object.values(paperData.directions).map(item => item.points).map((points, index) => {
                const percentage =
                  (Object.values(points).filter(item => item.mode_congestion == "High").length / Object.values(points).length) *
                  100;
                const rowBgColor = percentage > 35 ? "lightPink" : "lightGreen";
                const fontColor =
                  rowBgColor === "lightGreen" ? "black" : "darkred";
                const tooltipTitle = `${Object.values(points)[0].name} towards ${Object.values(points)[Object.values(points).length - 1].name}`;
                return (
                  <TableCell
                    key={index}
                    sx={{
                      fontSize: "15px",
                      fontWeight: 500,
                      borderColor: "lightgray",
                      backgroundColor: rowBgColor,
                      color: fontColor,
                    }}
                    align="center"
                  >
                    <Tooltip title={tooltipTitle}>
                      <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
                        {index === 0 ? <ArrowUpward /> : <ArrowDownward />}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {Object.values(paperData.directions).map((item, index) => {
                const points = item.points;
                const percentage =
                  (Object.values(points).filter(item => item.mode_congestion === "High").length / Object.values(points).length) *
                  100;
                const rowBgColor = percentage > 35 ? "lightPink" : "lightGreen";
                const fontColor = rowBgColor === "lightGreen" ? "black" : "darkred";

                return (
                  <TableCell
                    key={index}
                    sx={{
                      borderColor: "lightgray",
                      padding: "5px",
                      backgroundColor: rowBgColor,
                      color: fontColor,
                      fontWeight: 500,
                    }}
                    align="center"
                  >
                    <Box
                      component="a"
                      onClick={() => handleOpen(Object.values(points).filter(item=>item.mode_congestion == "High"))}
                      sx={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      <div><Typography variant="h6" fontSize={16} fontWeight={600}>{Object.values(points).filter(item => item.mode_congestion === "High").length} Points</Typography></div>
                      <div><Typography fontSize={15} fontWeight={500}>Out of {Object.values(points).length}</Typography></div>
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </StyledPaper>

      {/* -------------------------------Modal for showing detailed information----------------------------------- */}
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
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Location
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Congestion Level
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Options</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modalContent &&
                      modalContent
                        .map((item, index) => {
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
                              /> // or any other loading indicator you prefer
                            );
                          } else if (!matchValue) {
                            iconComponent = (
                              <VideocamOff
                                sx={{ color: "grey", cursor: "not-allowed" }}
                                onClick={() =>
                                  handlePlayClick(
                                    item,
                                    selectedCameras[index]
                                  )
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
                                    sx={{ height: 36, width: 100 }} // Adjust height and width as needed
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
                                    handlePlayClick(
                                      item,
                                      selectedCameras[index]
                                    )
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
                                  backgroundColor:
                                    index % 2 ? "lightgrey" : "white",
                                }}
                              >
                                {item.name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor:
                                    index % 2 ? "lightgrey" : "white",
                                }}
                              >
                                {item.mode_congestion}
                              </TableCell>
                              <TableCell
                                sx={{
                                  backgroundColor:
                                    index % 2 ? "lightgrey" : "white",
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
      {/* -------------------------------Nested Modal for click on 1st modal----------------------------------- */}
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
  {streamResponse && <img style={{height: '100%', width: '100%'}} src={streamResponse} alt="Video Stream" />}
</Box>
          <Box sx={{ height: "48%", width: "100%" }}>
            <MapsForVideo data={nestedModalData} />
          </Box>
        </Box>
      </Modal>
    </>
  );
}

// Styles
const headings = {
  fontSize: "14px",
  fontWeight: 600,
  textAlign: "center",
  mb: 1,
  pt: 1,
};

// Modal styles
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
