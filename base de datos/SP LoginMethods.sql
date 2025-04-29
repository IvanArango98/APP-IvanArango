USE PruebaTecnica;
DROP PROCEDURE IF EXISTS LoginMethods;
DELIMITER $$

CREATE PROCEDURE LoginMethods(
    IN p_Email VARCHAR(100),
    IN p_userName VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_status int,
    IN p_Transaction VARCHAR(2)
)
BEGIN
DECLARE p_password2 VARCHAR(255);

IF p_Transaction = 'CC' THEN
    -- Validar que el User exista
    IF EXISTS (SELECT 1 FROM User WHERE Email = p_Email) THEN
        -- Validar que el userName no esté repetido
        IF EXISTS (SELECT 1 FROM Login WHERE userName = p_userName) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Nombre de usuario ya existe', MYSQL_ERRNO = 409;
        ELSE
            INSERT INTO Login (UserID, userName, password, status)
            VALUES (
                (SELECT ID FROM User WHERE Email = p_Email),
                p_userName,
                p_password,
                p_status
            );
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado', MYSQL_ERRNO = 404;
    END IF;
END IF;


    IF p_Transaction = 'SC' THEN
        -- Autenticar usuario        
        SELECT 
            l.UserID AS LoginID,
            l.userName,
            u.Email,
            l.status
        FROM Login l
        INNER JOIN User u ON l.UserID = u.ID
        WHERE l.userName = p_userName 
          AND l.password = p_password 
          AND l.status = 1;
    END IF;

    IF p_Transaction = 'UC' THEN
    IF EXISTS (SELECT 1 FROM User WHERE Email = p_Email) THEN
        IF EXISTS (
            SELECT 1
            FROM Login l
            INNER JOIN User u ON l.UserID = u.ID
            WHERE u.Email = p_Email
              AND l.status = 1
        ) THEN
            UPDATE Login l
            INNER JOIN User u ON l.UserID = u.ID
            SET l.password = p_password,
                l.UpdatedDate = CURRENT_TIMESTAMP
            WHERE u.Email = p_Email
              AND l.status = 1;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Usuario no tiene login activo', MYSQL_ERRNO = 404;
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado', MYSQL_ERRNO = 404;
    END IF;
END IF;

    
END $$
DELIMITER ;
