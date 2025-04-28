package prueba_tecnica.prueba.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import prueba_tecnica.prueba.api.model.ApiResponse;
import prueba_tecnica.prueba.api.model.CartRequest;
import prueba_tecnica.prueba.service.CartService;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;
    
    @PostMapping("/add")
    public ApiResponse<Map<String, Object>> addProductToCart(@RequestBody CartRequest cartRequest) throws SQLException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartRequest.setUserName(username);
        Integer idOrden = cartService.addToCart(cartRequest);
        
        Map<String, Object> responseValue = new HashMap<>();
        responseValue.put("idOrden", idOrden);
        
        return new ApiResponse<>(200, "Producto agregado al carrito correctamente.", responseValue);    
    }
    
    @PutMapping("/update")
    public ApiResponse<Map<String, Object>> updateProductInCart(@RequestBody CartRequest cartRequest) throws SQLException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartRequest.setUserName(username);
        cartService.updateCart(cartRequest);        
        Map<String, Object> responseValue = new HashMap<>();
        responseValue.put("idOrden", cartRequest.getCartItemId());
        
        return new ApiResponse<>(200, "Cantidad del producto actualizada correctamente en el carrito.", responseValue);
    }
    @DeleteMapping("/remove")
    public ApiResponse<Void> removeProductFromCart(@RequestParam Integer productId,@RequestParam Integer OrderId) throws SQLException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.removeFromCart(username, productId,OrderId);
        return new ApiResponse<>(200, "Producto eliminado del carrito correctamente.", null);
    }

    @GetMapping("/list")
    public ApiResponse<List<CartRequest>> getCartItems() throws SQLException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CartRequest> items = cartService.getCartItems(username);
        return new ApiResponse<>(200, "Productos del carrito obtenidos correctamente.", items);
    }
}
