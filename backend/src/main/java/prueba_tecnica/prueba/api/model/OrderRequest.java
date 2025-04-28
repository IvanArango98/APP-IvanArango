package prueba_tecnica.prueba.api.model;

import java.util.List;

public class OrderRequest {

    private String userName;
    private String shippingAddress;
    private String status;
    private Double totalAmount;
    private Integer orderId;
    private List<CartProduct> products;

    public OrderRequest() {
    }

    public OrderRequest(String userName, String shippingAddress, String status, Double totalAmount, Integer orderId,List<CartProduct> products) {
        this.userName = userName;
        this.shippingAddress = shippingAddress;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderId = orderId;
        this.products = products;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public List<CartProduct>getproducts() {
        return products;
    }

    public void setproducts(List<CartProduct> products) {
        this.products = products;
    }
}
