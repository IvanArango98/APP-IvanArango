package prueba_tecnica.prueba.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import prueba_tecnica.prueba.api.model.ApiResponse;
import prueba_tecnica.prueba.api.model.LoginRequest;
import prueba_tecnica.prueba.service.LoginService;

import java.sql.SQLException;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/register")
    public ApiResponse<Void> registerLogin(@RequestBody LoginRequest loginRequest) throws SQLException {
        loginService.registerLogin(loginRequest);
        return new ApiResponse<>(200, "Usuario registrado exitosamente.", null);
    }

    @PostMapping("/authenticate")
    public ApiResponse<Map<String, Object>> authenticateUser(@RequestBody LoginRequest loginRequest) throws SQLException {
        Map<String, Object> response = loginService.authenticateUser(loginRequest);
        return new ApiResponse<>(200, "Usuario autenticado correctamente.", response);
    }

    @PostMapping("/changePassword")
public ApiResponse<Void> changePassword(@RequestBody LoginRequest loginRequest) throws SQLException {
    loginService.changePassword(loginRequest);
    return new ApiResponse<>(200, "Contraseña actualizada correctamente.", null);
}

}
