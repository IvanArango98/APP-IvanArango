import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import './Estilo.css';
import { validateRegistro } from './schema';
import { requestRegistro as createUser } from '../Helpers/MetodosRegistro';

// Opciones de país, ciudad y municipalidad
const paises = [{ name: 'Guatemala', code: 1 }];
const ciudades = [{ name: 'Guatemala', code: 1 }];
const municipalidades = [{ name: 'Guatemala', code: 1 }];

const FormularioRegistro = ({ setOpenSpinner }) => {
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
      }}
      validationSchema={validateRegistro}
      onSubmit={(values, { setSubmitting }) => {
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
        createUser(payload, setOpenSpinner);
      }}
    >
      {({
        values,
        handleChange,
        setFieldValue,
        handleSubmit,
        submitForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1200px', margin: '0 auto' }}>            
            {/* Fila 1 */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Primer Nombre *"
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
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

            {/* Fila 2 */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Primer Apellido *"
                id="firstLastName"
                name="firstLastName"
                value={values.firstLastName}
                onChange={handleChange}
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

            {/* Fila 3 */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label="Correo Electrónico *"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
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
                size="medium"
              />
            </Grid>

            {/* Fila 4 */}
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
                size="medium"
              />
            </Grid>

            {/* Fila 5 - País SOLO */}
            <Grid item size={6}>
              <Autocomplete
                fullWidth
                options={paises}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.code === value.code}
                value={values.country}
                onChange={(e, value) => setFieldValue('country', value)}
                renderInput={(params) => (
                  <TextField {...params} label="País *" fullWidth size="medium" />
                )}
              />
            </Grid>

            {/* Fila 6 */}
            <Grid item size={6}>
              <Autocomplete
                fullWidth
                options={ciudades}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.code === value.code}
                value={values.city}
                onChange={(e, value) => setFieldValue('city', value)}
                renderInput={(params) => (
                  <TextField {...params} label="Ciudad *" fullWidth size="medium" />
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
                  <TextField {...params} label="Municipalidad *" fullWidth size="medium" />
                )}
              />
            </Grid>

            {/* Fila 7 - Botón SOLO */}
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
        </form>
      )}
    </Formik>
  );
};

export default FormularioRegistro;
