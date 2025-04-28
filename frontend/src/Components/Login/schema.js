import * as Yup from 'yup';

export const validate = Yup.object({
    user: Yup.string().required("Usuario es requerido."),
    password: Yup.string()
    .required("Contraseña es requerida.")
    .min(4, "Contraseña debe de contener más de 3 caracteres."),
})