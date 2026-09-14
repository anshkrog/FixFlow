package fixflow_backend.dto;

import jakarta.validation.constraints.NotNull;

public class AssignStaffRequest {

    @NotNull(message = "Staff ID is required")
    private Long staffId;

    public AssignStaffRequest() {
    }

    public AssignStaffRequest(Long staffId) {
        this.staffId = staffId;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }
}