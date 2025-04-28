USE PruebaTecnica;
DROP PROCEDURE IF EXISTS OrderMethods;
DELIMITER $$

CREATE PROCEDURE OrderMethods(
    IN p_UserID INT,
    IN p_ShippingAddress TEXT,
    IN p_ProductID INT,
    IN p_Quantity INT
)
BEGIN
    DECLARE orderId INT;
    DECLARE productPrice DECIMAL(10,2);
    DECLARE totalAmount DECIMAL(10,2);

    -- Obtener el precio del producto
    SELECT Price INTO productPrice
    FROM Product
    WHERE ID = p_ProductID;

    -- Calcular el total del producto
    SET totalAmount = productPrice * p_Quantity;

    -- Crear la orden principal si no existe (esto normalmente lo harías antes en backend si agrupas productos, depende tu flujo)
    INSERT INTO `Order` (UserID, ShippingAddress, TotalAmount)
    VALUES (p_UserID, p_ShippingAddress, totalAmount);

    SET orderId = LAST_INSERT_ID();

    -- Insertar detalle de la orden
    INSERT INTO OrderItem (OrderID, ProductID, Quantity, Price)
    VALUES (orderId, p_ProductID, p_Quantity, productPrice);

END $$
DELIMITER ;
