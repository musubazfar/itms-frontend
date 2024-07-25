import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Tabs, Tab, Box, Button, ButtonGroup } from '@mui/material';
import Navbar from '../components/Navbar';
import CityDataTable from '../components/CityDataTable'
// ---------------------------------------------------------- Prime Data Table Styles import-----------------------------------------------------------
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  const [activeTable, setActiveTable] = useState(null);

  const handleButtonClick = (tableNumber) => {
    setActiveTable(tableNumber);
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <PrimeReactProvider>
    <Navbar>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable" // Enable scrolling
            scrollButtons="auto" // Show scroll buttons when needed
          >
            <Tab label="City Options" {...a11yProps(0)} sx={{ fontWeight: 'bolder' }} />
            <Tab label="Camera Options" {...a11yProps(1)} sx={{ fontWeight: 'bolder' }} disabled />
            <Tab label="User Management" {...a11yProps(2)} sx={{ fontWeight: 'bolder' }} disabled />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button onClick={() => handleButtonClick(1)}>Add New City</Button>
              <Button onClick={() => handleButtonClick(2)}>Select City</Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CityDataTable/>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    </Navbar>
    </PrimeReactProvider>
  );
}
