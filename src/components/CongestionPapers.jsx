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
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close'
import LineChart from './LineChartCongestionPaper'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination, Scrollbar } from 'swiper/modules';
import '../index.css'
import ExportToExcel from "./ExcelExport";
import dayjs from "dayjs";
import MapsCongestionPaper from "./MapsCongestionPaper";
import PhotoTwoToneIcon from '@mui/icons-material/PhotoTwoTone';
import HideImageTwoToneIcon from '@mui/icons-material/HideImageTwoTone';

export default function CongestionPaper(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [postResponse, setPostResponse] = useState(null);
  const file_name = dayjs().format('DD_MM_YYYY_HH_mm_ss_SSS');

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
    return null;
  }

  return (
    <StyledPaper>
      <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
        <Typography sx={headings}>{props.category}</Typography>
        <ExportToExcel data={props.Data} fileName={props.category.includes('Week') ? `Weekly_${file_name}` : `Hourly_${file_name}`} />
      </Box>
      <Divider color={"black"} sx={{ height: "1px" }} />

      <Box height="100%">
        {props.Data.length < 1 ? <Box sx={{ display: "flex", flexDirection: 'row', height: '100%', width: '100%', justifyContent: "center", alignItems: 'center' }}><CircularProgress />Loading...</Box> :
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
              <SwiperSlide key={road.id}>
                <ListItem
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: 0
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
                    {road.peak_hours.some(hour => hour.pic_evidence) ? <PhotoTwoToneIcon sx={{ color: "green" }} /> : <HideImageTwoToneIcon sx={{ color: 'red' }} />}{road.name}
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
                    High
                  </Typography>
                </ListItem>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <Divider sx={{ bgcolor: 'black', height: '2px' }} />
            </SwiperSlide>
          </Swiper>
        }
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
          <Button endIcon={<CloseIcon />} sx={{ position: 'absolute', right: 0 }} onClick={() => setModalOpen(false)} />
          <Typography variant="h6" component="h2">
            Road Details
          </Typography>
          {selectedRoad && (
            <Typography variant="body1">
              Road Name: {selectedRoad.name}
            </Typography>
          )}
          {selectedRoad && (
            <Typography variant="body1">
              Total Count: {selectedRoad.high_congestion_count}
            </Typography>
          )}
          {selectedRoad && (
            <Typography variant="body1">
              Legend: <span style={{ backgroundColor: 'red', padding: 4 }}>High</span> <span style={{ backgroundColor: 'yellow', padding: 4 }}>Mild</span> <span style={{ backgroundColor: 'green', padding: 4 }}>Low</span>
            </Typography>
          )}
          {selectedRoad && (
            <LineChart data={{ selectedRoad }} />
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