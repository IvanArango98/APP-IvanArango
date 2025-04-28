import React,{useState,useEffect} from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Formulario  from './Formulario'
import './Estilo.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Logo from '../../Resources/Logos/Logo.png'

function Copyright(props) {
  return (
    <Typography 
    className='TipoLetra'
    align="center" {...props}>
      {'Copyright © Prueba Tecnica '}     
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Login = () => {     
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
            <Container    
            className = "container-IniciarSesion"             
            maxWidth="xs" 
            fixed={true}          
           >            
        <Box
          sx={{            
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >                                  
        <img className="LogoLogin" src={Logo} alt="Logo Online Shopping" />                  
          <Box component="form" noValidate sx={{ mt: 1 }}>          
          <Formulario
          setOpenSpinner={setOpenSpinner}
          />     
          </Box>

          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>        
      
      </Container>                   
                </div>                                                               
                </div>    
  );
}

export default Login;