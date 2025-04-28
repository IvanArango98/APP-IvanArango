import React, { useEffect, useState } from 'react';
import './ProductosDestacados.css';
import Cookies from 'universal-cookie';
import { agregarAlCarrito } from '../Helpers/cartService';
import { cerrarSesion } from '../Helpers/MetodosLogin'; 
import { Modal, Box, Typography, Button } from '@mui/material';

const cookies = new Cookies();

function ProductosDestacados({ carrito, setCarrito }) {
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const token = cookies.get("_s");

  useEffect(() => {
    fetch('http://localhost:8080/api/products/getAllProducts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 401 || response.status === 403) {
          setIsSessionExpired(true);
          setErrorMessage("⚠️ Sesión expirada. Por favor inicia sesión nuevamente.");
          setOpenModal(true);
          throw new Error("Sesión expirada");
        }
        return response.json();
      })
      .then(data => setProductos(data.value))
      .catch(error => {
        console.error('Error en la consulta de productos:', error);
        if (!isSessionExpired) {
          setErrorMessage("❌ Error al obtener el catálogo de productos.");
          setOpenModal(true);
        }
      });
  }, []);

  const handleAgregarAlCarrito = async (producto) => {
    try {
      const response = await agregarAlCarrito(producto.id, 1); 
      const idOrden = response?.value?.idOrden;

      const productoEnCarrito = carrito.find(item => item.id === producto.id);

      if (productoEnCarrito) {
        const nuevoCarrito = carrito.map(item =>
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        setCarrito(nuevoCarrito);
      } else {
        setCarrito([...carrito, { 
          id: producto.id, 
          nombre: producto.name, 
          precio: producto.price, 
          cantidad: 1, 
          imagen: producto.imageURL,
          idOrden: idOrden 
        }]);
      }
    } catch (error) {
      console.error('Error agregando producto al carrito:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setIsSessionExpired(true);
        setErrorMessage("⚠️ Sesión expirada. Por favor inicia sesión nuevamente.");
      } else {
        setErrorMessage("❌ Error al agregar el producto al carrito.");
      }
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    if (isSessionExpired) {
      cerrarSesion();
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-error-title"
        aria-describedby="modal-error-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: '12px',
          boxShadow: 24,
          p: 4,
          textAlign: 'center'
        }}>
          <Typography id="modal-error-title" variant="h5" color="error" fontWeight="bold">
            {isSessionExpired ? "⚠️ Sesión Expirada" : "❌ Error"}
          </Typography>
          <Typography id="modal-error-description" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="error"
            onClick={handleCloseModal}
          >
            {isSessionExpired ? "Ir al Login" : "Cerrar"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ProductosDestacados;
