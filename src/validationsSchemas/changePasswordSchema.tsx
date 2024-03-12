import * as yup from 'yup';

export const changePasswordSchema = yup.object().shape({
    password: yup
    .string()
    //.matches(/\w*[a-z]\w*/,  "La contraseña debe t")
    .matches(/\w*[A-Z]\w*/,  "La contraseña debe tener MAYÚSCULAS")
    .matches(/\d/, "La contraseña debe tener un número")
    //.matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
    .min(8, ({ min }) => `La contraseña debe contener al menos ${min} caracteres`)
    .max(40, ({ max }) => `La contraseña debe contener máximo ${max} caracteres`)
    .required('Contraseña es requerido'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmar contraseña es requerido'),
  });