import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './router/App';
import './i18n'; // Import i18n configuration

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);