// src/hooks/useTeacher.js
import { useState } from 'react';
import axios from 'axios';
import { useStore } from '../Store/TeachersStore';

const BASE_URL = 'http://localhost:5000/admin/teacher';

const useTeacher = () => {
  const { teachers, setTeachers } = useStore();
  const [loading, setLoading] = useState(false);

  // Function to create a new teacher
  const createTeacher = async (teacherData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/create`, teacherData);
      console.log('response', response);
      readTeachers()
      setTeachers([...teachers, response.data.teacher]);
    } catch (error) {
      console.error('Error creating teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to read all teachers
  const readTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/readall`);
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update a teacher
  const updateTeacher = async (teacherData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/update`, teacherData);
      const updatedTeachers = teachers.map((teacher) =>
        teacher.teacher_id === response.data.teacher.teacher_id
          ? response.data.teacher
          : teacher
      );
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error updating teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a teacher
  const deleteTeacher = async (teacher_id) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/delete`, { data: { teacher_id } });
      const updatedTeachers = teachers.filter((teacher) => teacher.teacher_id !== teacher_id);
      readTeachers()
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error deleting teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createTeacher,
    readTeachers,
    updateTeacher,
    deleteTeacher,
    loading,
  };
};

export default useTeacher;
