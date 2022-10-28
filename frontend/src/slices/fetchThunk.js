/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const fetchData = createAsyncThunk(
  'fetchData',
  async (token) => {
    const response = await axios.get(routes.dataPath(), {
      headers:
        { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

export default fetchData;
