package prueba_tecnica.prueba.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prueba_tecnica.prueba.api.exception.ResourceNotFoundException;
import prueba_tecnica.prueba.api.model.LoginRequest;
import prueba_tecnica.prueba.repository.LoginRepository;

import java.sql.SQLException;
import java.util.Map;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public void registerLogin(LoginRequest loginRequest) throws SQLException {
        try {
            String encryptedPassword = sha256(loginRequest.getPassword());
            loginRequest.setPassword(encryptedPassword);
            loginRepository.registerLogin(loginRequest);
        } catch (SQLException ex) {
            if (ex.getErrorCode() == 404) {
                throw new ResourceNotFoundException("Usuario no encontrado.");
            }
            throw ex;
        }
    }
    
    public Map<String, Object> authenticateUser(LoginRequest loginRequest) throws SQLException {
        try {
            String encryptedPassword = sha256(loginRequest.getPassword());
            loginRequest.setPassword(encryptedPassword);
            Map<String, Object> response = loginRepository.authenticateUser(loginRequest);
            
            if (response == null) {
                throw new ResourceNotFoundException("Usuario o contraseña incorrectos.");
            }
    
            return response;
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Usuario no encontrado")) {
                throw new ResourceNotFoundException("Usuario no encontrado.");
            }
            throw ex;
        }
    }
    

    public void changePassword(LoginRequest loginRequest) throws SQLException {
        try {
            String encryptedPassword = sha256(loginRequest.getPassword());
            loginRequest.setPassword(encryptedPassword);
            loginRepository.changePassword(loginRequest);
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Usuario no encontrado")) {
                throw new ResourceNotFoundException("Usuario no encontrado.");
            }
            throw ex;
        }
    }    
}
