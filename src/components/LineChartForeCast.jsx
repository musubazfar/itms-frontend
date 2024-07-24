import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function BarDemo({ data }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    // Ensure data exists before processing
    if (!data || !data.hours_actual || data.hours_actual.length === 0) return null;

    const xAxisval = data.hours_actual.map(item => item.time);
    const yAxisval = data.hours_actual.map(item => {
        switch (item.congestion_level) {
            case 'High':
                return 3;
            case 'Medium':
                return 2;
            case 'Low':
                return 1;
            default:
                return 0;
        }
    });

    const actualValues = data.hours_predicted.map(item => {
        switch (item.congestion_level) {
            case 'High':
                return 3;
            case 'Medium':
                return 2;
            case 'Low':
                return 1;
            default:
                return 0;
        }
    });


    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const pointBackgroundColors = yAxisval.map(value => {
            switch (value) {
                case 1:
                    return '#96CC39';
                case 2:
                    return '#FFBF00';
                case 3:
                    return 'red';
                default:
                    return 'black';
            }
        });

        const actualValuesColor = actualValues.map(value => {
            switch (value) {
                case 1:
                    return '#96CC39';
                case 2:
                    return '#FFBF00';
                case 3:
                    return 'red';
                default:
                    return 'black';
            }
        });

        const chartData = {
            labels: actualValues,
            datasets: [
                {
                    label: 'Predicted Data',
                    data: yAxisval,
                    tension: 0.4,
                    pointBackgroundColor: pointBackgroundColors,
                    pointRadius: 5,
                },
                {
                    label: 'Actual Data',
                    data: actualValues,
                    tension: 0.4,
                    pointBackgroundColor: actualValuesColor,
                    pointRadius: 5,
                }
            ]
        };

        const chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    ticks: {
                        color: textColorSecondary,
                        stepSize: 1,
                        callback: function(value) {
                            const hour = parseInt(value, 10) % 12 || 12;
                            const period = parseInt(value, 10) < 12 ? 'AM' : 'PM';
                            return hour + ' ' + period;
                        }
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    title: {
                        display: true,
                        text: 'Time (Hours)',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    min: 0,
                    max: 4,
                    ticks: {
                        color: textColorSecondary,
                        stepSize: 1,
                        callback: function(value) {
                            switch (value) {
                                case 3:
                                    return 'High';
                                case 2:
                                    return 'Medium';
                                case 1:
                                    return 'Low';
                                default:
                                    return '';
                            }
                        }
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    title: {
                        display: true,
                        text: 'Freq. of Congestion',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            }
        };

        setChartData(chartData);
        setChartOptions(chartOptions);
    }, [data]);

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
            <div className="card">
                <Chart type="line" data={chartData} options={chartOptions} />
            </div>
        </>
    );
}