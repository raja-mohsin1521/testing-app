import { useState, useEffect } from 'react';
import axios from 'axios';
import  TestStore  from '../Store/TestStore';

const API_URL = 'http://localhost:5000/admin/test';

const useTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/readall`);
      TestStore.getState().setData(response.data.data); // Update Zustand store
      console.log('response a', response);
      setError(null);
    } catch (error) {
       
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const addTest = async (TestData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/create`, TestData);
      console.log('response b', response);
      fetchTests(); 
     
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTest = async (TestData) => {
    setLoading(true);
    try {
      console.log('first', TestData)
      const response = await axios.put(`${API_URL}/update`, TestData);
      fetchTests(); 
      
    console.log('response', response)
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/delete`, { data: { id } });
      console.log('response');
      fetchTests(); 
    
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchTests();

  }, []);

  return {
    Tests: TestStore.getState().data,
    loading,
    error,
    addTest,
    updateTest,
    deleteTest,
    fetchTests
  };
};

export default useTest;
