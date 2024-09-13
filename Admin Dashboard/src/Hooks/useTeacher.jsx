import { useState, useEffect } from 'react';
import axios from 'axios';
import useTeacherStore from '../Store/TeachersStore';

const BASE_URL = 'https://your-api-url.com/teachers';

const useTeacher = () => {
  const { setTeachers, addTeacher, updateTeacher, deleteTeacher } = useTeacherStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTeacher = async (teacherData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(teacherData).forEach((key) => {
        formData.append(key, teacherData[key]);
      });
      const response = await axios.post(`${BASE_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      addTeacher(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const readAllTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}`);
      setTeachers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTeacherData = async (id, updatedTeacher) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(updatedTeacher).forEach((key) => {
        formData.append(key, updatedTeacher[key]);
      });
      const response = await axios.put(`${BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateTeacher(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacherData = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/${id}`);
      deleteTeacher(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTeacher,
    readAllTeachers,
    updateTeacher: updateTeacherData,
    deleteTeacher: deleteTeacherData,
  };
};

export default useTeacher;
