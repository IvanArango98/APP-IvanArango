// PerfilTabs.js
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Navbar from '../MainPage/Navbar';
import PerfilUsuario from '../EditProfile/index';
import OrdenesUsuario from '../Orders/index';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const PerfilTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#ffffff' }}>
      {/* Navbar */}
      <Navbar />

      {/* Tabs */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#E1F5FE', // 🔵 Celeste muy claro, tipo pastel
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
          zIndex: 10,
          position: 'relative',
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{
            style: { backgroundColor: '#0288d1', height: 4 }, // Línea indicador azul fuerte
          }}
          sx={{
            '.MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '64px',
              transition: 'all 0.3s ease',
              color: '#0277bd', // 🔵 Texto azul medio cuando no seleccionado
              backgroundColor: '#E1F5FE', // 🔵 Celeste clarito de fondo
              '&:hover': {
                backgroundColor: '#B3E5FC', // 🔵 Hover un celeste un poco más fuerte
              },
              '& svg': {
                color: '#0277bd', // 🔵 Icono azul medio
              },
            },
            '.Mui-selected': {
              color: '#ffffff', // ⚪ Texto blanco cuando seleccionado
              backgroundColor: '#0288d1', // 🔵 Azul fuerte al seleccionar
              '& svg': {
                color: '#ffffff', // ⚪ Icono blanco cuando seleccionado
              },
              '&:hover': {
                backgroundColor: '#0288d1', // 🔵 Mantener mismo azul al hover
              },
            },
          }}
        >
          <Tab icon={<PersonIcon />} label="Perfil de Usuario" iconPosition="start" />
          <Tab icon={<ReceiptLongIcon />} label="Mis Órdenes" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          p: 3,
          bgcolor: '#ffffff',
        }}
      >
        {tabIndex === 0 && <PerfilUsuario />}
        {tabIndex === 1 && <OrdenesUsuario />}
      </Box>
    </Box>
  );
};

export default PerfilTabs;
