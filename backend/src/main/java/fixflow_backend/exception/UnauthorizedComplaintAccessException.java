package fixflow_backend.exception;

public class UnauthorizedComplaintAccessException extends RuntimeException {

    public UnauthorizedComplaintAccessException(String message) {
        super(message);
    }
}