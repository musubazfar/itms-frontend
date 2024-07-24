import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'
import pscalogo from '../assets/images/PSCA.png'
import policelogo from '../assets/images/punjab-police.png'
import './leftNav/ApMap.css'
import LeftNavMaps from './LeftNavMaps';

const Navbar = () => {
    return (
        <>
            <Box>
                <AppBar component={'nav'} sx={{ backgroundColor: '#3667a8', position: 'relative' }}>
                    <Toolbar>
                        <Box component={'div'} sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src={pscalogo} width={'5%'} />
                            <Typography color={'#eaeef3f3'} variant='h5' component='div' sx={{ flexGrow: 1, verticalAlign: 'center', textAlign: 'center' }}>
                                PSCA - Intelligent Traffic System
                            </Typography>
                            <img src={policelogo} style={{ width: '5%' }} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box className={'container'}>
            < LeftNavMaps />
            {/* <LeftNav /> */}
            {/* <Box component={'div'} className='central-box'>
            <Paper elevation={4} sx={{ height: 'fit-content', padding: '10px', borderRadius: '15px' }}>
            <MapComponent />
            </Paper>
            <br />
            <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" disabled='true' sx={{ backgroundColor: '3667a8' }}>Submit</Button>
            </Box>
            </Box> */}
            </Box>
        </>
    )
}

export default Navbar