USE PruebaTecnica;
DROP PROCEDURE IF EXISTS OrderMethods;
DELIMITER $$

CREATE PROCEDURE OrderMethods(
    IN p_UserName VARCHAR(20),
    IN p_ShippingAddress TEXT,
    IN p_Status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    IN p_TotalAmount DECIMAL(10,2),
    IN p_Transaction VARCHAR(2),
    IN p_OrderID INT
)
BEGIN
    DECLARE v_UserID INT;
    DECLARE v_TotalAmount DECIMAL(10,2);

    -- Crear orden manual (aquí sí necesitas UserName para buscar UserID)
    IF p_Transaction = 'CC' THEN
        SELECT UserID INTO v_UserID
        FROM Login
        WHERE userName = p_UserName;

        INSERT INTO `Order` (UserID, ShippingAddress, Status, TotalAmount)
        VALUES (v_UserID, p_ShippingAddress, COALESCE(p_Status, 'PENDING'), p_TotalAmount);

        SELECT LAST_INSERT_ID() AS OrderID;
    END IF;

    -- Confirmar compra (actualizar orden existente, no usar username)
    IF p_Transaction = 'CP' THEN
        -- Buscar el UserID de la orden
        SELECT UserID INTO v_UserID
        FROM `Order`
        WHERE ID = p_OrderID;

        -- Calcular total del carrito para ese usuario
        SELECT SUM(p.Price * c.Quantity)
        INTO v_TotalAmount
        FROM CartItem c
        INNER JOIN Product p ON c.ProductID = p.ID
        WHERE c.UserID = v_UserID;

        IF v_TotalAmount IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El carrito está vacío', MYSQL_ERRNO = 404;
        END IF;

        -- Actualizar orden
        UPDATE `Order`
        SET 
            ShippingAddress = COALESCE(NULLIF(p_ShippingAddress, ''), ShippingAddress),
            Status = 'CONFIRMED',
            TotalAmount = v_TotalAmount
        WHERE ID = p_OrderID;

        -- Insertar productos del carrito
        INSERT INTO OrderItem (OrderID, ProductID, Quantity, Price)
        SELECT p_OrderID, c.ProductID, c.Quantity, p.Price
        FROM CartItem c
        INNER JOIN Product p ON c.ProductID = p.ID
        WHERE c.UserID = v_UserID;

        -- Actualizar stock
        UPDATE Product p
        JOIN (
            SELECT ProductID, SUM(Quantity) AS total_quantity
            FROM CartItem
            WHERE UserID = v_UserID
            GROUP BY ProductID
        ) ci ON p.ID = ci.ProductID
        SET p.StockQuantity = p.StockQuantity - ci.total_quantity;

        -- Limpiar carrito
        DELETE FROM CartItem WHERE UserID = v_UserID;
    END IF;

    -- Actualizar orden manualmente
    IF p_Transaction = 'UC' THEN
        IF EXISTS (SELECT 1 FROM `Order` WHERE ID = p_OrderID) THEN
            UPDATE `Order`
            SET
                ShippingAddress = COALESCE(NULLIF(p_ShippingAddress, ''), ShippingAddress),
                Status = COALESCE(p_Status, Status),
                TotalAmount = COALESCE(p_TotalAmount, TotalAmount)
            WHERE ID = p_OrderID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Orden no encontrada', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- Eliminar orden
    IF p_Transaction = 'DC' THEN
        IF EXISTS (SELECT 1 FROM `Order` WHERE ID = p_OrderID) THEN
            DELETE FROM `Order` WHERE ID = p_OrderID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Orden no encontrada', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- Consultar orden por ID
    IF p_Transaction = 'SC' THEN
        IF EXISTS (SELECT 1 FROM `Order` WHERE ID = p_OrderID) THEN
            SELECT 
                o.ID AS OrderID,
                l.userName,
                o.ShippingAddress,
                o.Status,
                o.TotalAmount
            FROM `Order` o
            INNER JOIN Login l ON o.UserID = l.UserID
            WHERE o.ID = p_OrderID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Orden no encontrada', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- Consultar todas las órdenes
    IF p_Transaction = 'SA' THEN
        SELECT 
            o.ID AS OrderID,
            l.userName,
            o.ShippingAddress,
            o.Status,
            o.TotalAmount
        FROM `Order` o
        INNER JOIN Login l ON o.UserID = l.UserID;
    END IF;

END $$
DELIMITER ;
