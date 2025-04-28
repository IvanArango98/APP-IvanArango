USE PruebaTecnica;
DROP PROCEDURE IF EXISTS OrderMethods;
DELIMITER $$

CREATE PROCEDURE OrderMethods(
    IN p_UserName VARCHAR(20),
    IN p_ShippingAddress TEXT,
    IN p_Status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    IN p_TotalAmount DECIMAL(10,2),
    IN p_Transaction VARCHAR(2),
    IN p_OrderID INT,
    IN p_ProductID INT,
    IN p_Quantity INT,
	IN p_ProductsJSON JSON
)
BEGIN
    DECLARE v_UserID INT;
    DECLARE v_TotalAmount DECIMAL(10,2);

    -- Buscar UserID si se necesita
    IF p_UserName IS NOT NULL THEN
        SELECT UserID INTO v_UserID
        FROM Login
        WHERE userName = p_UserName;
    END IF;

    -- Crear Orden Manual (CC)
    IF p_Transaction = 'CC' THEN
    -- Buscar UserID
    SELECT UserID INTO v_UserID
    FROM Login
    WHERE userName = p_UserName;

    -- Insertar orden (total temporalmente 0.0)
    INSERT INTO `Order` (UserID, ShippingAddress, Status, TotalAmount)
    VALUES (v_UserID, p_ShippingAddress, COALESCE(p_Status, 'PENDING'), 0);

    SET @newOrderID = LAST_INSERT_ID();

    -- Variables de iteración
    SET @idx = 0;
    SET @total = 0.0;
    SET @json_length = JSON_LENGTH(p_ProductsJSON);

    WHILE @idx < @json_length DO
        -- Obtener ProductID y Quantity
        SET @productId = JSON_UNQUOTE(JSON_EXTRACT(p_ProductsJSON, CONCAT('$[', @idx, '].productId')));
        SET @quantity = JSON_UNQUOTE(JSON_EXTRACT(p_ProductsJSON, CONCAT('$[', @idx, '].quantity')));

        -- Obtener precio unitario
        SELECT Price INTO @price
        FROM Product
        WHERE ID = @productId;

        -- Insertar en OrderItem
        INSERT INTO OrderItem (OrderID, ProductID, Quantity, Price)
        VALUES (@newOrderID, @productId, @quantity, @price);

        -- Sumar al total
        SET @total = @total + (@price * @quantity);

        -- Descontar stock
        UPDATE Product
        SET StockQuantity = StockQuantity - @quantity
        WHERE ID = @productId;

        SET @idx = @idx + 1;
    END WHILE;

    -- Actualizar total de la orden
    UPDATE `Order`
    SET TotalAmount = @total
    WHERE ID = @newOrderID;

    -- Retornar ID de la orden
    SELECT @newOrderID AS OrderID;
