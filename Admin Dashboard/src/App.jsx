import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Sidebar from './Components/menuBar';



function App() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex' }}>
     
      <Sidebar/>
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
