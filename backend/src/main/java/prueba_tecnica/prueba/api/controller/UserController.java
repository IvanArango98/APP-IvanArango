package prueba_tecnica.prueba.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import prueba_tecnica.prueba.api.model.UserRequest;
import prueba_tecnica.prueba.api.model.ApiResponse;
import prueba_tecnica.prueba.service.UserService;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/createUser")
    public ApiResponse<Void> createUser(@RequestBody UserRequest user) throws SQLException {
        userService.createUser(user);
        return new ApiResponse<>(200, "Usuario creado correctamente.", null);
    }

    @PutMapping("/updateUser")
    public ApiResponse<Void> updateUser(@RequestBody UserRequest user) throws SQLException {
        userService.updateUser(user);
        return new ApiResponse<>(200, "Usuario actualizado correctamente.", null);
    }

    @DeleteMapping("/deleteUser")
    public ApiResponse<Void> deleteUser(@RequestParam Integer id) throws SQLException {
        userService.deleteUser(id);
        return new ApiResponse<>(200, "Usuario eliminado correctamente.", null);
    }

    @GetMapping("/getUser")
public ApiResponse<UserRequest> getUserById(@RequestParam Integer id) throws SQLException {
    UserRequest user = userService.getUserById(id);
    return new ApiResponse<>(200, "Usuario consultado correctamente.", user);
}

@GetMapping("/getAllUsers")
public ApiResponse<List<UserRequest>> getAllUsers() throws SQLException {
    List<UserRequest> users = userService.getAllUsers();
    return new ApiResponse<>(200, "Usuarios consultados correctamente.", users);
}

}
