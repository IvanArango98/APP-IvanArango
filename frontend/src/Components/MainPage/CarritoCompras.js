import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, Avatar, Button, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CarritoCompras = ({ carrito, setCarrito }) => {
  const [openModal, setOpenModal] = useState(false);

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const confirmarCompra = () => {
    setOpenModal(true);
    setCarrito([]);
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

      {/* Modal de Confirmación */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
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
            onClick={() => setOpenModal(false)}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CarritoCompras;
