package prueba_tecnica.prueba.api.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import prueba_tecnica.prueba.api.model.ApiErrorResponse;

import java.sql.SQLException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleDuplicateEntry(DataIntegrityViolationException ex) {
        ApiErrorResponse<Void> response = new ApiErrorResponse<>(400, "Duplicate Entry", "El correo electrónico ya está registrado.", "email", null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiErrorResponse<Void> response = new ApiErrorResponse<>(404, "Not Found", ex.getMessage(), null, null);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleRuntimeException(RuntimeException ex) {
        if (ex.getCause() instanceof SQLException sqlEx) {
            if (sqlEx.getErrorCode() == 409) {
                ApiErrorResponse<Void> response = new ApiErrorResponse<>(409, "Conflict", "Nombre de usuario ya existe.", "userName", null);
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
            }
            if (sqlEx.getErrorCode() == 404) {
                ApiErrorResponse<Void> response = new ApiErrorResponse<>(404, "Not Found", "Usuario no encontrado.", "email", null);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        }

        ApiErrorResponse<Void> response = new ApiErrorResponse<>(400, "Bad Request", ex.getMessage(), null, null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleGenericException(Exception ex) {
        ApiErrorResponse<Void> response = new ApiErrorResponse<>(500, "Internal Error", "Ocurrió un error interno en el servidor.", null, null);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
