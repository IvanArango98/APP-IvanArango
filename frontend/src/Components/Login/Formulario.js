import React,{useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Formik } from 'formik';
import { InputAdornment } from '@mui/material';
import './Estilo.css'
import {validate} from './schema'
import {InicioSesion} from '../Helpers/MetodosLogin'

const Formulario = (props) => {  
    const {setOpenSpinner} = props
    
    return (       
    <Formik
    initialValues={{ user: '', password: '' }}
    //validationSchema = {validate} 
    validationSchema={validate}
    onSubmit={(values, { setSubmitting }) => {      
      InicioSesion(values,setOpenSpinner);
    }}
  >
    {({
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      submitForm
      /* and other goodies */
    }) => (
      <form onSubmit={handleSubmit}>
             <hr/>
             <TextField label="Usuario" variant="outlined"
             id="user"             
             placeholder="Ingrese nombre de usuario"
             name="user" 
             required
             fullWidth    
        onChange={handleChange}
        value={values.user}
        error={touched.user && Boolean(errors.user)}                            
        helperText={touched.user && errors.user}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          )
        }} 
        />
   <hr/>
    <TextField label="Contraseña" variant="outlined"
             id="password"             
             placeholder="Ingrese contraseña"
             name="password" 
             type={'password'}
             required
             fullWidth    
             onChange={handleChange}
             value={values.password}
             error={touched.password && Boolean(errors.password)}
             helperText={touched.password && errors.password}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <VpnKeyIcon />
                 </InputAdornment>
               ),
             }}
        />

            <Button 
            style={{backgroundColor:"#10069f"}}
            sx={{ mt: 3, mb: 2 }} 
            color="primary" 
            variant="contained" 
            fullWidth 
            //disabled={isSubmitting}
            disableElevation
            onClick={submitForm}
            >Iniciar Sesión</Button>                                
          </form>
       )}
     </Formik>                                              
  );
}

export default Formulario;