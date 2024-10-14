import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import HomePage from "./components/HomePage";
import QuestionsPage from "./components/QuestionsPage";
import LoginPage from "./components/LoginPage";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className={darkMode ? "dark-mode" : ""}>

      {isLoggedIn && <NavbarComponent toggleDarkMode={() => setDarkMode(!darkMode)} isDarkMode={darkMode} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/questions" element={<QuestionsPage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
