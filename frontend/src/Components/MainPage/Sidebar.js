// Sidebar.js
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
  Modal,
  useMediaQuery,
  Fab,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  eliminarDelCarrito,
  actualizarOrden,
  confirmarOrden,
  eliminarOrden,
  actualizarCarrito
} from '../Helpers/cartService';
import { cerrarSesion } from '../Helpers/MetodosLogin';

const Sidebar = ({
  carrito = [],
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
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [direccionEnvio, setDireccionEnvio] = useState('');


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
          setIdOrden(null);
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
      await confirmarOrden(idOrden, direccionEnvio); // 👈 usar dirección ingresada
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

  const cancelarCompra = async () => {
    try {
      for (const item of carrito) {
        await eliminarDelCarrito(item.id, item.cartItemId);
      }
      await eliminarOrden(idOrden);
      setCarrito([]);
      setIdOrden(null);
    } catch (error) {
      console.error('Error al cancelar la compra:', error);
      setErrorMessage('❌ No se pudo cancelar la compra.');
      setOpenErrorModal(true);
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : variant}
        anchor={isMobile ? 'right' : anchor}
        open={isMobile ? mobileOpen : open}
        onClose={() => {
          if (isMobile) setMobileOpen(false);
          else if (onClose) onClose();
        }}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? '100%' : 320,
          [`& .MuiDrawer-paper`]: {
            width: isMobile ? '100%' : 320,
            height: isMobile ? '100vh' : '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            padding: 2
          }
        }}
      >
        <Typography variant="h6" fontWeight="bold">Carrito de Compras</Typography>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
          <List>
            {carrito.map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => eliminarProducto(item.id)} sx={{ color: '#10069f' }}>
                  <DeleteIcon style={{ color: 'white' }} />
                </IconButton>
              }>
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
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mt: 2 }} fontWeight="bold">
            Total: Q{total.toFixed(2)}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenConfirmModal(true)}
              disabled={total <= 0}
              sx={{
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

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenCancelModal(true)}
              disabled={total <= 0}
              sx={{
                borderColor: '#10069f',
                color: 'white',
                backgroundColor: '#10069f',
                '&:hover': {
                  backgroundColor: '#0e058f'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#10069f',
                  color: 'white',
                  opacity: 0.5,
                  borderColor: '#10069f'
                }
              }}
            >
              CANCELAR COMPRA
            </Button>
          </Box>
        </Box>

        {/*  Modal Confirmar Pedido */}
        <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
          <Box sx={{ ...modalBoxStyle }}>
            <Typography variant="h6" fontWeight="bold">¿Confirmar pedido?</Typography>

            <Typography sx={{ mt: 2 }}>Ingresa tu dirección de envío:</Typography>

            <TextField
              fullWidth
              variant="standard"
              placeholder="Ej: 2a avenida 5-50 zona 10"
              value={direccionEnvio}
              onChange={(e) => setDireccionEnvio(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              disabled={direccionEnvio.trim().length < 6}
              onClick={() => { confirmarCompra(); setOpenConfirmModal(false); }}
              sx={{
                width: 120,
                backgroundColor: direccionEnvio.trim().length < 6 ? '#e0e0e0 !important' : '#2e7d32 !important',
                color: direccionEnvio.trim().length < 6 ? 'gray' : 'white',
                '&:hover': {
                  backgroundColor: direccionEnvio.trim().length < 6 ? '#e0e0e0 !important' : '#1b5e20 !important',
                },
                cursor: direccionEnvio.trim().length < 6 ? 'not-allowed' : 'pointer'
              }}
            >
              Confirmar
            </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenConfirmModal(false)}
                style={{ color: "white" }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal Cancelar */}
        <Modal open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
          <Box sx={{ ...modalBoxStyle }}>
            <Typography variant="h6" fontWeight="bold">¿Cancelar compra?</Typography>
            <Typography sx={{ mt: 2 }}>Esto eliminará todos los productos del carrito y la orden creada.</Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="error" onClick={() => { cancelarCompra(); setOpenCancelModal(false); }}>Sí, cancelar</Button>
              <Button variant="outlined" onClick={() => setOpenCancelModal(false)} style={{ color: "white" }}>No, volver</Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal Pedido Confirmado */}
        <Modal open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
          <Box sx={{ ...modalBoxStyle }}>
            <Typography variant="h6" color="green">¡Pedido Confirmado!</Typography>
            <Typography sx={{ mt: 2 }}>Gracias por tu compra. El id de tu pedido es: {localStorage.getItem('idOrden')}</Typography>
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              color="success"
              onClick={() => {
                setOpenSuccessModal(false);
                const orderId = localStorage.getItem('idOrden');
                if (orderId) {
                  localStorage.removeItem('idOrden');
                }
              }}
              style={{ color: "white" }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>

        {/* Modal Error */}
        <Modal open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
          <Box sx={{ ...modalBoxStyle, textAlign: 'center' }}>
            <Typography variant="h5" color="error" fontWeight="bold">❌ Error</Typography>
            <Typography sx={{ mt: 2 }}>{errorMessage}</Typography>
            <Button sx={{ mt: 3 }} variant="contained" color="error" onClick={() => setOpenErrorModal(false)} style={{ color: "white" }}>Cerrar</Button>
          </Box>
        </Modal>
      </Drawer>

      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 2000,
            backgroundColor: '#10069f',
            '&:hover': { backgroundColor: '#0e058f' }
          }}
        >
          <ShoppingCartIcon />
        </Fab>
      )}
    </>
  );
};

const modalBoxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', 
  maxWidth: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4
};

export default Sidebar;
