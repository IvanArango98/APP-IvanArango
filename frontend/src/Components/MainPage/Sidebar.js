import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  Button,
  Modal
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  eliminarDelCarrito,
  actualizarOrden,
  confirmarOrden,
  eliminarOrden,
  actualizarCarrito
} from '../Helpers/cartService';
import { cerrarSesion } from '../Helpers/MetodosLogin';

const Sidebar = ({
  carrito,
  setCarrito,
  idOrden,
  setIdOrden,
  open,
  onClose,
  variant = 'permanent',
  anchor = 'left'
}) => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const eliminarProducto = async (idProducto) => {
    try {
      const item = carrito.find((item) => item.id === idProducto);
      if (!item) return;

      if (item.cantidad > 1) {
        await actualizarCarrito(item.cartItemId, item.id, item.cantidad - 1);
        const nuevoCarrito = carrito.map((p) =>
          p.id === idProducto ? { ...p, cantidad: p.cantidad - 1 } : p
        );
        setCarrito(nuevoCarrito);
        await actualizarOrden(idOrden ?? item.idOrden, 'Ciudad de Guatemala, Zona 10', nuevoCarrito.map(i => ({
          productId: i.id, quantity: i.cantidad
        })));
      } else {
        await eliminarDelCarrito(idProducto, item.cartItemId);
        const nuevoCarrito = carrito.filter((p) => p.id !== idProducto);
        setCarrito(nuevoCarrito);

        if (nuevoCarrito.length > 0) {
          await actualizarOrden(idOrden ?? item.idOrden, 'Ciudad de Guatemala, Zona 10', nuevoCarrito.map(i => ({
            productId: i.id, quantity: i.cantidad
          })));
        } else {
          await eliminarOrden(idOrden ?? item.idOrden);
        }
      }
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        cerrarSesion();
      } else {
        setErrorMessage('❌ Error al eliminar producto del carrito.');
        setOpenErrorModal(true);
      }
    }
  };

  const confirmarCompra = async () => {
    try {
      if (carrito.length === 0) {
        setErrorMessage('⚠️ El carrito está vacío.');
        setOpenErrorModal(true);
        return;
      }
      await confirmarOrden(idOrden, 'Ciudad de Guatemala, Zona 10');
      setOpenSuccessModal(true);
      setCarrito([]);
      setIdOrden(null);
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        cerrarSesion();
      } else {
        setErrorMessage('❌ Error al confirmar el pedido.');
        setOpenErrorModal(true);
      }
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <Drawer
      variant={variant}
      anchor={anchor}
      open={variant === 'temporary' ? open : undefined}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: anchor === 'bottom' ? '100%' : 320,
        height: anchor === 'bottom' ? 300 : '100vh',
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: anchor === 'bottom' ? '100%' : 320,
          height: anchor === 'bottom' ? 300 : '100vh',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          padding: 2,
          borderTop: anchor === 'bottom' ? '1px solid #ddd' : 'none'
        }
      }}
    >
      <Typography variant="h6" gutterBottom style={{fontWeight:"bold"}}>
        Carrito de Compras
      </Typography>

      <List sx={{ maxHeight: 150, overflowY: 'auto' }}>
        {carrito.map((item) => (
          <ListItem
            key={item.id}
            sx={{ px: 0 }}
            secondaryAction={
              <IconButton
                edge="end"               
                aria-label="delete"
                onClick={() => eliminarProducto(item.id)}
                sx={{ color: '#10069f' }}
              >
                <DeleteIcon style={{color:"white"}}/>
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar src={item.imagen} variant="rounded" />
            </ListItemAvatar>
            <ListItemText
              primary={item.nombre}
              secondary={`Cantidad: ${item.cantidad} | Precio: Q${item.precio}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mt: 2 }} style={{fontWeight:"bold"}}>
        Total: Q{total.toFixed(2)}
      </Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={confirmarCompra}
        disabled={total <= 0}
        sx={{
          mt: 3,
          backgroundColor: '#10069f',
          color: 'white',
          '&.Mui-disabled': {
            backgroundColor: '#10069f',
            color: 'white',
            opacity: 0.5
          }
        }}
      >
        CONFIRMAR PEDIDO
      </Button>


      {/* Modales */}
      <Modal open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 400,
          bgcolor: 'background.paper', borderRadius: '12px', boxShadow: 24, p: 4
        }}>
          <Typography variant="h6" color="green">¡Pedido Confirmado!</Typography>
          <Typography sx={{ mt: 2 }}>Gracias por tu compra.</Typography>
          <Button sx={{ mt: 3 }} variant="contained" color="success" onClick={() => setOpenSuccessModal(false)}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 400,
          bgcolor: 'background.paper', borderRadius: '12px', boxShadow: 24, p: 4, textAlign: 'center'
        }}>
          <Typography variant="h5" color="error" fontWeight="bold">❌ Error</Typography>
          <Typography sx={{ mt: 2 }}>{errorMessage}</Typography>
          <Button sx={{ mt: 3 }} variant="contained" color="error" onClick={() => setOpenErrorModal(false)}>Cerrar</Button>
        </Box>
      </Modal>
    </Drawer>
  );
};

export default Sidebar;
