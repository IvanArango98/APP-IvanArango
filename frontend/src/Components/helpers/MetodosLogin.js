import axios from 'axios';
import { isUndefined } from 'util';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export function calculaExpiracionSesion() {
    const now = new Date().getTime();
    const newDate = now + 60 * 85 * 1000;
    return new Date(newDate);
}

export function getSession() {
    return isUndefined(cookies.get("_s")) ? false : cookies.get("_s");
}

export function renovarSesion() {
    const sesion = getSession();
    if (!sesion) {
        localStorage.clear();
        window.location.href = "/InicioSesion";
    } else {
        cookies.set("_s", sesion, {
            path: "/",
            expires: calculaExpiracionSesion(),
        });
    }
    return sesion;
}

export function cerrarSesion() {
    cookies.remove("_s", { path: "/" });  // Borrar cookie
    localStorage.clear();                // Borrar localStorage
    window.location.href = "/InicioSesion"; // Redirigir al login
}

export const InicioSesion = (Data, setOpenSpinner, setErrorMessage, setOpenModal) => {
    setOpenSpinner(true);

    axios.post('http://localhost:8080/api/login/authenticate', {
        userName: Data.user,
        password: Data.password
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    })
    .then(response => {
        if (response.data.code === 200) {
            const token = response.data.value.token;
            const loginId = response.data.value.loginId;
            const userName = response.data.value.userName;

            // Guardamos el token en cookies
            cookies.set("_s", token, {
                path: "/",
                expires: calculaExpiracionSesion()
            });

            // Guardamos el loginId en localStorage
            localStorage.setItem('loginId', loginId);
            localStorage.setItem('userName', userName);

            // Redirigimos a MainPage
            window.location.href = "/MainPage";
        } else {
            setErrorMessage(response.data.message || "Error de autenticación");
            setOpenModal(true);
        }
    })
    .catch(error => {
        console.error("Error al iniciar sesión:", error);
        setErrorMessage(error.response?.data?.message || "Error de conexión o credenciales inválidas.");
        setOpenModal(true);
    })
    .finally(() => {
        setOpenSpinner(false);
    });
};

