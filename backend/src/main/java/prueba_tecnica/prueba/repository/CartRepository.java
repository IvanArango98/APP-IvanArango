package prueba_tecnica.prueba.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import prueba_tecnica.prueba.api.model.CartRequest;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CartRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Integer modifyCart(CartRequest cart, String transactionType) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, NULL, NULL, NULL, ?, ?, ?, ?,NULL)}")) {
                stmt.setString(1, cart.getUserName());
                stmt.setString(2, transactionType);
                stmt.setObject(3, cart.getCartItemId(), Types.INTEGER);
                stmt.setObject(4, cart.getProductId(), Types.INTEGER);
                stmt.setObject(5, cart.getQuantity(), Types.INTEGER);

                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        if (rs.next()) {
                            return rs.getInt("OrderID");
                        }
                    }
                }
                return null;
            }
        });
    }

    public Integer RemoveCart(CartRequest cart, String transactionType) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(NULL, NULL, NULL, NULL, ?, ?, ?, NULL,NULL)}")) {                
                stmt.setString(1, transactionType);
                stmt.setObject(2, cart.getCartItemId(), Types.INTEGER);
                stmt.setObject(3, cart.getProductId(), Types.INTEGER);                

                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        if (rs.next()) {
                            return rs.getInt("OrderID");
                        }
                    }
                }
                return null;
            }
        });
    }

    public List<CartRequest> getCartItems(String username) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            List<CartRequest> cartItems = new ArrayList<>();
    
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, NULL, NULL, NULL, 'CS', NULL, NULL, NULL,NULL)}")) {
                stmt.setString(1, username);
    
                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        while (rs.next()) {
                            CartRequest cart = new CartRequest();
                            cart.setUserName(rs.getString("userName"));
                            cart.setProductId(rs.getInt("ProductID"));
                            cart.setCartItemId(rs.getInt("CartItemID"));
                            cart.setProductName(rs.getString("ProductName"));
                            cart.setPrice(rs.getDouble("Price"));
                            cart.setQuantity(rs.getInt("Quantity"));
                            cart.setSubTotal(rs.getDouble("SubTotal"));
                            cartItems.add(cart);
                        }
                    }
                }
                return cartItems;
            }
        });
    }
    
}