END IF;


    -- Confirmar Compra (Carrito) (CP)
    IF p_Transaction = 'CP' THEN
        -- Buscar el UserID desde la Orden
        SELECT UserID INTO v_UserID
        FROM `Order`
        WHERE ID = p_OrderID;

        -- Calcular total
        SELECT SUM(p.Price * c.Quantity)
        INTO v_TotalAmount
        FROM CartItem c
        INNER JOIN Product p ON c.ProductID = p.ID
        WHERE c.UserID = v_UserID;

        IF v_TotalAmount IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El carrito está vacío', MYSQL_ERRNO = 404;
        END IF;

        -- Actualizar Orden
        UPDATE `Order`
        SET 
            ShippingAddress = COALESCE(NULLIF(p_ShippingAddress, ''), ShippingAddress),
            Status = 'CONFIRMED',
            TotalAmount = v_TotalAmount
        WHERE ID = p_OrderID;

        -- Insertar productos a OrderItem
        INSERT INTO OrderItem (OrderID, ProductID, Quantity, Price)
        SELECT p_OrderID, c.ProductID, c.Quantity, p.Price
        FROM CartItem c
        INNER JOIN Product p ON c.ProductID = p.ID
        WHERE c.UserID = v_UserID;

        -- Actualizar Stock
        UPDATE Product p
        JOIN (
            SELECT ProductID, SUM(Quantity) AS total_quantity
            FROM CartItem
            WHERE UserID = v_UserID
            GROUP BY ProductID
        ) ci ON p.ID = ci.ProductID
        SET p.StockQuantity = p.StockQuantity - ci.total_quantity;

        -- Limpiar Carrito
        DELETE FROM CartItem WHERE UserID = v_UserID;
    END IF;

    -- AGREGAR Producto a Carrito (CA)
	IF p_Transaction = 'CA' THEN
    -- Buscar el UserID basado en el username
    SELECT UserID INTO v_UserID
    FROM Login
    WHERE userName = p_UserName;

    -- Si existe el mismo producto en el carrito, actualizar
    IF EXISTS (
        SELECT 1 FROM CartItem 
        WHERE ID = p_OrderID 
          AND ProductID = p_ProductID
    ) THEN
        -- Actualizar cantidad
        UPDATE CartItem
        SET Quantity = Quantity + COALESCE(p_Quantity, 1)
         WHERE ID = p_OrderID 
          AND ProductID = p_ProductID;

        -- Devolver el ID del CartItem actualizado
        SELECT ID AS OrderID 
        FROM CartItem
        WHERE ID = p_OrderID 
          AND ProductID = p_ProductID;
    ELSE
        -- Insertar nuevo producto
        INSERT INTO CartItem (UserID, ProductID, Quantity)
        VALUES (v_UserID, p_ProductID, COALESCE(p_Quantity, 1));
        
        -- Devolver el nuevo ID
        SELECT LAST_INSERT_ID() AS OrderID;
    END IF;
END IF;

    -- ACTUALIZAR Producto de Carrito (CU)
    IF p_Transaction = 'CU' THEN
        IF EXISTS (
            SELECT 1 FROM CartItem WHERE ID = p_OrderID 
          AND ProductID = p_ProductID
        ) THEN
            UPDATE CartItem
            SET Quantity = COALESCE(p_Quantity, 1)
              WHERE ID = p_OrderID 
			  AND ProductID = p_ProductID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Producto no encontrado en carrito', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- ELIMINAR Producto de Carrito (CD)
    IF p_Transaction = 'CD' THEN
      IF EXISTS (
            SELECT 1 FROM CartItem WHERE ID = p_OrderID 
          AND ProductID = p_ProductID
        ) then
        DELETE FROM CartItem
        WHERE ID = p_OrderID 
          AND ProductID = p_ProductID;
        	ELSE
			SIGNAL SQLSTATE '45000'
			 SET MESSAGE_TEXT = 'Producto no encontrado en carrito', MYSQL_ERRNO = 404;
		END IF;
    END IF;
    
    -- CONSULTAR Carrito (CS)
			IF p_Transaction = 'CS' THEN
				SELECT 
			c.ID AS CartItemID,
			l.userName,
			p.ID AS ProductID,
			p.Name AS ProductName,
			p.Price,
			c.Quantity,
			(p.Price * c.Quantity) AS SubTotal
		FROM CartItem c
		INNER JOIN Product p ON c.ProductID = p.ID
		INNER JOIN Login l ON c.UserID = l.UserID
		WHERE c.UserID = v_UserID;
    END IF;

    -- Actualizar Orden Manualmente (UC)
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

    -- Eliminar Orden (DC)
    IF p_Transaction = 'DC' THEN
        IF EXISTS (SELECT 1 FROM `Order` WHERE ID = p_OrderID) THEN
            DELETE FROM `Order` WHERE ID = p_OrderID;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Orden no encontrada', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    -- Consultar Orden (SC)
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

    -- Consultar TODAS las órdenes (SA)
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
