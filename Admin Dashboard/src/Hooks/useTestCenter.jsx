import { useState, useEffect } from 'react';
import axios from 'axios';
import { TestCenterStore, BookingStore } from '../Store/TestCenterStore';

const API_URL = 'http://localhost:5000/admin/testcenter';

const useTestCenter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTestCenters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/readall`);
      TestCenterStore.getState().setData(response.data.data); // Update Zustand store
      console.log('response a', response);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTestCenter = async (testCenterData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/create`, testCenterData);
      console.log('response b', response);
      fetchTestCenters(); // Refresh the test centers
      fetchTestCenterDetails(); // Refresh the test center details
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTestCenter = async (testCenterData) => {
    setLoading(true);
    try {
      console.log('first', testCenterData)
      const response = await axios.put(`${API_URL}/update`, testCenterData);
      fetchTestCenters(); // Refresh the test centers
      fetchTestCenterDetails(); // Refresh the test center details
    console.log('response', response)
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestCenter = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/delete`, { data: { id } });
      console.log('response');
      fetchTestCenters(); // Refresh the test centers
      fetchTestCenterDetails(); // Refresh the test center details
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestCenterDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/details`);
      console.log('response:', response);
      BookingStore.getState().setData(response.data.data); 
      setError(null);
    } catch (error) {
      console.error('Error fetching test center details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestCenters();
    fetchTestCenterDetails();
  }, []);

  return {
    testCenters: TestCenterStore.getState().data,
    testCenterDetails: BookingStore.getState().data,
    loading,
    error,
    addTestCenter,
    updateTestCenter,
    deleteTestCenter,
    fetchTestCenterDetails,
    fetchTestCenters
  };
};

export default useTestCenter;
