import React from 'react';
import { BrowserRouter, Routes,Route} 
        from "react-router-dom";
import PrivateRoute from '../privateRoute/privateroute'
import Login from '../Login/index'
import Register from '../Register/index'

export default function AppRouter()
{    
    function NotFound()
    {
        return(
            <div>
            <h1 style={{marginTop:200,display:"flex",justifyContent:"center"}}>404 <br/>Página no Encontrada</h1>
            </div>
        )
    }
    return(
            <BrowserRouter>
                <Routes>                                    
                    <Route exact path="/" element={<Login/>}/>                                                                                                                                           
                    <Route exact path="/InicioSesion" element={<Login/>}/>                  
                    <Route exact path="/Registro" element={<Register/>}/>                                 
                    {/* <PrivateRoute exact path="/Resultados" component= {Resultados} /> */}
                    <Route  path="*" element={<NotFound/>}/>
                </Routes>                
            </BrowserRouter>
    );
}