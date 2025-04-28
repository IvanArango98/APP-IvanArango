import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BannerPrincipal from './BannerPrincipal';
import ProductosDestacados from './ProductosDestacados';
import ProductosRecomendados from './ProductosRecomendados';
import CarritoCompras from './CarritoCompras';

const MainPage = () => {
  const [carrito, setCarrito] = useState([]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <BannerPrincipal />
          <Grid container spacing={2} sx={{ mt: 1, height: '100%' }}>
            <Grid item xs={12} md={8} sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <ProductosDestacados carrito={carrito} setCarrito={setCarrito} />
            </Grid>
            <Grid item xs={12} md={4} sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              <ProductosRecomendados />
              <CarritoCompras carrito={carrito} setCarrito={setCarrito} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
