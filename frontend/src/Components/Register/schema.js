import * as Yup from 'yup';

// Calcular la fecha máxima permitida (hace 18 años desde hoy)
const today = new Date();
const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

export const validateRegistro = Yup.object({
  firstName: Yup.string()
    .required('Primer nombre es requerido.'),

  firstLastName: Yup.string()
    .required('Primer apellido es requerido.'),

  email: Yup.string()
    .email('Correo inválido.')
    .required('Correo es requerido.'),

  phoneNumber: Yup.string()
    .required('Teléfono es requerido.'),

  dateOfBirth: Yup.date()
    .max(eighteenYearsAgo, 'Debes ser mayor de 18 años.')
    .required('Fecha de nacimiento es requerida.'),

  address: Yup.string()
    .required('Dirección es requerida.'),

  country: Yup.object()
    .nullable()
    .required('País es requerido.'),

  city: Yup.object()
    .nullable()
    .required('Ciudad es requerida.'),

  municipality: Yup.object()
    .nullable()
    .required('Municipalidad es requerida.'),

  userName: Yup.string()
    .min(4, 'Usuario debe tener al menos 4 caracteres.')
    .max(20, 'Usuario no debe superar 20 caracteres.')
    .required('Usuario es requerido.'),

  password: Yup.string()
    .min(6, 'Contraseña debe tener mínimo 6 caracteres.')
    .max(20, 'Contraseña no debe superar 20 caracteres.')
    .required('Contraseña es requerida.'),
});
