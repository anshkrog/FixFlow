package fixflow_backend.dto;

import fixflow_backend.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(ComplaintStatus status) {
        this.status = status;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }
}