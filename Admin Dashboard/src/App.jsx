import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Sidebar from './Components/menuBar';
import Teachers from './Pages/Teachers';
import TestCenters from './Pages/TestCenters';
import Students from './Pages/Students';
import ScheduleTest from './Pages/ScheduleTest';
import Papers from './Pages/Papers';
import Requests from './Pages/Requests';
import Complains from './Pages/Complains';
import Test from './Pages/Test';

function App() {
  const location = useLocation();


  const isLoginPage = location.pathname === '/login';

  return (
    <div style={{ display: 'flex' }}>
 
      {!isLoginPage && <Sidebar />}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/test-centers" element={<TestCenters />} />
          <Route path="/add-test" element={<Test />} />
          <Route path="/students" element={<Students />} />
          <Route path="/scheduled-tests" element={<ScheduleTest />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/complains" element={<Complains />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
