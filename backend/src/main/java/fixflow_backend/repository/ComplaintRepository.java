package fixflow_backend.repository;

import fixflow_backend.entity.Complaint;
import fixflow_backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Get complaints created by a particular resident
    List<Complaint> findByResident(User resident);

    // Get complaints assigned to a particular staff member
    List<Complaint> findByAssignedStaff(User assignedStaff);
}