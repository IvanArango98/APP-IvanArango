package prueba_tecnica.prueba.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
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
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?)}")) {
                stmt.setString(1, order.getUserName());
                stmt.setString(2, order.getShippingAddress());
                stmt.setString(3, order.getStatus());
                stmt.setObject(4, order.getTotalAmount(), Types.DECIMAL);
                stmt.setString(5, "CC");
                stmt.setNull(6, Types.INTEGER);

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
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?)}")) {
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
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?)}")) {
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
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?)}")) {
                stmt.setString(1, username);
                stmt.setNull(2, Types.VARCHAR);
                stmt.setNull(3, Types.VARCHAR);
                stmt.setNull(4, Types.DECIMAL);
                stmt.setString(5, "DC");
                stmt.setObject(6, orderId, Types.INTEGER);

                stmt.execute();
                return null;
            }
        });
    }

    public OrderRequest getOrderById(Integer id) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?)}")) {
                stmt.setNull(1, Types.VARCHAR);
                stmt.setNull(2, Types.VARCHAR);
                stmt.setNull(3, Types.VARCHAR);
                stmt.setNull(4, Types.DECIMAL);
                stmt.setString(5, "SC");
                stmt.setObject(6, id, Types.INTEGER);

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

            try (CallableStatement stmt = conn.prepareCall("{CALL OrderMethods(?, ?, ?, ?, ?, ?)}")) {
                stmt.setNull(1, Types.VARCHAR);
                stmt.setNull(2, Types.VARCHAR);
                stmt.setNull(3, Types.VARCHAR);
                stmt.setNull(4, Types.DECIMAL);
                stmt.setString(5, "SA");
                stmt.setNull(6, Types.INTEGER);

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
