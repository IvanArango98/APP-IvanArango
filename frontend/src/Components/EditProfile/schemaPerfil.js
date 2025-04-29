// src/Helpers/schemaPerfil.js
import * as Yup from 'yup';

export const validatePerfil = Yup.object({
  firstName: Yup.string().required('Primer nombre es requerido.'),
  firstLastName: Yup.string().required('Primer apellido es requerido.'),
  email: Yup.string().email('Correo inválido.').required('Correo es requerido.'),
  phoneNumber: Yup.string().required('Teléfono es requerido.'),
  address: Yup.string().required('Dirección es requerida.')
});
