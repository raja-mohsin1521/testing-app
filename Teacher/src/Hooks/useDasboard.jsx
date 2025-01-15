import { useCallback, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/teacher/dashboard";

const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Retrieve token once to reuse in all API calls

  const getAddedQuestionsCount = useCallback(async () => {
    console.log("Fetching added questions count");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/added-questions`, {
        token, // Include token in the request body
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getRequiredQuestionsCount = useCallback(async () => {
    console.log("Fetching required questions count");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/required-questions`, {
        token, // Include token in the request body
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getTeacherDetails = useCallback(async () => {
    console.log("Fetching teacher details");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/teacher-details`, {
        token, // Include token in the request body
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    error,
    getAddedQuestionsCount,
    getRequiredQuestionsCount,
    getTeacherDetails,
  };
};

export default useDashboard;
