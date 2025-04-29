USE PruebaTecnica;
DROP PROCEDURE IF EXISTS ForgotOrResetPassword;
DELIMITER $$

CREATE PROCEDURE ForgotOrResetPassword(
    IN p_Email VARCHAR(100),
    IN p_Token VARCHAR(255),
    IN p_NewPassword VARCHAR(255),
    IN p_Transaction VARCHAR(2) -- 'RT' = Request Token, 'RC' = Reset with Code
)
BEGIN
    IF p_Transaction = 'RT' THEN
        -- Validar que el correo no sea NULL
        IF p_Email IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Email es requerido', MYSQL_ERRNO = 400;
        END IF;

        IF EXISTS (SELECT 1 FROM User WHERE Email = p_Email) THEN
            -- Genera un token aleatorio usando UUID
            SET @newToken = UUID();

            UPDATE Login l
            INNER JOIN User u ON l.UserID = u.ID
            SET l.resetPasswordToken = @newToken,
                l.resetPasswordExpires = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)
            WHERE u.Email = p_Email;
            
            -- Devolver el token generado
            SELECT @newToken AS resetPasswordToken;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Usuario no encontrado', MYSQL_ERRNO = 404;
        END IF;
    END IF;

    IF p_Transaction = 'RC' THEN
        -- Validar que el token y la nueva contraseña no sean NULL
        IF p_Token IS NULL OR p_NewPassword IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Token y nueva contraseña son requeridos', MYSQL_ERRNO = 400;
        END IF;

        IF EXISTS (
            SELECT 1
            FROM Login
            WHERE resetPasswordToken = p_Token
              AND resetPasswordExpires > CURRENT_TIMESTAMP
        ) THEN
            UPDATE Login
            SET password = p_NewPassword,
                resetPasswordToken = NULL,
                resetPasswordExpires = NULL,
                UpdatedDate = CURRENT_TIMESTAMP
            WHERE resetPasswordToken = p_Token;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Token inválido o expirado', MYSQL_ERRNO = 400;
        END IF;
    END IF;
END$$
DELIMITER ;
