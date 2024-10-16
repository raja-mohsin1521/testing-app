import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store'; 

const useQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data, setData } = useStore(); 
const url='http://localhost:5000/teacher'
const fetchQuestions = async () => {
  setLoading(true);
  setError(null);
  const token = localStorage.getItem('token');
  console.log('token', token);
  
  try {
    const response = await axios.post(`${url}/questions/get`, { token }); 
    console.log('response', response)
    setData(response.data.questions);
  } catch (err) {
    setError(err.response.data.message || "Error fetching questions");
  } finally {
    setLoading(false);
  }
};


  const addQuestion = async (newQuestion) => {
    setLoading(true);
    setError(null);
    console.log('a')
      try {
      await axios.post(`${url}/questions/add`, newQuestion);

      fetchQuestions();
    } catch (err) {
      setError(err.response.data.message || "Error adding question");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (updatedQuestion) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${url}/questions/update`, updatedQuestion);
      fetchQuestions();
    } catch (err) {
      setError(err.response.data.message || "Error updating question");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${url}/questions/delete`, { data: { id: questionId } });
      fetchQuestions();
    } catch (err) {
      setError(err.response.data.message || "Error deleting question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return { data, loading, error,fetchQuestions, addQuestion, updateQuestion, deleteQuestion };
};

export default useQuestion;
