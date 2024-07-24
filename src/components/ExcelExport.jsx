import React from 'react';
import { writeFile, utils } from 'xlsx';
import Button from '@mui/material/Button';

const ExportToExcel = ({ data, fileName }) => {
  const transformData = (data) => {
    const transformedData = [];

    // Helper function to convert 24-hour format to 12-hour AM/PM format
    const convertToAmPm = (hour) => {
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hour12 = hour % 12 || 12;
      return `${hour12} ${ampm}`;
    };

    // Define the header row
    const header = [
      "Name",
      "Starting Position",
      "Ending Position",
      ...Array.from({ length: 24 }, (_, i) => convertToAmPm(i)) // Creates "12 AM", "1 AM", ..., "11 PM"
    ];

    transformedData.push(header);

    // Process each location's data
    Object.keys(data).forEach(key => {
      const item = data[key];
      const row = {
        name: item.name,
        start_latLong: `https://www.google.com/maps/dir/${item.start_latLong.replace(/\s+/g, '')}`,
        end_latLong: `https://www.google.com/maps/dir/${item.end_latLong.replace(/\s+/g, '')}`,
      };

      // Find the highest peak hour count for this location
      const maxCount = Math.max(...item.peak_hours.map(hourData => hourData.count));

      // Helper function to categorize the count
      const categorizeCount = (count) => {
        if (count <= 0.3 * maxCount) return 'Low';
        if (count <= 0.69 * maxCount) return 'Medium';
        return 'High';
      };

      // Initialize hour columns with "Low" as default
      for (let i = 0; i < 24; i++) {
        row[convertToAmPm(i)] = 'Low';
      }

      // Fill in the peak hours data with categorized values
      item.peak_hours.forEach(hourData => {
        row[convertToAmPm(hourData.hour)] = categorizeCount(hourData.count);
      });

      // Convert row object to array and push to transformedData
      transformedData.push([
        row.name,
        row.start_latLong,
        row.end_latLong,
        ...Array.from({ length: 24 }, (_, i) => row[convertToAmPm(i)])
      ]);
    });

    return transformedData;
  };

  const exportToExcel = () => {
    // Transform the data
    const transformedData = transformData(data);

    // Convert the array to a worksheet
    const worksheet = utils.aoa_to_sheet(transformedData);

    // Create a new workbook
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Export the workbook to an Excel file
    writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    // <button onClick={exportToExcel}>Export to Excel</button>
    <Button variant="contained" onClick={exportToExcel} sx={{height: 32}}>Export</Button>
  );
};

export default ExportToExcel;
