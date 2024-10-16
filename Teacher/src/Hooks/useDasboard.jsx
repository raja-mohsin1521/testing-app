import { useCallback, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/teacher/dashboard";

const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAddedQuestionsCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/added-questions`,
        {
          token: localStorage.getItem("token"), // Send token in the body
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRequiredQuestionsCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/required-questions`,
        {
          token: localStorage.getItem("token"), // Send token in the body
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeacherDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/teacher-details`,
        {
          token: localStorage.getItem("token"), 
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAddedQuestionsCount,
    getRequiredQuestionsCount,
    getTeacherDetails,
  };
};

export default useDashboard;
