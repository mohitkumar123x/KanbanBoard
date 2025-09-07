import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setAuth: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tenantId = action.payload.tenantId;
      },
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tenantId = action.payload.tenantId;
    },
    logout: (state) => { state.user = null; state.token = null; state.tenantId=null},
  },
});

export const { setAuth,login, logout } = authSlice.actions;
export default authSlice.reducer;

