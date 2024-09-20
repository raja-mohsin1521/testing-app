import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import ScheduleTestDetails from './Pages/ScheduleTestDetails';
import TeacherDetails from './Pages/TeacherDetails';

function App() {
  const location = useLocation();
  const token = localStorage.getItem('authToken'); 
  const isLoginPage = location.pathname === '/login';

  return (
    <div style={{ display: 'flex' }}>
      {!isLoginPage && <Sidebar />}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          {/* If token is present, show the main app routes */}
          {token ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/test-centers" element={<TestCenters />} />
              <Route path="/add-test" element={<Test />} />
              <Route path="/students" element={<Students />} />
              <Route path="/scheduled-tests" element={<ScheduleTest />} />
              <Route path="/papers" element={<Papers />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/complains" element={<Complains />} />
              <Route path="/scheduletestdetail/:test_id/:test_date/:test_time" element={<ScheduleTestDetails />} />

              <Route path={`/teachers/:teacherId`} element={<TeacherDetails />} />

              
              
              <Route path="/login" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // If no token, only show the login page and redirect other routes to login
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
