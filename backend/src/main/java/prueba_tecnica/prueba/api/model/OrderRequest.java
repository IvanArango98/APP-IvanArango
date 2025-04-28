package prueba_tecnica.prueba.api.model;

public class OrderRequest {

    private String userName;
    private String shippingAddress;
    private String status;
    private Double totalAmount;
    private Integer orderId;

    public OrderRequest() {
    }

    public OrderRequest(String userName, String shippingAddress, String status, Double totalAmount, Integer orderId) {
        this.userName = userName;
        this.shippingAddress = shippingAddress;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderId = orderId;
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
}
