import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, Avatar, Button, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { eliminarDelCarrito, confirmarOrden } from '../Helpers/cartService';
import { cerrarSesion } from '../Helpers/MetodosLogin';

const CarritoCompras = ({ carrito, setCarrito }) => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const eliminarProducto = async (id) => {
    try {
      const item = carrito.find((item) => item.id === id);
      if (item) {
        await eliminarDelCarrito(item.id, item.idOrden);
        setCarrito(carrito.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setErrorMessage('❌ Error al eliminar producto del carrito.');
      setOpenErrorModal(true);
    }
  };

  const confirmarCompra = async () => {
    try {
      // Verificar que haya carrito
      if (carrito.length === 0) {
        setErrorMessage("⚠️ El carrito está vacío.");
        setOpenErrorModal(true);
        return;
      }

      // Agrupar los productos
      const productos = carrito.map(item => ({
        productId: item.id,
        quantity: item.cantidad
      }));

      // Tomamos el primer idOrden que tengamos en carrito (todos los productos deberían compartirlo)
      const idOrden = carrito[0]?.idOrden;
      const shippingAddress = "Ciudad de Guatemala, Zona 10";

      if (idOrden) {
        await confirmarOrden(idOrden, shippingAddress);
        setOpenSuccessModal(true);
        setCarrito([]);
      } else {
        throw new Error("ID de Orden no encontrado.");
      }
    } catch (error) {
      console.error('Error al confirmar pedido:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        cerrarSesion();
      } else {
        setErrorMessage('❌ Error al confirmar el pedido.');
        setOpenErrorModal(true);
      }
    }
  };

  const total = (carrito || []).reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <Box className="carrito">
      <Typography variant="h6" gutterBottom>
        Carrito de Compras
      </Typography>

      <List>
        {carrito.map((item) => (
          <ListItem key={item.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => eliminarProducto(item.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemAvatar>
              <Avatar src={item.imagen} />
            </ListItemAvatar>
            <ListItemText
              primary={item.nombre}
              secondary={`Cantidad: ${item.cantidad} | Precio: Q${item.precio}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: Q{total.toFixed(2)}
      </Typography>

      <Button
        fullWidth
        sx={{ mt: 3 }}
        variant="contained"
        style={{ backgroundColor: '#10069f' }}
        onClick={confirmarCompra}
        disabled={carrito.length === 0}
      >
        Confirmar Pedido
      </Button>

      {/* Modal de Confirmación Exitosa */}
      <Modal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        aria-labelledby="modal-success-title"
        aria-describedby="modal-success-description"
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
          p: 4
        }}>
          <Typography id="modal-success-title" variant="h6" color="green" component="h2">
            ¡Pedido Confirmado!
          </Typography>
          <Typography id="modal-success-description" sx={{ mt: 2 }}>
            Gracias por tu compra. Pronto recibirás tu pedido.
          </Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="success"
            onClick={() => setOpenSuccessModal(false)}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>

      {/* Modal de Error */}
      <Modal
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
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
            ❌ Error
          </Typography>
          <Typography id="modal-error-description" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="error"
            onClick={() => setOpenErrorModal(false)}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>

    </Box>
  );
};

export default CarritoCompras;
