import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './Estilo.css';
import { validateRegistro } from './schema';
import { requestRegistro } from '../Helpers/MetodosRegistro';

const paises = [{ name: 'Guatemala', code: 1 }];
const ciudades = [{ name: 'Guatemala', code: 1 }];
const municipalidades = [{ name: 'Guatemala', code: 1 }];

const FormularioRegistro = ({ setOpenSpinner }) => {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false); // true = éxito, false = error

  return (
    <Formik
      initialValues={{
        firstName: '',
        secondName: '',
        firstLastName: '',
        secondLastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        country: null,
        city: null,
        municipality: null,
        userName: '',
        password: '',
      }}
      validationSchema={validateRegistro}
      onSubmit={(values) => {
        const payload = {
          ...values,
          countryName: values.country?.name || '',
          countryCode: values.country?.code || 0,
          cityName: values.city?.name || '',
          cityCode: values.city?.code || 0,
          municipalityName: values.municipality?.name || '',
          municipalityCode: values.municipality?.code || 0,
          transactionType: "CC",
        };

        const loginPayload = {
          email: values.email,
          userName: values.userName,
          password: values.password,
        };

        setOpenSpinner(true);

        requestRegistro.CrearUsuario(payload)
          .then((response) => {
            if (response.status === 200) {
              return requestRegistro.RegisterLogin(loginPayload);
            } else {
              throw new Error('Error creando usuario.');
            }
          })
          .then((responseLogin) => {
            if (responseLogin.status === 200) {
              setModalSuccess(true);
              setModalMessage('Registro exitoso.');
            } else {
              throw new Error('Error registrando login.');
            }
          })
          .catch((error) => {
            console.error(error);
            setModalSuccess(false);
            setModalMessage(error.response?.data?.message || error.message || 'Ocurrió un error.');
          })
          .finally(() => {
            setOpenSpinner(false);
            setOpenModal(true);
          });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
        submitForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Primera fila */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Primer Nombre *"
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                size="medium"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Segundo Nombre"
                id="secondName"
                name="secondName"
                value={values.secondName}
                onChange={handleChange}
                size="medium"
              />
            </Grid>

            {/* Segunda fila */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Primer Apellido *"
                id="firstLastName"
                name="firstLastName"
                value={values.firstLastName}
                onChange={handleChange}
                error={touched.firstLastName && Boolean(errors.firstLastName)}
                helperText={touched.firstLastName && errors.firstLastName}
                size="medium"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Segundo Apellido"
                id="secondLastName"
                name="secondLastName"
                value={values.secondLastName}
                onChange={handleChange}
                size="medium"
              />
            </Grid>

            {/* Tercera fila */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Correo Electrónico *"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                size="medium"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Teléfono *"
                id="phoneNumber"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
                size="medium"
              />
            </Grid>

            {/* Cuarta fila */}
            <Grid item size={12}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento *"
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={values.dateOfBirth}
                onChange={handleChange}
                error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                size="medium"
              />
            </Grid>

            <Grid item size={6}>
              <TextField
                fullWidth
                label="Dirección *"
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                size="medium"
              />
            </Grid>

            {/* Quinta fila */}
            <Grid item size={6}>
              <Autocomplete
                fullWidth
                options={paises}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.code === value.code}
                value={values.country}
                onChange={(e, value) => setFieldValue('country', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="País *"
                    fullWidth
                    size="medium"
                    error={touched.country && Boolean(errors.country)}
                    helperText={touched.country && errors.country}
                  />
                )}
              />
            </Grid>

            {/* Sexta fila */}
            <Grid item size={6}>
              <Autocomplete
                fullWidth
                options={ciudades}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.code === value.code}
                value={values.city}
                onChange={(e, value) => setFieldValue('city', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ciudad *"
                    fullWidth
                    size="medium"
                    error={touched.city && Boolean(errors.city)}
                    helperText={touched.city && errors.city}
                  />
                )}
              />
            </Grid>

            <Grid item size={6}>
              <Autocomplete
                fullWidth
                options={municipalidades}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.code === value.code}
                value={values.municipality}
                onChange={(e, value) => setFieldValue('municipality', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Municipalidad *"
                    fullWidth
                    size="medium"
                    error={touched.municipality && Boolean(errors.municipality)}
                    helperText={touched.municipality && errors.municipality}
                  />
                )}
              />
            </Grid>

            {/* Séptima fila - Usuario y Contraseña */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Usuario *"
                id="userName"
                name="userName"
                value={values.userName}
                onChange={handleChange}
                error={touched.userName && Boolean(errors.userName)}
                helperText={touched.userName && errors.userName}
                size="medium"
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Contraseña *"
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                size="medium"
              />
            </Grid>

            {/* Botón */}
            <Grid item size={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ backgroundColor: '#10069f', mt: 3 }}
                onClick={submitForm}
              >
                Registrarme
              </Button>
            </Grid>

          </Grid>

          {/* Modal Final */}
          <Modal
            open={openModal}
            onClose={() => {
              setOpenModal(false);
              if (modalSuccess) {
                navigate('/InicioSesion');
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{
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
            }}>
              {modalSuccess ? (
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green' }} />
              ) : (
                <HighlightOffIcon sx={{ fontSize: 60, color: 'red' }} />
              )}
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 2 }}>
                {modalSuccess ? 'Éxito' : 'Error'}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {modalMessage}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => {
                  setOpenModal(false);
                  if (modalSuccess) {
                    navigate('/InicioSesion');
                  }
                }}
              >
                Cerrar
              </Button>
            </Box>
          </Modal>

        </form>
      )}
    </Formik>
  );
};

export default FormularioRegistro;
