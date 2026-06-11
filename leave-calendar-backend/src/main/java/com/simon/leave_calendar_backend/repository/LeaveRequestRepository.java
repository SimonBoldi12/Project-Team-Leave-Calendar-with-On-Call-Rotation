package com.simon.leave_calendar_backend.repository;

import com.simon.leave_calendar_backend.model.LeaveRequest;
import com.simon.leave_calendar_backend.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByTeamMemberId(Long teamMemberId);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    @Query("""
        SELECT lr FROM LeaveRequest lr
        WHERE lr.teamMember.id = :memberId
          AND lr.status <> com.simon.leave_calendar_backend.model.LeaveStatus.REJECTED
          AND lr.startDate <= :endDate
          AND lr.endDate >= :startDate
          AND (:excludeId IS NULL OR lr.id <> :excludeId)
    """)
    List<LeaveRequest> findOverlapping(
            @Param("memberId") Long memberId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("excludeId") Long excludeId
    );


    @Query("""
        SELECT lr FROM LeaveRequest lr
        WHERE lr.teamMember.id = :memberId
          AND lr.status = :status
          AND lr.startDate <= :endDate
          AND lr.endDate >= :startDate
    """)
    List<LeaveRequest> findApprovedOverlapping(
            @Param("memberId") Long memberId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") LeaveStatus status
    );


}
