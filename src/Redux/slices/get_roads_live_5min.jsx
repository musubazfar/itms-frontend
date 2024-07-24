import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRoadsData = createAsyncThunk(
  'api/fetchRoadsData',
  async (timeInterval, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token'); // Retrieve the token from sessionStorage
      const time = { "time_interval": timeInterval };

      const response = await axios.post(import.meta.env.VITE_CONGESTION_POINTS, time, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the bearer token in the Authorization header
          'Content-Type': 'application/json' // Ensure the content type is set correctly
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
        sessionStorage.clear();
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
);

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoadsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default apiSlice.reducer;