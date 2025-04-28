import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('_s');

const API_URL = 'http://localhost:8080/api';

export const agregarAlCarrito = async (productId, quantity = 1) => {
  return axios.post(`${API_URL}/cart/add`, 
    { productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  );
};

export const actualizarCarrito = async (cartItemId, productId, quantity) => {
  return axios.put(`${API_URL}/cart/update`, 
    { cartItemId, productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  );
};

// Este endpoint de eliminar
export const eliminarDelCarrito = async (cartItemId, productId) => {
  return axios.delete(`${API_URL}/cart/delete`, { 
    data: { cartItemId, productId }, 
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });
};
