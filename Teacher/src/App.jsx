import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import QuestionsPage from "./Pages/QuestionsPage";
import LoginPage from "./Pages/LoginPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <NavbarComponent setIsLoggedIn={setIsLoggedIn} />
      ) : null}
      
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/questions" element={<QuestionsPage />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
