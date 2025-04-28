package prueba_tecnica.prueba.api.model;

public class ApiResponse<T> {
    private int code;
    private String message;
    private T value;

    public ApiResponse() {
    }

    public ApiResponse(int code, String message, T value) {
        this.code = code;
        this.message = message;
        this.value = value;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}
