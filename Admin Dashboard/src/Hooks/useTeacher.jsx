// src/hooks/useTeacher.js
import { useState } from "react";
import axios from "axios";
import { useStore,useTeacherDetails } from "../Store/TeachersStore";

const BASE_URL = `${import.meta.env.VITE_SERVER}/admin/teacher`;

const useTeacher = () => {
  const { teachers, setTeachers } = useStore();
  const { teacherDetails, setTeacherDetails } = useTeacherDetails();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTeacher = async (teacherData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/create`, teacherData);
      setTeachers((prev) => [...prev, response.data.teacher]);
      readTeachers()
      return { success: true, teacher: response.data.teacher };
    } catch (error) {
      console.error("Error creating teacher:", error);
      setError(error.response?.data || { message: "Failed to create teacher" });
      return { success: false, error: error.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const readTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/readall`);
      setTeachers(response.data);
      return { success: true, teachers: response.data };
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError(error.response?.data || { message: "Failed to fetch teachers" });
      return { success: false, error: error.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const getTeacher = async (teacher_id) => {
    setLoading(true);
    try {
      console.log('teacher_id', teacher_id)
      const response = await axios.post(`${BASE_URL}/getteacher`, { teacher_id });
      setTeacherDetails(response.data)
      return { success: true, teacher: response.data };
    } catch (error) {
      console.error("Error fetching teacher:", error);
      setError(error.response?.data || { message: "Failed to fetch teacher" });
      return { success: false, error: error.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const updateTeacher = async (teacherId,teacherData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/update`,{teacherId, teacherData});
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.teacher_id === response.data.teacher.teacher_id
            ? response.data.teacher
            : teacher
        )
      );
      readTeachers()
      return { success: true, teacher: response.data.teacher };
     
    } catch (error) {
      console.error("Error updating teacher:", error);
      setError(error.response?.data || { message: "Failed to update teacher" });
      return { success: false, error: error.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (teacher_id) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/delete`, { data: { teacher_id } });
      setTeachers((prev) => prev.filter((teacher) => teacher.teacher_id !== teacher_id));
      readTeachers()
      return { success: true };
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setError(error.response?.data || { message: "Failed to delete teacher" });
      return { success: false, error: error.response?.data };
    } finally {
      setLoading(false);
    }
  };

  return {
    createTeacher,
    readTeachers,
    getTeacher,
    updateTeacher,
    deleteTeacher,
    loading,
    error,
  };
};

export default useTeacher;
