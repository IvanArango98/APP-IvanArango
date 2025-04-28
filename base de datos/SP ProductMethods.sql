USE PruebaTecnica;
DROP PROCEDURE IF EXISTS ProductMethods;
DELIMITER $$

CREATE PROCEDURE ProductMethods(
    IN p_ID INT,
    IN p_Name VARCHAR(255),
    IN p_Description TEXT,
    IN p_ImageURL VARCHAR(500),
    IN p_Price DECIMAL(10,2),
    IN p_StockQuantity INT,
    IN p_Transaction VARCHAR(2)
)
BEGIN
    IF p_Transaction = 'CC' THEN
        INSERT INTO Product (Name, Description, ImageURL, Price, StockQuantity)
        VALUES (p_Name, p_Description, p_ImageURL, p_Price, p_StockQuantity);
    END IF;

    IF p_Transaction = 'UC' THEN
    IF EXISTS (SELECT 1 FROM Product WHERE ID = p_ID) THEN    
        UPDATE Product
        SET
            Name = COALESCE(NULLIF(p_Name, ''), Name),
            Description = COALESCE(NULLIF(p_Description, ''), Description),
            ImageURL = COALESCE(NULLIF(p_ImageURL, ''), ImageURL),
            Price = COALESCE(p_Price, Price),
            StockQuantity = COALESCE(p_StockQuantity, StockQuantity)
        WHERE ID = p_ID;
        ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Producto no encontrado', MYSQL_ERRNO = 404;
		END IF;
    END IF;

    IF p_Transaction = 'DC' THEN
     IF EXISTS (SELECT 1 FROM Product WHERE ID = p_ID) THEN    
        DELETE FROM Product WHERE ID = p_ID;
         ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Producto no encontrado', MYSQL_ERRNO = 404;
		END IF;
    END IF;

    IF p_Transaction = 'SC' THEN
     IF EXISTS (SELECT 1 FROM Product WHERE ID = p_ID) THEN    
        SELECT * FROM Product WHERE ID = p_ID;
        ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Producto no encontrado', MYSQL_ERRNO = 404;
		END IF;
    END IF;
    
     IF p_Transaction = 'SA' THEN     
        SELECT * FROM Product;   
    END IF;

END $$

DELIMITER ;
