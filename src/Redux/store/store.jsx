import { configureStore } from '@reduxjs/toolkit';
import apiReducer from '../slices/get_roads_live_5min';

const store = configureStore({
  reducer: {
    api: apiReducer,
  },
});

export default store;