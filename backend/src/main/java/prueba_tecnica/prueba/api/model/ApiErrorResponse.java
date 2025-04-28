package prueba_tecnica.prueba.api.model;

public class ApiErrorResponse<T> {
    private int code;
    private String error;
    private String message;
    private String field;
    private T value; // Nuevo campo

    public ApiErrorResponse() {}

    public ApiErrorResponse(int code, String error, String message, String field, T value) {
        this.code = code;
        this.error = error;
        this.message = message;
        this.field = field;
        this.value = value;
    }

    // Getters y Setters
    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getField() { return field; }
    public void setField(String field) { this.field = field; }

    public T getValue() { return value; }
    public void setValue(T value) { this.value = value; }
}
