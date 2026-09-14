package fixflow_backend.dto;

import fixflow_backend.entity.PriorityLevel;
import jakarta.validation.constraints.NotNull;

public class PriorityUpdateRequest {

    @NotNull(message = "Priority is required")
    private PriorityLevel priority;

    public PriorityUpdateRequest() {
    }

    public PriorityUpdateRequest(PriorityLevel priority) {
        this.priority = priority;
    }

    public PriorityLevel getPriority() {
        return priority;
    }

    public void setPriority(PriorityLevel priority) {
        this.priority = priority;
    }
}