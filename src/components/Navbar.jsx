import React, {useState, useHistory} from "react";
import { AppBar, Box, Toolbar, Typography, Link, createTheme, ThemeProvider, Button, Drawer, IconButton, Divider, Hidden} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrafficIcon from '@mui/icons-material/Traffic';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import userIcon from '../assets/user.png'
import settings1 from '../assets/settings1.png'
import background from '../assets/BlueBG.jpg'
import PSCA from '../assets/PSCA.png'
import Settings from '../assets/Settings.png'
import dbIcon from '../assets/dashboard.png'
import AlertDropDown from './AlertDropDown'
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
    typography: {
      fontFamily: 'Montserrat, Arial, sans-serif',
    },
  });

const Navbar = ({children}) => {
    const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('loginTime');
    navigate('/');
  }

  const DrawerList = (
    <Box sx={DrawerBar} role="presentation" onClick={toggleDrawer(false)} >
      <Box>
        <Box sx={{display: "flex", alignItems: 'center'}}>
        <img src={PSCA} alt="PSCA-logo"/><span style={{ color: 'rgba(29, 117, 255, 1)', fontWeight: 800, fontSize: 40}}>ITMS</span>
        </Box>
        <Divider/>
        <Typography fontSize={12} color={'#808080'} fontWeight={600}>Special Initiative of CM Punjab</Typography>
      <Box className='buttons'>
            <Link href="/Home" sx={button}><img src={dbIcon} style={{marginRight: '30px'}}/>Dashboard</Link>
            {/* <Link href='/Analytics' sx={button}><AnalyticsIcon sx={{fontSize: '30px', marginRight: '30px'}}/>Analytics</Link> */}
            <Link href='/GreenWave' sx={button}><TrafficIcon sx={{fontSize: '30px', marginRight: '30px'}}/>Green Wave</Link>
            {/* <Link href='/Admin' sx={button}><AdminPanelSettingsIcon sx={{fontSize: '30px', marginRight: '30px'}}/>Admin Panel</Link> */}
        </Box>
        </Box>
        <Box className='preferences' sx={{ ...BottomDiv, bottom: 0 }}>
            <Typography sx={preferences}>PREFERENCES</Typography>
            <Typography sx={userSettings}><img src={userIcon}/>Users</Typography>
            <Typography sx={userSettings}><img src={settings1}/>Settings</Typography>
            <Typography sx={userSettings} onClick={handleLogout}><LogoutIcon/>Logout</Typography>
        </Box>
    </Box>
  );
  return (<>
    <ThemeProvider theme={theme}>
        <AppBar>
      <Toolbar sx={toolBarDesign}>
      <Box sx={openDrawerClass}>
      {/* IconButton with MenuIcon */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </Box>
        <Box className='container' sx={navContainer}>
            <Box display={"flex"} justifyContent={'flex-start'} alignItems={"center"}><Typography variant="h4" sx={PSCAtext}>Special Initiative<br/><Typography sx={{ ...PSCAtext, fontSize: {xs: 0, sm: 0, md: '11px', lg: '18px'}}}>of CM Punjab</Typography></Typography></Box>
            <Box><Typography flexGrow={1} color={'white'} sx={{marginLeft: {md: -7, sm: 0, xs: 0}, fontSize: {lg: '32px', md: '26px', sm: '22px', xs: '15px' } }}>Intelligent Traffic Management System</Typography></Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-evenly"} width={'12%'}><AlertDropDown/><Hidden mdDown implementation="css"> <img src={PSCA} style={{minWidth: '50px'}} width={'42%'}/></Hidden></Box>
        </Box>
      </Toolbar>
      </AppBar>
      <Box mt={"90px"}>
      <Box sx={sideBar}>
        <Box className='buttons'>
            <Link href="/Home" sx={button}><img src={dbIcon} style={{marginRight: '30px'}}/>Dashboard</Link>
            {/* <Link href='/Analytics' sx={button}><AnalyticsIcon sx={{fontSize: '30px', marginRight: '30px'}}/>Analytics</Link> */}
            <Link href='/GreenWave' sx={button}><TrafficIcon sx={{fontSize: '30px', marginRight: '30px'}}/>Green Wave</Link>
            {/* <Link href='/Admin' sx={button}><AdminPanelSettingsIcon sx={{fontSize: '30px', marginRight: '30px'}}/>Admin Panel</Link> */}
        </Box>
        <Box className='preferences' sx={BottomDiv}>
            <Typography sx={preferences}>PREFERENCES</Typography>
            <Typography sx={userSettings}><img src={userIcon}/>Users</Typography>
            <Typography sx={userSettings}><img src={settings1}/>Settings</Typography>
            <Typography sx={userSettings} onClick={handleLogout}><LogoutIcon/>Logout</Typography>
        </Box>
      </Box>
      
      <Box sx={marginRemover}>{children}</Box>
      </Box>
      </ThemeProvider>
      </>);
};

export default Navbar;
/*-----------------------------------------------------------------------------------Styles Below--------------------------------------------------------------------------------------------*/
const toolBarDesign = {
    width: '100%',
    height: 90,
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    '@media screen and (max-width: 490px)': {
        padding: 0, // Hide sidebar on small and extra small devices
      }
}
const PSCAtext = {
    fontWeight: 900,
    color: 'rgba(176, 208, 240, 1)',
    fontSize: {lg: '32px', md: '16px', sm: '0', xs: '0' },
}

const navContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingRight: 6
  };

const sideBar = {
    backgroundColor: 'rgba(201, 216, 237, 1)',
    height: '100vh',
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    padding: '0 2px',
    justifyContent: 'space-between',
    flexGrow: 1,
    zIndex: 1001,
    '@media screen and (max-width: 1050px)': {
        display: 'none' // Hide sidebar on small and extra small devices
      }
    
}
const DrawerBar = {
    backgroundColor: 'rgba(201, 216, 237, 1)',
    height: '100vh',
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 2px',
    justifyContent: 'space-between',
    flexGrow: 1,
    zIndex: 1001,
}

const button = {
    width: '214px',
    background: 'rgba(70, 118, 173, 1)',
    color: 'rgba(244, 244, 244, 1)',
    display: 'flex',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    alignItems: 'center',
    padding: '20px 0 20px 20px',
    borderRadius: '10px',
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: '700',
}

const BottomDiv = {
    position: 'relative',
    bottom: 100,
    width: '100%', 
}

const preferences = {
    color: 'rgba(29, 117, 255, 1)',
    fontSize: '14px',
    fontWeight: '700',
    padding: '20px 0'
}

const userSettings = {
    color: 'rgba(29, 117, 255, 1)',
    fontSize: 16,
    fontWeight: 500,
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
}

const openDrawerClass = {
    marginLeft: '20px',
    '@media screen and (min-width: 1050px)': {
      display: 'none'
    }
  };

  const marginRemover = {
    flexGrow: 1, // Allows the Box to take the remaining space
    width: { 
      lg: 'calc(100% - 218px)', // Calculate width minus sidebar for large screens
      md: 'calc(100% - 218px)', // Adjust for medium screens as well
      sm: '100%', // Full width for small screens
      xs: '100%', // Full width for extra small screens
    },
    ml: { 
      lg: '218px', // Margin left only for large screens
      md: '218px', // Margin left for medium screens
      sm: 0, // No margin left for small screens
      xs: 0, // No margin left for extra small screens
    },
    '@media screen and (max-width: 1050px)': {
      ml: 0,
      width: '100%'
    },
  };
