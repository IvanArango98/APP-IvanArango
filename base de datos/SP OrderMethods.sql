USE PruebaTecnica;
DROP PROCEDURE IF EXISTS OrderMethods;
DELIMITER $$

CREATE PROCEDURE OrderMethods(
    IN p_ID INT,
    IN p_UserID INT,
    IN p_ShippingAddress TEXT,
    IN p_Status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    IN p_TotalAmount DECIMAL(10,2),
    IN p_Transaction VARCHAR(2)
)
BEGIN
    DECLARE v_OrderID INT;
    DECLARE v_TotalAmount DECIMAL(10,2);

    -- Crear orden desde carrito (CONFIRMAR COMPRA)
    IF p_Transaction = 'CP' THEN
        -- Calcular el total del carrito
        SELECT SUM(p.Price * c.Quantity)
        INTO v_TotalAmount
        FROM CartItem c
        INNER JOIN Product p ON c.ProductID = p.ID
        WHERE c.UserID = p_UserID;

        -- Validar que el carrito no esté vacío
        IF v_TotalAmount IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El carrito está vacío', MYSQL_ERRNO = 404;
        END IF;

        -- Insertar en Order
        INSERT INTO `Order` (UserID, ShippingAddress, Status, TotalAmount)
        VALUES (p_UserID, p_ShippingAddress, 'PENDING', v_TotalAmount);

        -- Obtener ID de la nueva orden
        SET v_OrderID = LAST_INSERT_ID();

        -- Insertar los productos en OrderItem
        INSERT INTO OrderItem (OrderID, ProductID, Quantity, Price)
        SELECT v_OrderID, c.ProductID, c.Quantity, p.Price
        FROM CartItem c
        INNER JOIN Product p ON c.ProductID = p.ID
        WHERE c.UserID = p_UserID;

        -- Actualizar stock de los productos
        UPDATE Product p
        JOIN (
            SELECT ProductID, SUM(Quantity) AS total_quantity
            FROM CartItem
            WHERE UserID = p_UserID
            GROUP BY ProductID
        ) ci ON p.ID = ci.ProductID
        SET p.StockQuantity = p.StockQuantity - ci.total_quantity;

        -- Limpiar carrito
        DELETE FROM CartItem WHERE UserID = p_UserID;
    END IF;

    -- Crear nueva orden manual
    IF p_Transaction = 'CC' THEN
        INSERT INTO `Order` (UserID, ShippingAddress, Status, TotalAmount)
        VALUES (p_UserID, p_ShippingAddress, COALESCE(p_Status, 'PENDING'), p_TotalAmount);
    END IF;

    -- Actualizar orden
    IF p_Transaction = 'UC' THEN
        IF EXISTS (SELECT 1 FROM `Order` WHERE ID = p_ID) THEN
            UPDATE `Order`
            SET
                ShippingAddress = COALESCE(NULLIF(p_ShippingAddress, ''), ShippingAddress),
                Status = COALESCE(p_Status, Status),
                TotalAmount = COALESCE(p_TotalAmount, TotalAmount)
            WHERE ID = p_ID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Orden no encontrada', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- Eliminar orden
    IF p_Transaction = 'DC' THEN
        IF EXISTS (SELECT 1 FROM `Order` WHERE ID = p_ID) THEN
            DELETE FROM `Order` WHERE ID = p_ID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Orden no encontrada', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- Consultar orden por ID
    IF p_Transaction = 'SC' THEN
        IF EXISTS (SELECT 1 FROM `Order` WHERE ID = p_ID) THEN
            SELECT * FROM `Order` WHERE ID = p_ID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Orden no encontrada', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- Consultar todas las órdenes
    IF p_Transaction = 'SA' THEN
        SELECT * FROM `Order`;
    END IF;

END $$
DELIMITER ;
