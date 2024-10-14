// src/hooks/useDashboard.js
import { useEffect } from "react";
import axios from "axios";
import { useDashboardStore } from "../Store/DashboardStore";

const BASE_URL = `${import.meta.env.VITE_SERVER}/admin/home/readall`;

const useDashboard = () => {
  const { dashboard, setDashboardData, loading, setLoading, error, setError } =
    useDashboardStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(BASE_URL);
        setDashboardData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setDashboardData, setLoading, setError]);

  return {
    dashboard,
    loading,
    error,
  };
};

export default useDashboard;
