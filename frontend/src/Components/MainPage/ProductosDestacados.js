import React, { useEffect, useState } from 'react';
import './ProductosDestacados.css';
import Cookies from 'universal-cookie';
import { agregarAlCarrito, actualizarCarrito, crearOrden, actualizarOrden, getCart } from '../Helpers/cartService';
import { cerrarSesion } from '../Helpers/MetodosLogin';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

const cookies = new Cookies();

function ProductosDestacados({ carrito, setCarrito, idOrden, setIdOrden }) {
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); //  NUEVO estado de búsqueda

  const token = cookies.get('_s');

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
          setErrorMessage('⚠️ Sesión expirada. Por favor inicia sesión nuevamente.');
          setOpenModal(true);
          throw new Error('Sesión expirada');
        }
        return response.json();
      })
      .then(data => setProductos(data.value))
      .catch(error => {
        console.error('Error en la consulta de productos:', error);
        if (!isSessionExpired) {
          setErrorMessage('❌ Error al obtener el catálogo de productos.');
          setOpenModal(true);
        }
      });
  }, []);

  const handleAgregarAlCarrito = async (producto) => {
    try {
      let idOrdenActual = idOrden;
      if (!idOrdenActual) {
        const nuevaOrden = await crearOrden('Ciudad de Guatemala, Zona 10', [{
          productId: producto.id,
          quantity: 1
        }]);
        idOrdenActual = nuevaOrden.value.idOrden;
        setIdOrden(idOrdenActual);
      }

      const cartResponse = await getCart();
      const productoEnCarrito = cartResponse.value.find(item => item.productId === producto.id);

      if (productoEnCarrito) {
        await actualizarCarrito(productoEnCarrito.cartItemId, producto.id, productoEnCarrito.quantity + 1);
      } else {
        await agregarAlCarrito(producto.id, 1);
      }

      const updatedCart = await getCart();
      setCarrito(updatedCart.value.map(item => {
        const productoOriginal = productos.find(p => p.id === item.productId);
        return {
          id: item.productId,
          nombre: item.productName,
          precio: item.price,
          cantidad: item.quantity,
          imagen: productoOriginal?.imageURL || '',
          cartItemId: item.cartItemId,
          idOrden: idOrdenActual
        };
      }));

      const productosActualizar = updatedCart.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      await actualizarOrden(idOrdenActual, 'Ciudad de Guatemala, Zona 10', productosActualizar);

    } catch (error) {
      console.error('Error agregando producto al carrito:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setIsSessionExpired(true);
        setErrorMessage('⚠️ Sesión expirada. Por favor inicia sesión nuevamente.');
      } else {
        setErrorMessage('❌ Error al agregar el producto al carrito.');
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

  //  Función que filtra productos por búsqueda
  const filteredProducts = productos.filter(producto =>
    producto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list">
      {/*  Campo de búsqueda arriba */}
      <Box sx={{ width: '100%', marginBottom: 3, display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "60%"}}
        />
      </Box>

      {/*  Mostrar productos filtrados */}
      {filteredProducts.length === 0 ? (
  <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
    No se encontraron productos.
  </Typography>
      ) : (
        filteredProducts.map((producto) => (
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
        ))
      )}

      {/* Modal de Error o Sesión Expirada */}
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
          <Typography id="modal-error-title" variant="h5" component="h2" color="error" fontWeight="bold">
            {isSessionExpired ? '⚠️ Sesión Expirada' : '❌ Error'}
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
            {isSessionExpired ? 'Ir al Login' : 'Cerrar'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ProductosDestacados;
