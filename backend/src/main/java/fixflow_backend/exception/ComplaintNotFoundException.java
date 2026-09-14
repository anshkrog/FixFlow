package fixflow_backend.exception;

public class ComplaintNotFoundException extends RuntimeException {

    public ComplaintNotFoundException(String message) {
        super(message);
    }
}