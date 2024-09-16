// src/hooks/useTeacher.js
import { useState } from 'react';
import axios from 'axios';
import { useStore } from '../Store/TeachersStore';

const BASE_URL = 'http://localhost:5000/admin/teacher';

const useTeacher = () => {
  const { teachers, setTeachers } = useStore();
  const [loading, setLoading] = useState(false);

  const createTeacher = async (teacherData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/teachers`, teacherData);
      setTeachers([...teachers, response.data]);
    } catch (error) {
      console.error('Error creating teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createTeacher,
    loading,
  };
};

export default useTeacher;
