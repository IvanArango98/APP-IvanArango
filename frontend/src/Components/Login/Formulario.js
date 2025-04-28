import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Formik } from 'formik';
import { InputAdornment, Modal, Box, Typography } from '@mui/material';
import { validate } from './schema';
import { InicioSesion } from '../Helpers/MetodosLogin';
import './Estilo.css';

const Formulario = (props) => {
    const { setOpenSpinner } = props;
    const [openModal, setOpenModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <>
            <Formik
                initialValues={{ user: '', password: '' }}
                validationSchema={validate}
                onSubmit={(values) => {
                    InicioSesion(values, setOpenSpinner, setErrorMessage, setOpenModal);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    submitForm
                }) => (
                    <form onSubmit={handleSubmit}>
                        <hr />
                        <TextField
                            label="Usuario"
                            variant="outlined"
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
                        <hr />
                        <TextField
                            label="Contraseña"
                            variant="outlined"
                            id="password"
                            placeholder="Ingrese contraseña"
                            name="password"
                            type="password"
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
                                )
                            }}
                        />

                        <Button
                            style={{ backgroundColor: "#10069f" }}
                            sx={{ mt: 3, mb: 2 }}
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={submitForm}
                        >
                            Iniciar Sesión
                        </Button>
                    </form>
                )}
            </Formik>

            {/* Modal de Error */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-error-title"
                aria-describedby="modal-error-description"
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
                    <Typography id="modal-error-title" variant="h5" component="h2" color="error" fontWeight="bold">
                        ❌ Error de Login
                    </Typography>
                    <Typography id="modal-error-description" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                    <Button
                        sx={{ mt: 3 }}
                        variant="contained"
                        color="error"
                        onClick={() => setOpenModal(false)}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default Formulario;
