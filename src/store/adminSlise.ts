import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IShippingFields } from '../types/admin';
import { baseService, accessToken, refreshToken } from '../api/api';
import Cookies from 'js-cookie';

interface AdminState {
  isAdmin: boolean;
  isDayOff: boolean;
  loading: boolean;
  error: any;
}

const initialState: AdminState = {
  loading: false,
  isAdmin: false,
  isDayOff: false,
  error: '',
};

export const signIn = createAsyncThunk(
  'token/getToken',
  async (admin: IShippingFields, thunkAPI) => {
    try {
      const { data } = await baseService.post('/auth/login', admin);
      accessToken(data.accessToken);
      refreshToken(data.refreshToken);
      return data.isAdmin;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const checkIsAdmin = createAsyncThunk(
  'checkIsAdmin',
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get('refreshToken');
      if (token) {
        const { data } = await baseService.post('auth/login/access-token', {
          refreshToken: token,
        });
        accessToken(data.accessToken);
        refreshToken(data.refreshToken);
        return data;
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const checkIsDayOff = createAsyncThunk(
  'checkIsDayOff',
  async (_, thunkAPI) => {
    try {
      const { data } = await baseService.get('/auth/status');
      return data.isDayOff;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const dayOff = createAsyncThunk(
  'dayOff',
  async (isDayOff: boolean, thunkAPI) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const { data } = await baseService.post(
        '/auth/status',
        { isDayOff: isDayOff },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return data.isDayOff;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkIsAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkIsAdmin.fulfilled, (state, action) => {
      state.isAdmin = action.payload?.user?.isAdmin;
      state.loading = false;
    });
    builder.addCase(checkIsAdmin.rejected, (state) => {
      state.isAdmin = false;
      state.loading = false;
    });
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdmin = action.payload;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.isAdmin = false;
      state.error = action.payload;
    });
    builder.addCase(checkIsDayOff.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkIsDayOff.fulfilled, (state, action) => {
      state.isDayOff = action.payload;
      state.loading = false;
    });
    builder.addCase(dayOff.fulfilled, (state, action) => {
      state.isDayOff = action.payload;
      state.isAdmin = true;
    });
  },
});

export default adminSlice.reducer;
