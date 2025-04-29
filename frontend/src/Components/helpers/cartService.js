import axios from 'axios';
import Cookies from 'universal-cookie';
import { cerrarSesion } from './MetodosLogin';

const cookies = new Cookies();
const API_URL = 'http://localhost:8080'; // Cambia si tu backend cambia

function getAuthHeaders() {
  const token = cookies.get("_s");
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// ✅ Agregar al carrito
export async function agregarAlCarrito(productId, quantity = 1) {
  try {    
    const response = await axios.post(`${API_URL}/api/cart/add`, {
      productId,
      quantity
    }, {
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

// ✅ Actualizar cantidad en carrito
export async function actualizarCarrito(cartItemId, productId, quantity) {
  try {
    const response = await axios.put(`${API_URL}/api/cart/update`, {
      cartItemId,
      productId,
      quantity
    }, {
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

// ✅ Eliminar producto del carrito
export async function eliminarDelCarrito(productId, orderId) {
  try {    
    const response = await axios.delete(`${API_URL}/api/cart/remove`, {
      params: {
        productId: productId,
        OrderId: orderId
      },
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


// ✅ Crear una nueva orden
export async function crearOrden(shippingAddress, products) {
  try {    
    const response = await axios.post(`${API_URL}/api/orders/createOrder`, {
      shippingAddress,
      products
    }, {
      headers: getAuthHeaders(),
      withCredentials: true
    });

    const idOrden = response.data?.value?.idOrden;
    if (idOrden) {
      localStorage.setItem('idOrden', idOrden);
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      cerrarSesion();
    }
    throw error;
  }
}

// ✅ Actualizar orden existente
export async function actualizarOrden(orderId, shippingAddress, products) {  
  try {    
    const response = await axios.put(`${API_URL}/api/orders/updateOrder`, {
      shippingAddress,
      products
    }, {
      params: { orderId },
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

// ✅ Confirmar orden
export async function confirmarOrden(orderId, shippingAddress) {
  try {    
    const response = await axios.post(`${API_URL}/api/orders/confirmOrder`, {
      orderId,
      shippingAddress
    }, {
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

  // ✅ Obtener productos del carrito
  export async function getCart() {
    try {
      const response = await axios.get('http://localhost:8080/api/cart/list', {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      return response.data; // aquí ya retorna el value con todos los productos
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        cerrarSesion();
      }
      throw error;
    }
  }

  //eliminar orden
  export async function eliminarOrden(orderId) {
    try {
      // ✅ Si no recibimos un orderId, lo buscamos en localStorage
      if (!orderId) {
        orderId = localStorage.getItem('idOrden');
      }

      const response = await axios.delete(`${API_URL}/api/orders/deleteOrder`, {
        params: {          
          orderId: orderId
        },
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      if (orderId) {
        localStorage.removeItem('idOrden');
      }
  
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        cerrarSesion();
      }
      throw error;
    }
  }
  