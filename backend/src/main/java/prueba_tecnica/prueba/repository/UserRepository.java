package prueba_tecnica.prueba.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import prueba_tecnica.prueba.api.model.User;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void userMethods(User user, String transactionType) throws SQLException {
        jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL UserMethods(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}")) {

                stmt.setObject(1, user.getId(), Types.INTEGER);
                stmt.setString(2, user.getfirstName());
                stmt.setString(3, user.getsecondName());
                stmt.setString(4, user.getfirstLastName());
                stmt.setString(5, user.getsecondLastName());
                stmt.setString(6, user.getEmail());
                stmt.setString(7, user.getphoneNumber());
                stmt.setString(8, user.getdateOfBirth());

                stmt.setString(9, user.getaddress());
                stmt.setString(10, user.getcountryName());
                stmt.setObject(11, user.getcountryCode(), Types.INTEGER);
                stmt.setString(12, user.getcityName());
                stmt.setObject(13, user.getcityCode(), Types.INTEGER);
                stmt.setString(14, user.getmunicipalityName());
                stmt.setObject(15, user.getmunicipalityCode(), Types.INTEGER);

                stmt.setString(16, transactionType);

                stmt.execute();
                return null;
            }
        });
    }

    public User getUserById(Integer id,String tran) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL UserMethods(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}")) {
    
                // Setear parámetros
                stmt.setObject(1, id, Types.INTEGER);
                stmt.setNull(2, Types.VARCHAR); // Otros campos no se usan en SC
                stmt.setNull(3, Types.VARCHAR);
                stmt.setNull(4, Types.VARCHAR);
                stmt.setNull(5, Types.VARCHAR);
                stmt.setNull(6, Types.VARCHAR);
                stmt.setNull(7, Types.VARCHAR);
                stmt.setNull(8, Types.DATE);
                stmt.setNull(9, Types.VARCHAR);
                stmt.setNull(10, Types.VARCHAR);
                stmt.setNull(11, Types.INTEGER);
                stmt.setNull(12, Types.VARCHAR);
                stmt.setNull(13, Types.INTEGER);
                stmt.setNull(14, Types.VARCHAR);
                stmt.setNull(15, Types.INTEGER);
    
                stmt.setString(16, tran);
    
                boolean hasResultSet = stmt.execute();
    
                if (hasResultSet) {
                    try (var rs = stmt.getResultSet()) {
                        if (rs.next()) {
                            User user = new User(id, null, null, null, null, null, null, null, null, null, id, null, id, null, id);
                            user.setId(rs.getInt("ID"));
                            user.setfirstName(rs.getString("FirstName"));
                            user.setsecondName(rs.getString("SecondName"));
                            user.setfirstLastName(rs.getString("FirstLastName"));
                            user.setsecondLastName(rs.getString("SecondLastName"));
                            user.setEmail(rs.getString("Email"));
                            user.setphoneNumber(rs.getString("PhoneNumber"));
                            user.setdateOfBirth(rs.getString("DateOfBirth"));
                            user.setaddress(rs.getString("Address"));
                            user.setcountryName(rs.getString("CountryName"));
                            user.setcountryCode(rs.getInt("CountryCode"));
                            user.setcityName(rs.getString("CityName"));
                            user.setcityCode(rs.getInt("CityCode"));
                            user.setmunicipalityName(rs.getString("MunicipalityName"));
                            user.setmunicipalityCode(rs.getInt("MunicipalityCode"));
                            return user;
                        }
                    }
                }
                return null;
            }
        });
    }

    public List<User> getAllUsers() throws SQLException {
    return jdbcTemplate.execute((Connection conn) -> {
        List<User> users = new ArrayList<>();

        try (CallableStatement stmt = conn.prepareCall("{CALL UserMethods(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}")) {
            // Setear parámetros: Todos null excepto el Transaction = 'SA'
            stmt.setNull(1, Types.INTEGER);
            stmt.setNull(2, Types.VARCHAR);
            stmt.setNull(3, Types.VARCHAR);
            stmt.setNull(4, Types.VARCHAR);
            stmt.setNull(5, Types.VARCHAR);
            stmt.setNull(6, Types.VARCHAR);
            stmt.setNull(7, Types.VARCHAR);
            stmt.setNull(8, Types.DATE);
            stmt.setNull(9, Types.VARCHAR);
            stmt.setNull(10, Types.VARCHAR);
            stmt.setNull(11, Types.INTEGER);
            stmt.setNull(12, Types.VARCHAR);
            stmt.setNull(13, Types.INTEGER);
            stmt.setNull(14, Types.VARCHAR);
            stmt.setNull(15, Types.INTEGER);
            stmt.setString(16, "SA");

            boolean hasResultSet = stmt.execute();

            if (hasResultSet) {
                try (var rs = stmt.getResultSet()) {
                    while (rs.next()) {
                        User user = new User(
                            rs.getInt("ID"),
                            rs.getString("FirstName"),
                            rs.getString("SecondName"),
                            rs.getString("FirstLastName"),
                            rs.getString("SecondLastName"),
                            rs.getString("Email"),
                            rs.getString("PhoneNumber"),
                            rs.getString("DateOfBirth"),
                            rs.getString("Address"),
                            rs.getString("CountryName"),
                            rs.getInt("CountryCode"),
                            rs.getString("CityName"),
                            rs.getInt("CityCode"),
                            rs.getString("MunicipalityName"),
                            rs.getInt("MunicipalityCode")
                        );
                        users.add(user);
                    }
                }
            }

            return users;
        }
    });
}

    
}
