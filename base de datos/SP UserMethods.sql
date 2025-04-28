USE PruebaTecnica;
DROP PROCEDURE IF EXISTS UserMethods;
DELIMITER $$

CREATE PROCEDURE UserMethods(
    IN p_ID INT,
    IN p_FirstName VARCHAR(50),
    IN p_SecondName VARCHAR(50),
    IN p_FirstLastName VARCHAR(50),
    IN p_SecondLastName VARCHAR(50),
    IN p_Email VARCHAR(100),
    IN p_PhoneNumber VARCHAR(15),
    IN p_DateOfBirth DATE,
    IN p_Address TEXT,
    IN p_CountryName VARCHAR(50),
    IN p_CountryCode INT,
    IN p_CityName VARCHAR(50),
    IN p_CityCode INT,
    IN p_MunicipalityName VARCHAR(50),
    IN p_MunicipalityCode INT,
    IN p_Transaction VARCHAR(2)
)
BEGIN
    IF p_Transaction = 'CC' THEN
        INSERT INTO User (FirstName, SecondName, FirstLastName, SecondLastName, Email, PhoneNumber, DateOfBirth)
        VALUES (p_FirstName, p_SecondName, p_FirstLastName, p_SecondLastName, p_Email, p_PhoneNumber, p_DateOfBirth);

        INSERT INTO Address (ID, Address, CountryName, CountryCode, CityName, CityCode, MunicipalityName, MunicipalityCode)
        VALUES (LAST_INSERT_ID(), p_Address, p_CountryName, p_CountryCode, p_CityName, p_CityCode, p_MunicipalityName, p_MunicipalityCode);
    END IF;

    IF p_Transaction = 'UC' THEN
        IF EXISTS (SELECT 1 FROM User WHERE ID = p_ID) THEN
        UPDATE User
        SET
            FirstName = COALESCE(NULLIF(p_FirstName, ''), FirstName),
            SecondName = COALESCE(NULLIF(p_SecondName, ''), SecondName),
            FirstLastName = COALESCE(NULLIF(p_FirstLastName, ''), FirstLastName),
            SecondLastName = COALESCE(NULLIF(p_SecondLastName, ''), SecondLastName),
            Email = COALESCE(NULLIF(p_Email, ''), Email),
            PhoneNumber = COALESCE(NULLIF(p_PhoneNumber, ''), PhoneNumber),
            DateOfBirth = COALESCE(p_DateOfBirth, DateOfBirth)
        WHERE ID = p_ID;

        UPDATE Address
        SET
            Address = COALESCE(NULLIF(p_Address, ''), Address),
            CountryName = COALESCE(NULLIF(p_CountryName, ''), CountryName),
            CountryCode = COALESCE(NULLIF(p_CountryCode, 0), CountryCode),
            CityName = COALESCE(NULLIF(p_CityName, ''), CityName),
            CityCode = COALESCE(NULLIF(p_CityCode, 0), CityCode),
            MunicipalityName = COALESCE(NULLIF(p_MunicipalityName, ''), MunicipalityName),
            MunicipalityCode = COALESCE(NULLIF(p_MunicipalityCode, 0), MunicipalityCode)
        WHERE ID = p_ID;
        ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Usuario no encontrado', MYSQL_ERRNO = 404;
		END IF;
    END IF;

    IF p_Transaction = 'DC' THEN
		IF EXISTS (SELECT 1 FROM User WHERE ID = p_ID) THEN
    DELETE FROM Address WHERE ID = p_ID;
    DELETE FROM User WHERE ID = p_ID;
		ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Usuario no encontrado', MYSQL_ERRNO = 404;
		END IF;
    END IF;

    IF p_Transaction = 'SC' THEN
    IF EXISTS (SELECT 1 FROM User WHERE ID = p_ID) THEN
        SELECT u.*, a.*
        FROM User u
        LEFT JOIN Address a ON u.ID = a.ID
        WHERE u.ID = p_ID;
        	ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Usuario no encontrado', MYSQL_ERRNO = 404;
		END IF;
    END IF;
    
    IF p_Transaction = 'SA' THEN    
        SELECT u.*, a.*
        FROM User u
        LEFT JOIN Address a ON u.ID = a.ID;
    END IF;

END $$

DELIMITER ;
