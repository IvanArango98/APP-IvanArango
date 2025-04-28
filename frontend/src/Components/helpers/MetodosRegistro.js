import axios from 'axios';

export const requestRegistro = {
    CrearUsuario: function (data) {        
        return axios.post(
            `${process.env.REACT_APP_HOST}/api/users/createUser`, 
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
