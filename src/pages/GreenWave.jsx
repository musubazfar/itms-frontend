import React from 'react'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Box } from '@mui/material'
import MapsGreenWave from '../components/MapsGreenWave'
import { useNavigate } from 'react-router-dom'

const GreenWave = () => {
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

  return (
    <Navbar>
    <Box sx={{width: '100%', height: '80vh'}}>
        <MapsGreenWave/>
    </Box>
    </Navbar>
  )
}

export default GreenWave