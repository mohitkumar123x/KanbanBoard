import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './index.css';


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);


import { Provider } from 'react-redux';
import store from '../src/components/Store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);


