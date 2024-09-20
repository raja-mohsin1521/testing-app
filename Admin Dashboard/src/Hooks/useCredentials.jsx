import axios from 'axios';

const API_URL = 'http://localhost:5000/admin/auth'; 

export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data; 
  } catch (error) {
    throw error.response.data; 
  }
};

export const updateAdminPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/update-password`, {
      email,
      newPassword,
    });
    return response.data; 
  } catch (error) {
    throw error.response.data; 
  }
};
