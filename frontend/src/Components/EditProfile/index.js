import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography, Modal } from '@mui/material';
import { Formik } from 'formik';
import Navbar from '../MainPage/Navbar';
import { useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../Helpers/userService';
import { validatePerfil } from './schemaPerfil';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const PerfilUsuario = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openConfirmEditModal, setOpenConfirmEditModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const navigate = useNavigate();
  const loginId = localStorage.getItem('loginId');

  useEffect(() => {
    if (loginId) {
      getUserById(loginId)
        .then(user => setUserData(user))
        .catch(error => console.error('Error al obtener datos de usuario:', error));
    }
  }, [loginId]);

  const handleConfirmEdit = () => {
    setEditing(true);
    setOpenConfirmEditModal(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleSubmitUpdate = (values) => {
    updateUser(values)
      .then(() => {
        setModalSuccess(true);
        setModalMessage('✅ Actualización exitosa.');
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error actualizando usuario:', error);
        setModalSuccess(false);
        setModalMessage(error.response?.data?.message || '❌ Error actualizando usuario.');
      })
      .finally(() => {
        setOpenResultModal(true);
      });
  };

  if (!userData) {
    return <Typography variant="h6" sx={{ m: 4 }}>Cargando datos del usuario...</Typography>;
  }

  return (    
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Perfil de Usuario
        </Typography>

        <Box
            sx={{            
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >   
        <Formik
          initialValues={{
            id: userData.id || '',
            firstName: userData.firstName || '',
            secondName: userData.secondName || '',
            firstLastName: userData.firstLastName || '',
            secondLastName: userData.secondLastName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || '',
            dateOfBirth: userData.dateOfBirth || '',
            countryName: userData.countryName || '',
            countryCode: userData.countryCode || '',
            cityName: userData.cityName || '',
            cityCode: userData.cityCode || '',
            municipalityName: userData.municipalityName || '',
            municipalityCode: userData.municipalityCode || '',
          }}
          enableReinitialize
          validationSchema={validatePerfil}
          onSubmit={(values) => handleSubmitUpdate(values)}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Campos editables */}
                {[
                  { label: "Primer Nombre", name: "firstName" },
                  { label: "Segundo Nombre", name: "secondName" },
                  { label: "Primer Apellido", name: "firstLastName" },
                  { label: "Segundo Apellido", name: "secondLastName" },
                  { label: "Correo Electrónico", name: "email" },
                  { label: "Teléfono", name: "phoneNumber" },
                  { label: "Dirección", name: "address" }
                ].map((field, index) => (
                  <Grid item size={6} key={index}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label={field.label}
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      disabled={!editing}
                      error={touched[field.name] && Boolean(errors[field.name])}
                      helperText={touched[field.name] && errors[field.name]}
                      InputLabelProps={{ style: { color: 'black' } }}
                      InputProps={{
                        style: { color: 'black' },
                      }}
                    />
                  </Grid>
                ))}

                {/* Campos de solo visualización */}
                {[
                  { label: "Fecha de Nacimiento", name: "dateOfBirth" },
                  { label: "País", name: "countryName" },
                  { label: "Ciudad", name: "cityName" },
                  { label: "Municipalidad", name: "municipalityName" }
                ].map((field, index) => (
                  <Grid item size={field.label === "Municipalidad" ? 12 : 6} key={index}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label={field.label}
                      name={field.name}
                      value={values[field.name]}
                      disabled
                      InputLabelProps={{ style: { color: 'black' } }}
                      InputProps={{
                        style: { color: 'black' },
                      }}
                    />
                  </Grid>
                ))}

                {/* Botones */}
                <Grid item xs={12} sx={{ mt: 4, textAlign: 'center' }}>
                  {!editing ? (
                    <>
                      <Button
                        variant="standard"
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                        style={{color:"white"}}
                      >
                        Regresar
                      </Button>

                      <Button variant="contained" onClick={() => setOpenConfirmEditModal(true)}>
                        Editar Perfil
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="standard"
                        onClick={handleCancelEdit}
                        sx={{ mr: 2 }}
                        style={{color:"white"}}
                      >
                        Cancelar
                      </Button>

                      <Button variant="contained" color="success" type="submit">
                        Guardar Cambios
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
        </Box>

        {/* Modal Confirmar Editar */}
        <Modal
          open={openConfirmEditModal}
          onClose={() => setOpenConfirmEditModal(false)}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6">
              ¿Estás seguro de editar tu perfil?
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" color="success" onClick={handleConfirmEdit}>
                Sí, editar
              </Button>
              <Button variant="standard" onClick={() => setOpenConfirmEditModal(false)} style={{color:"white"}}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal de Resultado */}
        <Modal
          open={openResultModal}
          onClose={() => setOpenResultModal(false)}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6">
              {modalSuccess ? '✔️ Éxito' : '❌ Error'}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              {modalMessage}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => setOpenResultModal(false)}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>

      </Box>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

export default PerfilUsuario;
