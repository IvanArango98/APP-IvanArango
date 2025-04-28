package prueba_tecnica.prueba.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import prueba_tecnica.prueba.api.model.LoginRequest;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Repository
public class LoginRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void registerLogin(LoginRequest loginRequest) throws SQLException {
        jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL LoginMethods(?, ?, ?, ?, ?)}")) {
                stmt.setString(1, loginRequest.getEmail());         // p_Email
                stmt.setString(2, loginRequest.getUserName());      // p_userName
                stmt.setString(3, loginRequest.getPassword());      // p_password
                stmt.setInt(4, 1);                                  // p_status (fijo 1 activo)
                stmt.setString(5, "CC");                            // p_Transaction
                stmt.execute();
                return null;
            }
        });
    }
    
    public Map<String, Object> authenticateUser(LoginRequest loginRequest) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL LoginMethods(?, ?, ?, ?, ?)}")) {
                stmt.setNull(1, java.sql.Types.VARCHAR);            // p_Email (no aplica para login)
                stmt.setString(2, loginRequest.getUserName());      // p_userName
                stmt.setString(3, loginRequest.getPassword());      // p_password
                stmt.setNull(4, java.sql.Types.INTEGER);            // p_status (no aplica para login)
                stmt.setString(5, "SC");                            // p_Transaction
    
                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        if (rs.next()) {
                            Map<String, Object> userData = new HashMap<>();
                            userData.put("loginId", rs.getInt("LoginID"));
                            userData.put("userName", rs.getString("userName"));
                            userData.put("email", rs.getString("Email"));
                            userData.put("status", rs.getInt("status"));
                            return userData;
                        }
                    }
                }
                return null;
            }
        });
    }
    
    public void changePassword(LoginRequest loginRequest) throws SQLException {
        jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL LoginMethods(?, ?, ?, ?, ?)}")) {
                stmt.setString(1, loginRequest.getEmail());         // p_Email (usado para identificar usuario)
                stmt.setNull(2, java.sql.Types.VARCHAR);            // p_userName (no aplica)
                stmt.setString(3, loginRequest.getPassword());      // p_password (nueva password)
                stmt.setNull(4, java.sql.Types.INTEGER);            // p_status (no aplica)
                stmt.setString(5, "UC");                            // p_Transaction
    
                stmt.execute();
                return null;
            }
        });
    }        

}
