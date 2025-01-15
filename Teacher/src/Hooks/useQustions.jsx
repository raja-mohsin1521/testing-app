import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';

const useQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data } = useStore();

  const url = 'http://localhost:5000/teacher';
  const getToken = () => localStorage.getItem('token');
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
    console.log('co', courseId)
    try {
      const response = await axios.get(`${url}/courses/${courseId}/modules`);
      return response.data.modules;  
    } catch (err) {
      console.error(`Error fetching modules for course ${courseId}:`, err);
      throw err;  
    }
  };
  const fetchSpecificModule = async (moduleId) => {
    try {
      const response = await axios.get(`${url}/courses/modules/${moduleId}`);
      return response.data.modules;  
    } catch (err) {
      console.error(`Error fetching module for ${courseId}:`, err);
      throw err;  
    }
  };

  const getObjectiveQuestionsWithoutImages = async ( currentpage,course,difficulty, sortBy, sortOrder) => {
    console.log('firstaaaaaaaaaaaaaaaaaa', course, sortBy, sortOrder)
    const teacher_id=await getToken()
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${url}/questions/objective/without-images`, { teacher_id, currentpage,course,difficulty, sortBy, sortOrder });
      const { objective, total } = response.data;
      
      return { objective, total };
    } catch (err) {
      setError(err.response?.data || 'Error fetching objective questions without images');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectiveQuestionsWithoutImages = async (currentpage,course,difficulty, sortBy, sortOrder) => {
    const teacher_id=await getToken()
    setLoading(true);
    setError(null);
    try {
     
      const response = await axios.post(`${url}/questions/subjective/without-images`, { teacher_id, currentpage,currentpage,course,difficulty, sortBy, sortOrder });
     console.log('first', response)
      const { subjective, total } = response.data;
      return { subjective, total };
      
    } catch (err) {
      setError(err.response?.data || 'Error fetching subjective questions without images');
    } finally {
      setLoading(false);
    }
  };

  const getObjectiveQuestionsWithImages = async ( page = 1,course,difficulty, sortBy, sortOrder) => {
    setLoading(true);
    setError(null);
    const teacher_id=await getToken()
    try {
      const response = await axios.post(`${url}/questions/objective/with-images`, { teacher_id, page ,course,difficulty, sortBy, sortOrder});
      const {  objective, total } = response.data;
      
      return {  objective, total};
    } catch (err) {
      setError(err.response?.data || 'Error fetching objective questions with images');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectiveQuestionsWithImages = async ( page = 1,course,difficulty, sortBy, sortOrder) => {
    setLoading(true);
    setError(null);
    const teacher_id=await getToken()
    try {
      const response = await axios.post(`${url}/questions/subjective/with-images`, {teacher_id , page,course,difficulty, sortBy, sortOrder });
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
     
      console.log('response', response)

      return {error:response.data,status:response.status}
      
    } catch (error) {
      console.error('Error uploading question:', error);
     
      return {error:error.response.data,status:error.response.status};
    }
  };

  const editObjQuestion = async (formData) => {
    try {
      const response = await axios.post(`${url}/questions/edit/objective`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
     
      console.log('response', response)

      return {error:response.data,status:response.status}
      
    } catch (error) {
      console.error('Error uploading question:', error);
     
      return {error:error.response.data,status:error.response.status};
    }
  };

  const addSubjectiveQuestion = async (formData) => {
    try {
      const response = await axios.post(`${url}/questions/add/subjective`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      getObjectiveQuestionsWithoutImages('1')
      getSubjectiveQuestionsWithoutImages('1')
      getObjectiveQuestionsWithImages('1')
      getSubjectiveQuestionsWithImages('1')
      console.log('first', response.data)
      return {error:response.data,status:response.status}
    } catch (error) {
      console.error('Error uploading subjective question:', error);
      return {error:error.response.data,status:error.response.status};
    }
  };

  const updateObjQuestion = async ( updatedData) => {
    setLoading(true);
    setError(null);
    try {
     const a= await axios.post(`${url}//questions/edit/objective`, {
      updatedData,
      });
    clo(aaaaa)
    } catch (err) {
      setError(err.response?.data || 'Error updating question');
    } finally {
      setLoading(false);
    }
  };


  const updateSubQuestion = async ( updatedData) => {
    setLoading(true);
    setError(null);
    try {
     const a= await axios.post(`${url}//questions/edit/subjective`, {
      updatedData,
      });
    clo(aaaaa)
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
  const teacher_id=getToken();
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
      
      setLoading(false);
    }
  };
  
  const importObj = async ( data) => {
    setLoading(true);
    setError(null);
    console.log('data', data)
    try {
      const response = await axios.post(`${url}/questions/import/objective`, { teacher_id:getToken(), data });
      getObjectiveQuestionsWithoutImages('1')
      getSubjectiveQuestionsWithoutImages('1')
      getObjectiveQuestionsWithImages('1')
      getSubjectiveQuestionsWithImages('1')
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
      const response = await axios.post(`${url}/questions/import/subjective`, { teacher_id: getToken(), data });
      getObjectiveQuestionsWithoutImages('1')
      getSubjectiveQuestionsWithoutImages('1')
      getObjectiveQuestionsWithImages('1')
      getSubjectiveQuestionsWithImages('1')
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
    editObjQuestion,
    fetchSpecificModule,
    getObjectiveQuestionsWithoutImages,
    getSubjectiveQuestionsWithoutImages,
    getObjectiveQuestionsWithImages,
    getSubjectiveQuestionsWithImages,
    addQuestion,
    addSubjectiveQuestion,
    updateObjQuestion,
    updateSubQuestion,
    deleteQuestion,
    importObj,
    importSub,
    fetchCourses,
    fetchModules
  };
};

export default useQuestion;
