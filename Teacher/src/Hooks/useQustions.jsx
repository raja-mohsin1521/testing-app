import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';

const useQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data } = useStore();

  const url = 'http://localhost:5000/teacher';

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${url}/courses`);
      return response.data;  
    } catch (err) {
      console.error("Error fetching courses:", err);
      throw err; 
    }
  };
  const fetchModules = async (courseId) => {
    try {
      const response = await axios.get(`${url}/courses/${courseId}/modules`);
      return response.data.modules;  
    } catch (err) {
      console.error(`Error fetching modules for course ${courseId}:`, err);
      throw err;  
    }
  };
  
  const getObjectiveQuestionsWithoutImages = async ( currentpage) => {
    const teacher_id=14
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${url}/questions/objective/without-images`, { teacher_id, currentpage });
      const { objective, total } = response.data;
      
      return { objective, total };
    } catch (err) {
      setError(err.response?.data || 'Error fetching objective questions without images');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectiveQuestionsWithoutImages = async (currentpage=1) => {
    const teacher_id=14
    setLoading(true);
    setError(null);
    try {
     
      const response = await axios.post(`${url}/questions/subjective/without-images`, { teacher_id, currentpage });
     
      const { subjective, total } = response.data;
      
      return { subjective, total };
    } catch (err) {
      setError(err.response?.data || 'Error fetching subjective questions without images');
    } finally {
      setLoading(false);
    }
  };

  const getObjectiveQuestionsWithImages = async ( page = 1) => {
    setLoading(true);
    setError(null);
    let teacher_id=14;
    try {
      const response = await axios.post(`${url}/questions/objective/with-images`, { teacher_id, page });
      const {  objective, total } = response.data;
      
      return {  objective, total};
    } catch (err) {
      setError(err.response?.data || 'Error fetching objective questions with images');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectiveQuestionsWithImages = async ( page = 1) => {
    setLoading(true);
    setError(null);
    const teacher_id=14
    try {
      const response = await axios.post(`${url}/questions/subjective/with-images`, {teacher_id , page });
      const { subjective, total} = response.data;
      return { subjective, total };
    } catch (err) {
      setError(err.response?.data || 'Error fetching subjective questions with images');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (formData) => {
    try {
      const response = await axios.post(`${url}/questions/add/objective`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading question:', error);
      throw error;
    }
  };

  const addSubjectiveQuestion = async (formData) => {
    try {
      const response = await axios.post(`${url}/questions/add/subjective`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading subjective question:', error);
      throw error;
    }
  };

  const updateQuestion = async (teacher_id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${url}/questions/update`, {
        teacher_id,
        ...updatedData,
      });
      await fetchQuestions(teacher_id);
    } catch (err) {
      setError(err.response?.data || 'Error updating question');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async ( id, type) => {
    if (!type) {
      setError("Question type ('sub' or 'obj') is required.");
      return;
    }
  const teacher_id=14;
    setLoading(true);
    setError(null);
  
    try {
     
      await axios.delete(`${url}/questions/delete`, {
        data: { teacher_id, id, type },
      });
  
  
    } catch (err) {
 
      const errorMessage =
        err.response?.data || "An error occurred while deleting the question.";
      setError(errorMessage);
    } finally {
      // Ensure loading state is cleared
      setLoading(false);
    }
  };
  
  const importObj = async ( data) => {
    setLoading(true);
    setError(null);
    console.log('data', data)
    try {
      const response = await axios.post(`${url}/questions/import/objective`, { teacher_id:14, data });
      
    } catch (err) {
      setError(err.response?.data || 'Error importing objective questions');
    } finally {
      setLoading(false);
    }
  };

  const importSub = async ( data) => {
    setLoading(true);
    setError(null);
    console.log('data', data)
    try {
      const response = await axios.post(`${url}/questions/import/subjective`, { teacher_id: 14, data });
      
    } catch (err) {
      setError(err.response?.data || 'Error importing subjective questions');
    } finally {
      setLoading(false);
    }
  };



  

  useEffect(() => {
    const teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id) {
      fetchQuestions(teacher_id);
    }
  }, []);

  return {
    data,
    loading,
    error,
    getObjectiveQuestionsWithoutImages,
    getSubjectiveQuestionsWithoutImages,
    getObjectiveQuestionsWithImages,
    getSubjectiveQuestionsWithImages,
    addQuestion,
    addSubjectiveQuestion,
    updateQuestion,
    deleteQuestion,
    importObj,
    importSub,
    fetchCourses,
    fetchModules
  };
};

export default useQuestion;
