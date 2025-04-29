import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BannerPrincipal from './BannerPrincipal';
import ProductosDestacados from './ProductosDestacados';

const MainPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [idOrden, setIdOrden] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (carrito.length === 0) {
      setIdOrden(null);
      localStorage.removeItem('idOrden');
    }
  }, [carrito]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      {/* Sidebar fijo en escritorio */}
      {!isMobile && (
        <Sidebar
          carrito={carrito}
          setCarrito={setCarrito}
          idOrden={idOrden}
          setIdOrden={setIdOrden}
          variant="permanent"
          anchor="left"
        />
      )}

      {/* Contenedor principal */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Navbar />

        <Box sx={{ p: 2 }}>
          <BannerPrincipal />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProductosDestacados
                carrito={carrito}
                setCarrito={setCarrito}
                idOrden={idOrden}
                setIdOrden={setIdOrden}
                openSidebar={() => setSidebarOpen(true)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Sidebar móvil */}
      {isMobile && (
        <Sidebar
          carrito={carrito}
          setCarrito={setCarrito}
          idOrden={idOrden}
          setIdOrden={setIdOrden}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant="temporary"
          anchor="right"
        />
      )}
    </Box>
  );
};

export default MainPage;
