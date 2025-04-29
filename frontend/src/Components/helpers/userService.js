// src/Helpers/userService.js
import axios from 'axios';
import Cookies from 'universal-cookie';
import { cerrarSesion } from './MetodosLogin';

const API_URL = 'http://localhost:8080';
const cookies = new Cookies();

function getAuthHeaders() {
  const token = cookies.get("_s");
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// ✅ Obtener usuario por ID
export async function getUserById(userId) {
  try {
    const response = await axios.get(`${API_URL}/api/users/getUser`, {
      params: { id: userId },
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data.value;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      cerrarSesion();
    }
    throw error;
  }
}

// ✅ Actualizar usuario
export async function updateUser(data) {
  try {
    console.log(data)
    const response = await axios.put(`${API_URL}/api/users/updateUser`, data, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      cerrarSesion();
    }
    throw error;
  }
}
