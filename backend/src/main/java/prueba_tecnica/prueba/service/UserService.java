    package prueba_tecnica.prueba.service;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

import prueba_tecnica.prueba.api.exception.ResourceNotFoundException;
import prueba_tecnica.prueba.api.model.UserRequest;
    import prueba_tecnica.prueba.repository.UserRepository;

    import java.sql.SQLException;
    import java.util.List;

    @Service
    public class UserService {

        @Autowired
        private UserRepository userRepository;

        private boolean isValidEmail(String email) {
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
            return email != null && email.matches(emailRegex);
        }

        public void createUser(UserRequest user) throws SQLException {
            if (!isValidEmail(user.getEmail())) {
                throw new RuntimeException("Formato de correo electrónico inválido.");
            }

            userRepository.userMethods(user, "CC");
        }

        public void updateUser(UserRequest user) throws SQLException {
            try{
            userRepository.userMethods(user, "UC");
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Usuario no encontrado")) {
                throw new ResourceNotFoundException("Usuario no encontrado.");
            }
            throw ex;
        }
        }

        public void deleteUser(Integer id) throws SQLException {
            try {
                UserRequest user = new UserRequest(id, null, null, null, null, null, null, null, null, null, id, null, id, null, id);
                userRepository.userMethods(user, "DC");
            } catch (RuntimeException ex) {
                if (ex.getMessage() != null && ex.getMessage().contains("Usuario no encontrado")) {
                    throw new ResourceNotFoundException("Usuario no encontrado.");
                }
                throw ex;
            }
        }
                
        public UserRequest getUserById(Integer id) throws SQLException {
            try
            {
            return userRepository.getUserById(id,"SC");
            } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Usuario no encontrado")) {
                throw new ResourceNotFoundException("Usuario no encontrado.");
            }
            throw ex;
        }
        }        

        public List<UserRequest> getAllUsers() throws SQLException {
            return userRepository.getAllUsers();
        }
    }
