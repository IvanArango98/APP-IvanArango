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

    @PostMapping("/forgotPassword")
    public ApiResponse<String> forgotPassword(@RequestBody LoginRequest loginRequest) throws SQLException {
        String token = loginService.requestPasswordReset(loginRequest.getEmail());
        return new ApiResponse<>(200, "Token de recuperación generado correctamente.", token);
    }

    @PostMapping("/resetPassword")
    public ApiResponse<Void> resetPassword(@RequestBody Map<String, String> body) throws SQLException {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        loginService.resetPassword(token, newPassword);
        return new ApiResponse<>(200, "Contraseña restablecida correctamente.", null);
    }
}
