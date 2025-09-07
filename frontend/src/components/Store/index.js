// import { configureStore } from '@reduxjs/toolkit';
// import boardReducer from '../Store/BoardSlice';

// const store = configureStore({
//   reducer: {
//     board: boardReducer,
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//     thunk: true, // Enables async thunks for API calls
//   }),
//   devTools: process.env.NODE_ENV !== 'production', // Enables Redux DevTools for debugging
// });

// export default store;


import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import boardReducer from './BoardSlice';
import taskReducer from './taskSlice';
import uiReducer from './uiSlice';
import authReducer from './authSlice'; // Assume auth slice for tenant/user

const rootReducer = combineReducers({
  board: boardReducer,
  task: taskReducer,
  ui: uiReducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: true,
  }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;