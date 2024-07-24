/*---------------------------api login----------------------- */
import React, { useState } from "react";
import { Box, Button, IconButton, InputAdornment, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Person, Visibility, VisibilityOff } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import pscalogo from "../assets/PSCA.png";
import "../Styles/login.css";
import qs from 'qs'

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLoginChange = (event) => {
        const value = event.target.value;
        setLogin(value);
        setLoginError('');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        try {
            const obj = {
                grant_type: '',
                username: login,
                password: password,
                scope: '',
                client_id: '',
                client_secret: ''
            };
            const formData = qs.stringify(obj);
            // Make POST request to your backend API for login
            // const response = await axios.post('https://api-itms.psca.gop.pk/verify', {
            const response = await axios.post(import.meta.env.VITE_LOGIN_AUTH, formData);
    
            if (response.data.access_token) {
                sessionStorage.setItem('token', response.data.access_token);
                sessionStorage.setItem('loginTime', Date.now());
                navigate('/Home');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoginError(<Alert sx={{position: 'fixed', top: "2%", left: 'auto', right: 'auto'}} severity="error">Invalid Username or Password. Please Try Again</Alert>);
            } else {
                setLoginError('Something went wrong. Please try again.');
            }
        }
    };

    const handleKeyPress = (event) => {
        // Handle Enter key press
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Box className="main-box" component="div">
            <Box component="div" className="inner-box">
                <img src={pscalogo} style={{ height: "25%" }} alt="PSCA Logo" />
                <br />
                <Typography variant="h5" mb={'5px'}>
                    Intelligent Traffic System
                </Typography>
                <Divider variant="fullWidth" sx={{ border: '1px solid darkgrey' }} />
                <TextField
                    type="text"
                    variant="outlined"
                    label="Enter Login"
                    sx={{ marginBottom: '10px' }}
                    margin="normal"
                    fullWidth
                    value={login}
                    onChange={handleLoginChange}
                    error={!!loginError}
                    helperText={loginError}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Person color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    label="Enter Password"
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyPress={handleKeyPress} // Handle Enter key press
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end" aria-label="toggle password visibility">
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '20px' }} onClick={handleLogin}>
                    Login
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
