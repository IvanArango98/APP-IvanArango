package prueba_tecnica.prueba.api.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import prueba_tecnica.prueba.api.model.ApiErrorResponse;

import java.sql.SQLException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ApiErrorResponse<Void> handleDuplicateEntry(DataIntegrityViolationException ex) {
        return new ApiErrorResponse<>(400, "Duplicate Entry", "El correo electrónico ya está registrado.", "email", null);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ApiErrorResponse<Void> handleResourceNotFound(ResourceNotFoundException ex) {
        return new ApiErrorResponse<>(404, "Not Found", ex.getMessage(), null, null);
    }

    @ExceptionHandler(RuntimeException.class)
    public ApiErrorResponse<Void> handleRuntimeException(RuntimeException ex) {
        // Detectar si viene un error 409 desde MySQL
        if (ex.getCause() instanceof SQLException sqlEx) {
            if (sqlEx.getErrorCode() == 409) {
                return new ApiErrorResponse<>(409, "Conflict", "Nombre de usuario ya existe.", "userName", null);
            }
            if (sqlEx.getErrorCode() == 404) {
                return new ApiErrorResponse<>(404, "Not Found", "Usuario no encontrado.", "email", null);
            }
        }

        return new ApiErrorResponse<>(400, "Bad Request", ex.getMessage(), null, null);
    }

    @ExceptionHandler(Exception.class)
    public ApiErrorResponse<Void> handleGenericException(Exception ex) {
        return new ApiErrorResponse<>(500, "Internal Error", "Ocurrió un error interno en el servidor.", null, null);
    }
}
