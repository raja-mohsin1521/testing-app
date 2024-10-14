import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginTeacher = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/teacher/auth/login`, credentials);
      const { token } = response.data;

      // Store token in local storage
      localStorage.setItem("token", token);
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeacher = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/teacher/auth/update`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    loginTeacher,
    updateTeacher,
  };
};

export default useAuth;
