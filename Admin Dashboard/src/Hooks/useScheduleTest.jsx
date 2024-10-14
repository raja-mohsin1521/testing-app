import { useState } from "react";
import axios from "axios";
import scheduleTestStore from "../Store/ScheduleTestStore";

const API_URL = `${import.meta.env.VITE_SERVER}/admin/schedule-test`;

const useScheduleTest = () => {
  const [data, setData] = useState({
    allCities: [],
    allTests: [],
    allCenters: [],
    scheduleTests: [],
    specificCenters: [],
    detailedTestInfo: [],
  });

  const [loading, setLoading] = useState({
    allCities: false,
    allTests: false,
    allCenters: false,
    scheduleTests: false,
    specificCenters: false,
    addScheduledTest: false,
    detailedTestInfo: false,
  });

  const [error, setError] = useState(null);

  const fetchAllCities = async () => {
    setLoading((prev) => ({ ...prev, allCities: true }));
    try {
      const response = await axios.get(`${API_URL}/allcities`);
      setData((prev) => ({ ...prev, allCities: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, allCities: false }));
    }
  };

  const fetchAllTests = async () => {
    setLoading((prev) => ({ ...prev, allTests: true }));
    try {
      const response = await axios.get(`${API_URL}/alltest`);
      setData((prev) => ({ ...prev, allTests: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, allTests: false }));
    }
  };

  const fetchAllCenters = async (date, time) => {
    setLoading((prev) => ({ ...prev, allCenters: true }));
    try {
      const response = await axios.post(`${API_URL}/allcenters`, {
        date,
        time,
      });
      setData((prev) => ({ ...prev, allCenters: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, allCenters: false }));
    }
  };

  const fetchScheduleTests = async () => {
    setLoading((prev) => ({ ...prev, scheduleTests: true }));
    try {
      const response = await axios.get(`${API_URL}/allScheduleTests`);
      setData((prev) => ({ ...prev, scheduleTests: response.data.data }));
      scheduleTestStore.getState().setData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, scheduleTests: false }));
    }
  };

  const fetchSpecificCenters = async ({ city, date, time }) => {
    setLoading((prev) => ({ ...prev, specificCenters: true }));
    try {
      const response = await axios.post(`${API_URL}/specific-centers`, {
        city,
        date,
        time,
      });
      setData((prev) => ({ ...prev, specificCenters: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, specificCenters: false }));
    }
  };

  const addScheduledTest = async (scheduledTest) => {
    setLoading((prev) => ({ ...prev, addScheduledTest: true }));
    try {
      const response = await axios.post(`${API_URL}/schedule-test`, scheduledTest);
      fetchScheduleTests();
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, addScheduledTest: false }));
    }
  };

  const getDetailedTestInfo = async ({ testId, testDate, testTime, centerIds }) => {
    setLoading((prev) => ({ ...prev, detailedTestInfo: true }));
    try {
      const response = await axios.post(`${API_URL}/alldetailedTestInfo`, {
        testId,
        testDate,
        testTime,
        centerIds,
      });
      setData((prev) => ({ ...prev, detailedTestInfo: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, detailedTestInfo: false }));
    }
  };

  return {
    ...data,
    loading,
    error,
    fetchAllCities,
    fetchAllTests,
    fetchAllCenters,
    fetchScheduleTests,
    fetchSpecificCenters,
    addScheduledTest,
    getDetailedTestInfo,
  };
};

export default useScheduleTest;
