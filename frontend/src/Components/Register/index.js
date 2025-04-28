import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormularioRegistro from './Formulario';
import './Estilo.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Logo from '../../Resources/Logos/Logo.png';
import Link from '@mui/material/Link';

function Copyright(props) {
  return (
    <Typography 
      className='TipoLetra'
      align="center"
      {...props}
    >
      {'Copyright © Prueba Tecnica '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Register = () => {
  const [openSpinner, setOpenSpinner] = useState(false);

  return (
    <div className="Inicio">
      <div className="PrincipalLog">
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openSpinner}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Container className="container-IniciarSesion" maxWidth={false} disableGutters>
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}
  >
    <img className="LogoLogin" src={Logo} alt="Logo Online Shopping" />
    <Box component="form" noValidate sx={{ width: '100%' }}>
      <FormularioRegistro setOpenSpinner={setOpenSpinner} />
    </Box>    
    <Copyright sx={{ mt: 5, mb: 2 }} />
  </Box>
</Container>
      </div>
    </div>
  );
};

export default Register;
