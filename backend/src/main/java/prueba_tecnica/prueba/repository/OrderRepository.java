package prueba_tecnica.prueba.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import prueba_tecnica.prueba.api.model.OrderRequest;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Repository
public class OrderRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Integer createOrder(OrderRequest order) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?, ?, ?, ?)}")) {
                stmt.setString(1, order.getUserName());  // p_UserName
                stmt.setString(2, order.getShippingAddress());  // p_ShippingAddress
                stmt.setNull(3, Types.VARCHAR);  // p_Status (NULL porque no lo necesitas crear)
                stmt.setNull(4, Types.DECIMAL);  // p_TotalAmount (NULL también porque lo calcula el SP)
                stmt.setString(5, "CC");  // p_Transaction = CC (Crear Orden Manual)
                stmt.setNull(6, Types.INTEGER); // p_OrderID
                stmt.setNull(7, Types.INTEGER); // p_ProductID
                stmt.setNull(8, Types.INTEGER); // p_Quantity
    
                // Serializar lista de productos a JSON
                ObjectMapper mapper = new ObjectMapper();
                String productsJson;
                try {
                    productsJson = mapper.writeValueAsString(order.getproducts());
                } catch (JsonProcessingException e) {
                    throw new RuntimeException("Error al convertir productos a JSON", e);
                }
                stmt.setString(9, productsJson);  // p_ProductsJSON
    
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
    

    public void confirmOrder(OrderRequest order) throws SQLException {
        jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?,NULL)}")) {
                stmt.setString(1, order.getUserName());
                stmt.setString(2, order.getShippingAddress());
                stmt.setString(3, order.getStatus());
                stmt.setObject(4, order.getTotalAmount(), Types.DECIMAL);
                stmt.setString(5, "CP");
                stmt.setInt(6,order.getOrderId());

                stmt.execute();
                return null;
            }
        });
    }

    public void updateOrder(OrderRequest order) throws SQLException {
        jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?,NULL)}")) {
                stmt.setString(1, order.getUserName());
                stmt.setString(2, order.getShippingAddress());
                stmt.setString(3, order.getStatus());
                stmt.setObject(4, order.getTotalAmount(), Types.DECIMAL);
                stmt.setString(5, "UC");
                stmt.setObject(6, order.getOrderId(), Types.INTEGER);

                stmt.execute();
                return null;
            }
        });
    }

    public void deleteOrder(Integer orderId, String username) throws SQLException {
        jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, NULL, NULL, NULL, ?, ?, NULL, NULL, NULL)}")) {
                stmt.setString(1, username); // p_UserName
                stmt.setString(2, "DC");     // p_Transaction
                stmt.setInt(3, orderId);     // p_OrderID
                // Los demás los mandamos NULL
    
                boolean hasResultSet = stmt.execute();
                return null;
            }
        });
    }
    

    public OrderRequest getOrderById(Integer id) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?, ?, ?, ?)}")) {
                stmt.setNull(1, Types.VARCHAR); // p_UserName
                stmt.setNull(2, Types.VARCHAR); // p_ShippingAddress
                stmt.setNull(3, Types.VARCHAR); // p_Status
                stmt.setNull(4, Types.DECIMAL); // p_TotalAmount
                stmt.setString(5, "SC");        // p_Transaction
                stmt.setObject(6, id, Types.INTEGER); // p_OrderID
                stmt.setNull(7, Types.INTEGER); // p_ProductID
                stmt.setNull(8, Types.INTEGER); // p_Quantity
                stmt.setNull(9, Types.VARCHAR); // p_ProductsJSON
    
                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        if (rs.next()) {
                            OrderRequest order = new OrderRequest();
                            order.setOrderId(rs.getInt("OrderID"));
                            order.setUserName(rs.getString("userName"));
                            order.setShippingAddress(rs.getString("ShippingAddress"));
                            order.setStatus(rs.getString("Status"));
                            order.setTotalAmount(rs.getDouble("TotalAmount"));
                            return order;
                        }
                    }
                }
                return null;
            }
        });
    }
    
    

    public List<OrderRequest> getAllOrders() throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            List<OrderRequest> orders = new ArrayList<>();
    
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(NULL, NULL, NULL, NULL, ?, NULL, NULL, NULL, NULL)}")) {
                stmt.setString(1, "SA"); // p_Transaction = 'SA' (Select All orders)
    
                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        while (rs.next()) {
                            OrderRequest order = new OrderRequest();
                            order.setOrderId(rs.getInt("OrderID"));
                            order.setUserName(rs.getString("userName"));
                            order.setShippingAddress(rs.getString("ShippingAddress"));
                            order.setStatus(rs.getString("Status"));
                            order.setTotalAmount(rs.getDouble("TotalAmount"));                            
                            orders.add(order);
                        }
                    }
                }
                return orders;
            }
        });
    }
    
}

