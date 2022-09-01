import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';

import HomePage from './pages/HomePage';
import Detail from './pages/Detail';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />}>
                  <Route path="homepage" element={<HomePage />} />
                  <Route path="/detail/:detailId" element={<Detail />} />
	          <Route path="*" element={
			              <div style={{ padding: "1rem"}}>
		                           <p>There is nothing here!</p>
			              </div>
		                  }
	         />
	      </Route>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

