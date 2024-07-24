

import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function LineDemo({ data }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const xAxisval = data?.map(item => item.hour);
    const yAxisval = data?.map(item => item.Congestion);

    // Function to map numerical values to labels
    const mapYAxisValues = (value) => {
        switch (value) {
            case 1:
                return 'Low';
            case 2:
                return 'Medium';
            case 3:
                return 'High';
            default:
                return ''; // Return empty string for other values
        }
    };

    useEffect(() => {
        if (!data) return; // Don't proceed if data is not available

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Function to map congestion level to pointBackgroundColor
        const mapPointBackgroundColor = (congestion) => {
            switch (congestion) {
                case 1:
                    return '#96CC39';
                case 2:
                    return '#FFBF00';
                case 3:
                    return 'red';
                default:
                    return 'black'; // Default color
            }
        };

        const chartData = {
            labels: xAxisval,
            datasets: [
                {
                    label: 'Congestion',
                    data: yAxisval,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: yAxisval.map(congestion => mapPointBackgroundColor(congestion)),
                    pointRadius: 5
                }
            ]
        };

        const chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    min: 0, // Set minimum value of Y-axis
                    max: 4, // Set maximum value of Y-axis
                    ticks: {
                        color: textColorSecondary,
                        stepSize: 1, // Set step size to 1 to only show integer values
                        callback: mapYAxisValues // Use the custom callback function for y-axis labels
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(chartData);
        setChartOptions(chartOptions);
    }, [data]);

    if (!data) return null;

    return (
        <div className="card">
            <Chart type="line" data={chartData} options={chartOptions} />
        </div>
    )
}