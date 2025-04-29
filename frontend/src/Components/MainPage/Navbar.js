import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { cerrarSesion } from '../Helpers/MetodosLogin';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#10069f' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Tienda Deportiva
        </Typography>
        <Button color="inherit" href='/EditarPerfil'>Perfil</Button>
        <Button color="inherit" onClick={cerrarSesion}>Cerrar Sesión</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
