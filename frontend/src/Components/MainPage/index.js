import React, { useState, useEffect } from 'react';
import { Grid, Box, Fab } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BannerPrincipal from './BannerPrincipal';
import ProductosDestacados from './ProductosDestacados';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useMediaQuery from '@mui/material/useMediaQuery';

const MainPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [idOrden, setIdOrden] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (carrito.length === 0) {
      setIdOrden(null);
      localStorage.removeItem('idOrden');
    }
  }, [carrito]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar permanente para escritorio */}
      {!isMobile && (
        <Sidebar
          carrito={carrito}
          setCarrito={setCarrito}
          idOrden={idOrden}
          setIdOrden={setIdOrden}
        />
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <BannerPrincipal />
          <Grid container spacing={2} sx={{ mt: 1, height: '100%' }}>
            <Grid item xs={12} md={12}>
              <ProductosDestacados
                carrito={carrito}
                setCarrito={setCarrito}
                idOrden={idOrden}
                setIdOrden={setIdOrden}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Botón flotante en móviles */}
      {isMobile && (
        <>
          <Fab
            color="primary"
            aria-label="carrito"
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              backgroundColor: '#10069f'
            }}
          >
            <ShoppingCartIcon />
          </Fab>

          {/* Drawer móvil */}
          <Sidebar
            carrito={carrito}
            setCarrito={setCarrito}
            idOrden={idOrden}
            setIdOrden={setIdOrden}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            variant="temporary"
            anchor="bottom"
          />
        </>
      )}
    </Box>
  );
};

export default MainPage;
