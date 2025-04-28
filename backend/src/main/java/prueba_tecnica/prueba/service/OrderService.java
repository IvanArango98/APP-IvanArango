package prueba_tecnica.prueba.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prueba_tecnica.prueba.api.exception.ResourceNotFoundException;
import prueba_tecnica.prueba.api.model.OrderRequest;
import prueba_tecnica.prueba.repository.OrderRepository;

import java.sql.SQLException;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Integer createOrder(OrderRequest order) throws SQLException {
        return orderRepository.createOrder(order); // Método que devuelve el ID
    }

    public void confirmOrder(OrderRequest order) throws SQLException {
        try {
            orderRepository.confirmOrder(order);
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null) {
                if (ex.getMessage().contains("carrito")) {
                    throw new ResourceNotFoundException("El carrito está vacío o no se puede confirmar la orden.");
                }
                if (ex.getMessage().contains("Orden no encontrada")) {
                    throw new ResourceNotFoundException("La orden no existe para confirmar.");
                }
            }
            throw ex;
        }
    }
    

    public void updateOrder(OrderRequest order) throws SQLException {
        try {
            orderRepository.updateOrder(order);
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Orden no encontrada")) {
                throw new ResourceNotFoundException("Orden no encontrada.");
            }
            throw ex;
        }
    }

    public void deleteOrder(Integer orderId, String username) throws SQLException {
        try {
            orderRepository.deleteOrder(orderId, username);
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Orden no encontrada")) {
                throw new ResourceNotFoundException("Orden no encontrada.");
            }
            throw ex;
        }
    }

    public OrderRequest getOrderById(Integer id) throws SQLException {
        try {
            return orderRepository.getOrderById(id);
        } catch (RuntimeException ex) {
            if (ex.getMessage() != null && ex.getMessage().contains("Orden no encontrada")) {
                throw new ResourceNotFoundException("Orden no encontrada.");
            }
            throw ex;
        }
    }

    public List<OrderRequest> getAllOrders() throws SQLException {
        return orderRepository.getAllOrders();
    }
}
