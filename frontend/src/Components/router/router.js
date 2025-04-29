import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from '../privateRoute/privateroute';
import Login from '../Login/index';
import Register from '../Register/index';
import Main from '../MainPage/index';
import PerfilUsuario from "../EditProfile/index"

export default function AppRouter() {    
    function NotFound() {
        return (
            <div>
                <h1 style={{marginTop: 200, display: "flex", justifyContent: "center"}}>
                    404 <br />Página no Encontrada
                </h1>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>  
                {/* Públicas */}
                <Route path="/" element={<Login />} />                                                                                                                                           
                <Route path="/InicioSesion" element={<Login />} />                  
                <Route path="/Registro" element={<Register />} /> 

                {/* Privadas */}
                <Route 
                    path="/MainPage" 
                    element={
                        <PrivateRoute>
                            <Main />
                        </PrivateRoute>
                    } 
                />

                <Route 
                    path="/EditarPerfil" 
                    element={
                        <PrivateRoute>
                            <PerfilUsuario />
                        </PrivateRoute>
                    } 
                />

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
            </Routes>                
        </BrowserRouter>
    );
}
