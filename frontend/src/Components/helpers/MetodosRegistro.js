import axios from 'axios';

export const requestRegistro = {
  CrearUsuario: function (data) {
    return axios.post(
      `http://localhost:8080/api/users/createUser`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
  },

  RegisterLogin: function (data) {
    return axios.post(
      `http://localhost:8080/api/login/register`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
  }
};
