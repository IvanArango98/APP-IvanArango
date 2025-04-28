package prueba_tecnica.prueba.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import prueba_tecnica.prueba.api.exception.ResourceNotFoundException;
import prueba_tecnica.prueba.api.model.CartRequest;
import prueba_tecnica.prueba.repository.CartRepository;

import java.sql.SQLException;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Integer addToCart(CartRequest cartRequest) throws SQLException {
        cartRequest.setCartItemId(0);
        return cartRepository.modifyCart(cartRequest, "CA"); // CA = Cart Add
    }

    public Integer updateCart(CartRequest cartRequest) throws SQLException {
        try
        {
        return cartRepository.modifyCart(cartRequest, "CU"); // CU = Cart Update
         } catch (RuntimeException ex) {
            if (ex.getMessage() != null) {
                if (ex.getMessage().contains("carrito")) {
                    throw new ResourceNotFoundException("Producto no encontrado en carrito");
                }               
            }
            throw ex;
        }
    }

    public void removeFromCart(String username, Integer productId,Integer OrderId) throws SQLException {
        try{
        CartRequest cartRequest = new CartRequest();
        cartRequest.setUserName(username);
        cartRequest.setProductId(productId);
        cartRequest.setCartItemId(OrderId);
        cartRepository.RemoveCart(cartRequest, "CD"); // CD = Cart Delete
    } catch (RuntimeException ex) {
        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("carrito")) {
                throw new ResourceNotFoundException("Producto no encontrado en carrito");
            }               
        }
        throw ex;
    }
    }

    public List<CartRequest> getCartItems(String username) throws SQLException {
        return cartRepository.getCartItems(username);
    }
}
