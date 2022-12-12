import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/common.scss';
//import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'sweetalert2/src/sweetalert2.scss';
//import 'react-toastify/dist/ReactToastify.css';
import App from './App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

