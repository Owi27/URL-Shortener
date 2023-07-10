import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB4QHNF_Ycg-TZnkx51XVKEL1sBF76HVl4",
  authDomain: "url-shortener-bcfd8.firebaseapp.com",
  databaseURL: "https://url-shortener-bcfd8-default-rtdb.firebaseio.com",
  projectId: "url-shortener-bcfd8",
  storageBucket: "url-shortener-bcfd8.appspot.com",
  messagingSenderId: "269491281251",
  appId: "1:269491281251:web:6161a831b9cca8338d8756",
  measurementId: "G-YB0FE35CPP"
};

initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
