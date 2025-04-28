import { isUndefined }  from 'util'
import Cookies from 'universal-cookie'
const cookies = new Cookies();

//que calcula que el token expire en 30 mins
export function calculaExpiracionSesion()
{
    const now = new Date().getTime();
    const newDate = now + 60 * 85 * 1000
    return new Date(newDate)
}

//metodo que valida si la sesion ya finalizo
export function getSession()
{
    return isUndefined(cookies.get("_s")) ? false : cookies.get("_s")
}

//metodo que redirecciona al login si el token paso sus 30 mins
export function renovarSesion()
{
    const sesion = getSession()    
    
    if(!sesion)   
    {        
        localStorage.clear();
        window.location.href = "/InicioSesion"
    }       
    else{
        cookies.set("_s",sesion,{
            path: "/", 
            expires: calculaExpiracionSesion()     
        })
    }    

    return sesion;
}

export const InicioSesion = (Data,setOpenSpinner) => {  
    let token = "123456"    
    
    cookies.set("_s",token,{
        path: "/", 
        expires: calculaExpiracionSesion()
    })
    localStorage.setItem("sesionData",JSON.stringify({            
        user: Data.user,
        rol: "Administrador"        
    }))    
    window.location.href = "/ControlRutas?id=12345"                 
}