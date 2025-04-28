import React, { useEffect, useState } from 'react';
import './ProductosDestacados.css';
import Cookies from 'universal-cookie';
import { agregarAlCarrito } from '../Helpers/cartService';

const cookies = new Cookies();

function ProductosDestacados({ carrito, setCarrito }) {
  const [productos, setProductos] = useState([]);
  const token = cookies.get("_s"); // Obtener el token de la cookie

  useEffect(() => {
    fetch('http://localhost:8080/api/products/getAllProducts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setProductos(data.value))
      .catch(error => console.error('Error en la consulta de productos:', error));
  }, []);

  const handleAgregarAlCarrito = async (producto) => {
    try {
      await agregarAlCarrito(producto.id, 1); // 1 de cantidad inicial
      const productoEnCarrito = carrito.find(item => item.id === producto.id);

      if (productoEnCarrito) {
        // Si ya existe en carrito, solo aumenta la cantidad
        const nuevoCarrito = carrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
        setCarrito(nuevoCarrito);
      } else {
        // Si no existe, lo agrega
        setCarrito([...carrito, { 
          id: producto.id, 
          nombre: producto.name, 
          precio: producto.price, 
          cantidad: 1, 
          imagen: producto.imageURL 
        }]);
      }
    } catch (error) {
      console.error('Error agregando producto al carrito:', error);
    }
  };

  return (
    <div className="product-list">
      {productos.map((producto) => (
        <div className="product-card" key={producto.id}>
          <img src={producto.imageURL} alt={producto.name} />
          <div className="product-card-content">
            <h2>{producto.name}</h2>
            <p>{producto.description}</p>
            <p className="price">Q{producto.price}</p>            
            <button className="add-to-cart" onClick={() => handleAgregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductosDestacados;
