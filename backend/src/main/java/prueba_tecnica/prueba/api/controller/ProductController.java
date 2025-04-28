package prueba_tecnica.prueba.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import prueba_tecnica.prueba.api.model.ApiResponse;
import prueba_tecnica.prueba.api.model.ProductRequest;
import prueba_tecnica.prueba.service.ProductService;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/createProduct")
    public ApiResponse<Void> createProduct(@RequestBody ProductRequest product) throws SQLException {
        productService.createProduct(product);
        return new ApiResponse<>(200, "Producto creado correctamente.", null);
    }

    @PutMapping("/updateProduct")
    public ApiResponse<Void> updateProduct(@RequestBody ProductRequest product) throws SQLException {
        productService.updateProduct(product);
        return new ApiResponse<>(200, "Producto actualizado correctamente.", null);
    }

    @DeleteMapping("/deleteProduct")
    public ApiResponse<Void> deleteProduct(@RequestParam Integer id) throws SQLException {
        productService.deleteProduct(id);
        return new ApiResponse<>(200, "Producto eliminado correctamente.", null);
    }

    @GetMapping("/getProduct")
    public ApiResponse<ProductRequest> getProductById(@RequestParam Integer id) throws SQLException {
        ProductRequest product = productService.getProductById(id);
        return new ApiResponse<>(200, "Producto consultado correctamente.", product);
    }

    @GetMapping("/getAllProducts")
    public ApiResponse<List<ProductRequest>> getAllProducts() throws SQLException {
        List<ProductRequest> products = productService.getAllProducts();
        return new ApiResponse<>(200, "Productos consultados correctamente.", products);
    }
}
