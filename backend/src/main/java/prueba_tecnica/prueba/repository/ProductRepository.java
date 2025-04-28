package prueba_tecnica.prueba.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import prueba_tecnica.prueba.api.model.ProductRequest;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void productMethods(ProductRequest product, String transactionType) throws SQLException {
        jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL ProductMethods(?, ?, ?, ?, ?, ?, ?)}")) {

                stmt.setObject(1, product.getId(), Types.INTEGER);
                stmt.setString(2, product.getName());
                stmt.setString(3, product.getDescription());
                stmt.setString(4, product.getImageURL());
                stmt.setObject(5, product.getPrice(), Types.DECIMAL);
                stmt.setObject(6, product.getStockQuantity(), Types.INTEGER);
                stmt.setString(7, transactionType);

                stmt.execute();
                return null;
            }
        });
    }

    public ProductRequest getProductById(Integer id, String transactionType) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            try (CallableStatement stmt = conn.prepareCall("{CALL ProductMethods(?, ?, ?, ?, ?, ?, ?)}")) {
                stmt.setObject(1, id, Types.INTEGER);
                stmt.setNull(2, Types.VARCHAR);
                stmt.setNull(3, Types.VARCHAR);
                stmt.setNull(4, Types.VARCHAR);
                stmt.setNull(5, Types.DECIMAL);
                stmt.setNull(6, Types.INTEGER);
                stmt.setString(7, transactionType);

                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        if (rs.next()) {
                            ProductRequest product = new ProductRequest();
                            product.setId(rs.getInt("ID"));
                            product.setName(rs.getString("Name"));
                            product.setDescription(rs.getString("Description"));
                            product.setImageURL(rs.getString("ImageURL"));
                            product.setPrice(rs.getDouble("Price"));
                            product.setStockQuantity(rs.getInt("StockQuantity"));
                            return product;
                        }
                    }
                }
                return null;
            }
        });
    }

    public List<ProductRequest> getAllProducts() throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            List<ProductRequest> products = new ArrayList<>();

            try (CallableStatement stmt = conn.prepareCall("{CALL ProductMethods(?, ?, ?, ?, ?, ?, ?)}")) {
                stmt.setNull(1, Types.INTEGER);
                stmt.setNull(2, Types.VARCHAR);
                stmt.setNull(3, Types.VARCHAR);
                stmt.setNull(4, Types.VARCHAR);
                stmt.setNull(5, Types.DECIMAL);
                stmt.setNull(6, Types.INTEGER);
                stmt.setString(7, "SA");

                boolean hasResultSet = stmt.execute();
                if (hasResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        while (rs.next()) {
                            ProductRequest product = new ProductRequest();
                            product.setId(rs.getInt("ID"));
                            product.setName(rs.getString("Name"));
                            product.setDescription(rs.getString("Description"));
                            product.setImageURL(rs.getString("ImageURL"));
                            product.setPrice(rs.getDouble("Price"));
                            product.setStockQuantity(rs.getInt("StockQuantity"));
                            products.add(product);
                        }
                    }
                }
                return products;
            }
        });
    }
}
