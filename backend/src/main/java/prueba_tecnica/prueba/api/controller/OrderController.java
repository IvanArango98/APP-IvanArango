package prueba_tecnica.prueba.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;

import prueba_tecnica.prueba.api.model.ApiResponse;
import prueba_tecnica.prueba.api.model.OrderRequest;
import prueba_tecnica.prueba.service.OrderService;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/createOrder")
    public ApiResponse<Map<String, Object>> createOrder(@RequestBody OrderRequest order) throws SQLException,JsonProcessingException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        order.setUserName(username);

        Integer idOrden = orderService.createOrder(order);

        Map<String, Object> responseValue = new HashMap<>();
        responseValue.put("idOrden", idOrden);

        return new ApiResponse<>(200, "Orden creada correctamente.", responseValue);
    }

    @PostMapping("/confirmOrder")
    public ApiResponse<Void> confirmOrder(@RequestBody OrderRequest order) throws SQLException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        order.setUserName(username);
        orderService.confirmOrder(order);
        return new ApiResponse<>(200, "Orden confirmada correctamente desde carrito.", null);
    }

    @PutMapping("/updateOrder")
    public ApiResponse<Void> updateOrder(@RequestParam Integer orderId, @RequestBody OrderRequest order) throws SQLException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        order.setUserName(username);
        order.setOrderId(orderId);
        orderService.updateOrder(order);
        return new ApiResponse<>(200, "Orden actualizada correctamente.", null);
    }

    @DeleteMapping("/deleteOrder")
    public ApiResponse<Void> deleteOrder(@RequestParam Integer orderId) throws SQLException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        orderService.deleteOrder(orderId, username);
        return new ApiResponse<>(200, "Orden eliminada correctamente.", null);
    }

    @GetMapping("/getOrder")
    public ApiResponse<OrderRequest> getOrderById(@RequestParam Integer id) throws SQLException {
        OrderRequest order = orderService.getOrderById(id);
        return new ApiResponse<>(200, "Orden consultada correctamente.", order);
    }

    @GetMapping("/getAllOrders")
    public ApiResponse<List<OrderRequest>> getAllOrders() throws SQLException {
        List<OrderRequest> orders = orderService.getAllOrders();
        return new ApiResponse<>(200, "Órdenes consultadas correctamente.", orders);
    }
}
