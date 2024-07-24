import React, { useState } from "react";
import {
  Box,
  Divider,
  ListItem,
  Paper,
  Typography,
  styled,
  Modal,
  Button,
  CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LineChart from '../components/LineChartForeCast'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination, Scrollbar } from 'swiper/modules';
import '../index.css'
import MapsForVideo from "./MapsForVideo";

export default function CongestionPaper(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState(null);

  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    boxShadow: theme.shadows[10],
    overflow: "hidden",
    width: "80%",
    height: "374px",
    backgroundColor: "#FAF9F6",
    borderRadius: "30px",
    position: "relative",
    [theme.breakpoints.only('xs')]: {
      width: "325px",
    },
  
    [theme.breakpoints.up('sm')]: {
      width: "80%", 
    },
    [theme.breakpoints.only('sm')]: {
      width: "80%",
      padding: theme.spacing(1) 
    },
  }));
  const handleRoadClick = (road) => {
    setSelectedRoad(road);
    setModalOpen(true);
  };

  if (!props.Data) {
    return null; // or return a loading indicator
  }
  return (
    <StyledPaper>
      <Typography sx={headings}>{props.category}</Typography>
      <Divider color={"black"} sx={{ height: "1px" }} />
<Box height="100%">
{props.Data.length<1 ? <Box sx={{display: "flex", flexDirection: 'row', height: '100%', width: '100%' , justifyContent: "center", alignItems: 'center'}}><CircularProgress/>Loading...</Box> :
      <Swiper
        direction="vertical"
        slidesPerView={5}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={3000}
        modules={[Mousewheel, Pagination, Scrollbar, Autoplay]}
        className="mySwiper"
      >
        {props.Data?.map((road) => (
          <SwiperSlide key={road.point_id}>
            <ListItem
              sx={{ 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderRadius: '4px' 
              }}
              onClick={() => handleRoadClick(road)}
            >
              <Typography
                    variant="body1"
                    sx={{
                      fontSize: {
                        xs: '16px',
                        sm: '10px',
                        md: '14px',
                        lg: '16px'
                      },
                      fontWeight: '400',
                      marginRight: '10px',
                      width: '90%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                {road.point_name}
              </Typography>
              <Typography
                variant="body1"
                component="a"
                href="#"
                sx={{ color: 'red', textDecoration: 'underline', cursor: 'pointer', width: '10%',fontSize: {
                  xs: '16px',
                  sm: '10px',
                  md: '14px',
                  lg: '16px' 
                } }}
              >
                {/* {road.high_congestion_count} */}
                High
              </Typography>
            </ListItem>
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <Divider sx={{ bgcolor: 'black', height: '2px'}}/>
        </SwiperSlide>
      </Swiper>}
    </Box>
      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
            <Button endIcon={<CloseIcon/>} sx={{position: 'absolute', right: 0}} onClick={() => setModalOpen(false)}/>
          <Typography variant="h6" component="h2">
            Road Details
          </Typography>
          {selectedRoad && (
            <Typography variant="body1">
              Road Name: {selectedRoad.point_name}
            </Typography>
          )}
          {selectedRoad && (
            <Typography variant="body1">
              Total Count: {selectedRoad.congestion_count}
            </Typography>
          )}
          <Typography variant="body1">
              Details:
            </Typography>
          {selectedRoad && (
            <Box sx={{height: '100%', width: '100%'}}>
              <LineChart data={selectedRoad}/>
              <Box
  sx={{
    height: {
      xs: '100px',
      sm: '200px',
    },
    width: '100%',
  }}
>
  <MapsForVideo data={selectedRoad} />
</Box>
              </Box>
          )}
        </Box>
      </Modal>
    </StyledPaper>
  );
}

const headings = {
  color: "black",
  fontSize: "14px",
  fontWeight: 600,
  mb: 2,
  pt: 1,
};