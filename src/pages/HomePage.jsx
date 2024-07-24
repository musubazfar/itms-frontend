import { React, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress
} from "@mui/material";
import Navbar from "../components/Navbar";
import "../App.css";
import SimplePaper from "../components/RoadPointsPapers";
import CongestionPaper from "../components/CongestionPapers";
import CongestionPaperForeCast from '../components/CongestionPaperForeCast'
import { useNavigate } from "react-router-dom";
import MapComponent from '../components/MapComponent'
import axios from "axios";
/*--------------------------------------------Swiper imports------------------------------------------- */
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Pagination, Scrollbar } from 'swiper/modules';
import '../index.css'
/*------------------------------------------------Redux Imports-----------------------------------------*/
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoadsData } from '../Redux/slices/get_roads_live_5min';

const HomePage = () => {
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

  const dispatch = useDispatch();
  const { data: apiResponses, loading, error } = useSelector(state => state.api);
  const [apiResponse_5min, setApiResponse_5min] = useState([]);
  const [apiResponse_Hourly, setApiResponse_Hourly] = useState([]);
  const [apiResponse_Daily, setApiResponse_Daily] = useState([]);
  const [forecastApi, setForecastApi] = useState([]);

  useEffect(() => {
    const fetchData = async (timeInterval, setApiResponse) => {
      const response = await dispatch(fetchRoadsData(timeInterval));
      if (response.meta.requestStatus === 'fulfilled') {
        setApiResponse(response.payload);
      } else if (response.meta.requestStatus === 'rejected' && response.payload && response.payload.status === 401) {
        navigate('/'); // Redirect to the login page
      }
    };

    // Dispatch all the fetches in parallel
    fetchData(5, setApiResponse_5min);
    fetchData(1440, setApiResponse_Hourly);
    fetchData(10080, setApiResponse_Daily);

    // Set intervals to re-fetch data
    const intervalId5min = setInterval(() => fetchData(5, setApiResponse_5min), 300000);
    const intervalIdHourly = setInterval(() => fetchData(1440, setApiResponse_Hourly), 3600000);
    const intervalIdDaily = setInterval(() => fetchData(10080, setApiResponse_Daily), 216000000);

    return () => {
      clearInterval(intervalId5min);
      clearInterval(intervalIdHourly);
      clearInterval(intervalIdDaily);
    };
  }, [dispatch, setApiResponse_5min, setApiResponse_Hourly, setApiResponse_Daily, navigate]);

  /*------------------------------------------------------------For Simple Paper(Top section of UI)----------------------------------------------------------------------------*/
  const roadId = Object.values(apiResponse_5min)
  /*----------------------------------------------------------------For Congestion Paper 24 Hour------------------------------------------------------------------------*/
  const extraction_Hourly = Object.values(apiResponse_Hourly).map(item => item.directions);
const hourlyData = extraction_Hourly.flatMap(direction => {
  return Object.values(direction).flatMap(dir => {
    return Object.values(dir.points).map(point => ({
      name: point.name,
      mode_congestion: point.mode_congestion,
      start_latLong: point.start_latlong,
      end_latLong: point.end_latlong,
      point_id: point.point_id,
      high_congestion_count: point.high_congestion_count,
      peak_hours: Object.keys(point.peak_hours).map(hour => ({
        hour: parseInt(hour), // Convert hour to integer if needed
        count: point.peak_hours[hour].count, // Access count from point.peak_hours
        pic_evidence: point.peak_hours[hour].pic_evidence // Access pic_evidance from point.peak_hours
      }))
    }));
  });
});
  /*----------------------------------------------------------------For Congestion Paper Weekly------------------------------------------------------------------------*/
  const extraction_Daily = Object.values(apiResponse_Daily).map(item => item.directions);
const weeklyData = extraction_Daily.flatMap(direction => {
  return Object.values(direction).flatMap(dir => {
    return Object.values(dir.points).map(point => ({
      name: point.name,
      mode_congestion: point.mode_congestion,
      start_latLong: point.start_latlong,
      end_latLong: point.end_latlong,
      point_id: point.point_id,
      high_congestion_count: point.high_congestion_count,
      peak_hours: Object.keys(point.peak_hours).map(hour => ({
        hour: parseInt(hour), // Convert hour to integer if needed
        count: point.peak_hours[hour].count, // Access count from point.peak_hours
        pic_evidence: point.peak_hours[hour].pic_evidence // Access pic_evidance from point.peak_hours
      }))
    }));
  });
});
  /*----------------------------------------------------------------For Congestion Paper ForeCast------------------------------------------------------------------------*/
  const forecastData = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_CONGESTION_FORECAST,{},{
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setForecastApi(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  useEffect(() => {
    forecastData();

    const intervalId = setInterval(forecastData, 3600000)
    return ()=> clearInterval(intervalId)
  }, []);

  const foreCastExtraction = [];

// Populate foreCastExtraction as before
Object.values(forecastApi).forEach((pointData) => {
  const hoursActualArray = Object.entries(pointData.hours_actual).map(
    ([hour, level]) => ({ time: hour, congestion_level: level })
  );

  const hoursPredictedArray = Object.entries(pointData.hours_predicted).map(
    ([hour, level]) => ({ time: hour, congestion_level: level })
  );

  foreCastExtraction.push({
    point_id: pointData.point_id,
    point_name: pointData.point_name,
    start_latlong: pointData.start_latlong,
    end_latlong: pointData.end_latlong,
    congestion_count: pointData.congestion_count,
    hours_actual: hoursActualArray,
    hours_predicted: hoursPredictedArray,
  });
});

// Sort by congestion_count in descending order and get top 10
const top10ForeCastExtraction = foreCastExtraction
  .sort((a, b) => b.congestion_count - a.congestion_count)
  .slice(0, 10);

  /*------------------------------------------------Sorting to send Data to congestion daily, weekly and forecasting----------------------------------------------------------*/
  const sortedWeekly = weeklyData
    .sort((a, b) => b.high_congestion_count - a.high_congestion_count)
    .filter((road) => road.high_congestion_count > 100)
    .slice(0, 20);
  const sortedDaily = hourlyData
    .sort((a, b) => b.high_congestion_count - a.high_congestion_count)
    .filter((road) => road.high_congestion_count > 10)
    .slice(0, 20);
  
  /*----------------------------------------------------------Swiper Breakpoints-----------------------------------------------------------*/
  const swiperBreakPoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    // when window width is >= 768px
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1050: {
      slidesPerView: 4,
      spaceBetween: 50,
    }
  }
  /*---------------------------------------------------------------------End of logics------------------------------------------------------------------------------*/
  return (
    <Navbar>
      <Box width={"100%"} height={"100%"}>
      <Typography variant="h5" sx={text} padding={"10px 0 10px 10px"}>
        <span style={online} />
        Live Congestion Points
      </Typography>
        <Box sx={paperBox}>
         {roadId.length<1 ? <Box sx={{display: "flex", flexDirection: 'row', height: '100%', width: '100%' , justifyContent: "center", alignItems: 'center'}}><CircularProgress/>Loading...</Box> : 
         <Swiper
            slidesPerView={6}
            spaceBetween={10} // Add some space between slides
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={7000}
            breakpoints={swiperBreakPoints}
            modules={[Mousewheel, Pagination, Scrollbar, Autoplay]}
            className="mySwiper"
          >
            {roadId?.map((paperData) => (<>
              <SwiperSlide key={paperData.id}>
                <SimplePaper paperData={paperData}/>
              </SwiperSlide>
            </>))}
          </Swiper>}
        </Box>
      <Box sx={congestionPaper}>
      <Grid
  container
  justifyContent={{
    xs: 'center',
    sm: 'center',
  }}
  spacing={2} // Adjust spacing for lg
>
  <Grid item md={4} sm={4}>
    <CongestionPaper
      category={"Last Week Congestion Stats"}
      Data={sortedWeekly}
    />
  </Grid>
  <Grid item md={4} sm={4}>
    <CongestionPaper
      category={"Last 24 Hour Congestion Stats"}
      Data={sortedDaily}
    />
  </Grid>
  <Grid item md={4} sm={4}>
    <CongestionPaperForeCast
      category={`Today's Congestion Forecast`}
      Data={top10ForeCastExtraction}
    />
  </Grid>
</Grid>

      </Box>
      <MapComponent extractedData={roadId} />
    </Box>      
    </Navbar>
  );
};

export default HomePage;

/*-------------------------------------------styles---------------------------------------------------*/

const text = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#228B22",
};

const online = {
  display: "inline-block",
  marginLeft: "5px",
  marginRight: "5px",
  borderRadius: "50%",
  borderStyle: "solid",
  borderWidth: "0.5px",
  borderColor: "green",
  backgroundColor: "green",
  height: "10px",
  width: "10px",
};

const paperBox = {
  backgroundColor: "#F0F6FF",
  width: "100%",
  p: "20px 40px",
  height: "230px",
  boxSizing: "border-box",
  overflow: "auto",
};

const congestionPaper = {
  backgroundColor: "#CDDDF4F5",
  width: "100%",
  p: "20px 20px 20px 10px",
  boxSizing: "border-box",
  marginTop: "20px",
};
