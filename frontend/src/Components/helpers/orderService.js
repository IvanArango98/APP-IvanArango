import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('_s');

const API_URL = 'http://localhost:8080/api';

export const crearOrden = async (shippingAddress, productos) => {
  return axios.post(`${API_URL}/orders/createOrder`,
    {
      shippingAddress,
      products: productos
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  );
};

export const confirmarOrden = async (orderId, shippingAddress) => {
  return axios.post(`${API_URL}/orders/confirmOrder`,
    {
      orderId,
      shippingAddress
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  );
};
