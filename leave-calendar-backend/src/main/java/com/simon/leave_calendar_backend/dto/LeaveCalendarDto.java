package com.simon.leave_calendar_backend.dto;

import com.simon.leave_calendar_backend.model.LeaveStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class LeaveCalendarDto {

    private LeaveCalendarDto() {}

    public record CreateLeaveRequestDto(
            @NotNull(message = "Team member ID is required")
            Long teamMemberId,

            @NotNull(message = "Start date is required")
            LocalDate startDate,

            @NotNull(message = "End date is required")
            LocalDate endDate,

            @NotBlank(message = "Reason is required")
            String reason
    ) {}

    public record UpdateStatusDto(
            @NotNull(message = "Status is required")
            LeaveStatus status
    ) {}


    public record TeamMemberDto(
            Long id,
            String name
    ) {}

    public record LeaveRequestDto(
            Long id,
            TeamMemberDto teamMember,
            LocalDate startDate,
            LocalDate endDate,
            String reason,
            LeaveStatus status,
            LocalDate createdAt
    ) {}

    public record OnCallWeekDto(
            int year,
            int weekNumber,
            LocalDate weekStart,
            LocalDate weekEnd,
            TeamMemberDto onCallMember,
            boolean hasConflict
    ) {}

    public record ErrorDto(
            String message,
            String field
    ) {
        public ErrorDto(String message) {
            this(message, null);
        }
    }
}
