import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import dayjs from "dayjs";
import { Chart } from "primereact/chart";
import axios from "axios";
import { Modal, Box, CircularProgress, Button, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function BarDemo({data}) {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [postResponse, setPostResponse] = useState(null);

  const xAxisval = Array.from({ length: 24 }, (_, i) => i);
  const yAxisval = Array.from({ length: 24 }, (_, i) => {
    const hourData = data.selectedRoad.peak_hours.find(
      (item) => item.hour === i
    );
    return hourData ? { count: hourData.count, pic_evidence: hourData.pic_evidence } : { count: 0, pic_evidence: false };
  });

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const maxValue = Math.max(...yAxisval.map((val) => val.count));
    const threshold30 = maxValue * 0.3;
    const threshold59 = maxValue * 0.59;

    const chartData = {
      labels: xAxisval,
      datasets: [
        {
          label: "Congestion levels",
          data: yAxisval.map((val) => val.count),
          backgroundColor: yAxisval.map((val) => {
            let baseColor;
            if (val.count >= threshold59) {
              baseColor = "red";
            } else if (val.count >= threshold30) {
              baseColor = "yellow";
            } else {
              baseColor = "green";
            }
            return val.pic_evidence ? baseColor : `rgba(${getRGBA(baseColor)}, 0.5)`;
          }),
        },
      ],
    };

    const chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false,
          labels: {
            fontColor: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const count = context.raw;
              const picEvidence = yAxisval[context.dataIndex].pic_evidence;
              return [
                `Count: ${count}`,
                picEvidence ? "Click to view pictures!" : "No pictures available"
              ];
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 23,
          ticks: {
            color: textColorSecondary,
            stepSize: 1,
            callback: function (value) {
              const hour = value % 12 || 12;
              const period = value < 12 ? "AM" : "PM";
              return hour + " " + period;
            },
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: "Time (Hours)",
            color: textColor,
            font: {
              weight: "bold",
            },
          },
        },
        y: {
          min: 0,
          ticks: {
            color: textColorSecondary,
            stepSize: 1,
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: "Freq. of High Congestion",
            color: textColor,
            font: {
              weight: 600,
            },
          },
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const clickedElement = elements[0];
          const dataIndex = clickedElement.index;
          const hourData = data.selectedRoad.peak_hours.find(
            (item) => item.hour === dataIndex
          );
          if (hourData && hourData.pic_evidence) {
            setModalOpen(true);
            const postData = async () => {
              try {
                const obj = {
                  point_id: data.selectedRoad.point_id,
                  hour: hourData.hour,
                  date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
                };
                const response = await axios.post(
                  import.meta.env.VITE_IMG_EVIDENCE,
                  obj,
                  {
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                    },
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
                setPostResponse("");
              }
            };
            postData();
          }
        }
      },
    };

    setChartData(chartData);
    setChartOptions(chartOptions);
  }, [data]);


  const getRGBA = (color) => {
    switch (color) {
      case "red":
        return "255, 0, 0";
      case "yellow":
        return "255, 255, 0";
      case "green":
        return "0, 128, 0";
      default:
        return "0, 0, 0";
    }
  };

  const CloseModal = () => {
    setModalOpen(false);
    setPostResponse(null);
  };

  return (
    <>
      <style>
        {`
          .card {
            width: 800px;
            height: 400px;
          }
          @media (max-width: 1000px) {
            .card {
              width: 100%;
              height: 100%;
            }
          }
        `}
      </style>
      {Object.keys(chartData).length < 1 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          Loading...
        </Box>
      ) : (
        <div className="card">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      )}
      <Modal open={modalOpen} onClose={CloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            height: "80%",
            width: "80%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            boxSizing: "border-box",
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            endIcon={<CloseIcon />}
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={CloseModal}
          />
          {!postResponse ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
              Loading...
            </Box>
          ) : postResponse.length < 1 ? (
            <Alert severity="error">
              Something Went Wrong... Check Camera Status or Make Sure Camera is
              Available at the location
            </Alert>
          ) : (
            <Swiper
              pagination={{
                type: "fraction",
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="mySwiper"
              loop={true}
            >
              {postResponse?.map((item) => (
                <SwiperSlide key={item}>
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={`data:image/png;base64,${item}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>
      </Modal>
    </>
  );
}
