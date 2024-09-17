import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/admin/schedule-test'; 

const useScheduleTest = () => {
  const [data, setData] = useState({
    allCities: [],
    allTests: [],
    allCenters: [],
    scheduleTests: [],
    specificCenters: [],
  });
  const [loading, setLoading] = useState({
    allCities: false,
    allTests: false,
    allCenters: false,
    scheduleTests: false,
    specificCenters: false,
    addScheduledTest: false,
  });
  const [error, setError] = useState(null);

  const fetchAllCities = useCallback(async () => {
    setLoading(prev => ({ ...prev, allCities: true }));
    try {
      const response = await axios.get(`${API_URL}/allcities`);
      console.log('response', response)
      setData(prev => ({ ...prev, allCities: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(prev => ({ ...prev, allCities: false }));
    }
  }, []);

  const fetchAllTests = useCallback(async () => {
    setLoading(prev => ({ ...prev, allTests: true }));
    try {
      const response = await axios.get(`${API_URL}/alltest`);
      console.log('response', response)
      setData(prev => ({ ...prev, allTests: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(prev => ({ ...prev, allTests: false }));
    }
  }, []);

  const fetchAllCenters = useCallback(async () => {
    setLoading(prev => ({ ...prev, allCenters: true }));
    try {
      const response = await axios.get(`${API_URL}/allcenters`);
      console.log('response', response)
      setData(prev => ({ ...prev, allCenters: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(prev => ({ ...prev, allCenters: false }));
    }
  }, []);

  const fetchScheduleTests = useCallback(async () => {
    setLoading(prev => ({ ...prev, scheduleTests: true }));
    try {
      const response = await axios.get(`${API_URL}/allScheduleTests`);
      setData(prev => ({ ...prev, scheduleTests: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(prev => ({ ...prev, scheduleTests: false }));
    }
  }, []);

  const fetchSpecificCenters = useCallback(async (city) => {
    setLoading(prev => ({ ...prev, specificCenters: true }));
    try {
      const response = await axios.post(`${API_URL}/specific-centers`, { city });
      console.log('response', response)
      setData(prev => ({ ...prev, specificCenters: response.data.data }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(prev => ({ ...prev, specificCenters: false }));
    }
  }, []);

  const addScheduledTest = useCallback(async (scheduledTest) => {
    setLoading(prev => ({ ...prev, addScheduledTest: true }));
    try {
        console.log('first', scheduledTest)
      const response = await axios.post(`${API_URL}/schedule-test`, scheduledTest);
      console.log('response', response)
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, addScheduledTest: false }));
    }
  }, []);

  return {
    ...data,
    loading,
    error,
    fetchAllCities,
    fetchAllTests,
    fetchAllCenters,
    fetchScheduleTests,
    fetchSpecificCenters,
    addScheduledTest
  };
};

export default useScheduleTest;
