package prueba_tecnica.prueba.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prueba_tecnica.prueba.api.exception.ResourceNotFoundException;
import prueba_tecnica.prueba.api.model.ProductRequest;
import prueba_tecnica.prueba.repository.ProductRepository;

import java.sql.SQLException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public void createProduct(ProductRequest product) throws SQLException {
        productRepository.productMethods(product, "CC");
    }

    public void updateProduct(ProductRequest product) throws SQLException {
        try {
            productRepository.productMethods(product, "UC");
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Producto no encontrado")) {
                throw new ResourceNotFoundException("Producto no encontrado.");
            }
            throw ex;
        }
    }

    public void deleteProduct(Integer id) throws SQLException {
        try {
            ProductRequest product = new ProductRequest();
            product.setId(id);
            productRepository.productMethods(product, "DC");
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Producto no encontrado")) {
                throw new ResourceNotFoundException("Producto no encontrado.");
            }
            throw ex;
        }
    }

    public ProductRequest getProductById(Integer id) throws SQLException {
        try {
            return productRepository.getProductById(id, "SC");
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Producto no encontrado")) {
                throw new ResourceNotFoundException("Producto no encontrado.");
            }
            throw ex;
        }
    }

    public List<ProductRequest> getAllProducts() throws SQLException {
        return productRepository.getAllProducts();
    }
}
