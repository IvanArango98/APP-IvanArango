import React from 'react';
import {Navigate } from 'react-router-dom'
import  {getSession} from '../Helpers/MetodosLogin'

const checkAuth = () => {
    return !getSession() ? false : true
}

function PrivateRoute({children}) {
    
    if (!(checkAuth())) {        
      return <Navigate to="/InicioSesion" replace />
    }
    return children
  }
  
  export default PrivateRoute