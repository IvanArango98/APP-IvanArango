package prueba_tecnica.prueba.api.model;
public class CartProduct {

    private Integer productId;
    private Integer quantity;

    public CartProduct() {
    }

    public CartProduct(Integer quantity,Integer productId) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Integer getproductId() {
        return productId;
    }

    public void setproductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getquantity() {
        return quantity;
    }

    public void setquantity(Integer quantity) {
        this.quantity = quantity;
    }
}
