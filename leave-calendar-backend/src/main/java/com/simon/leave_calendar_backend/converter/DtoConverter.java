package com.simon.leave_calendar_backend.converter;

import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import com.simon.leave_calendar_backend.model.LeaveRequest;
import com.simon.leave_calendar_backend.model.TeamMember;
import org.springframework.stereotype.Component;

@Component
public class DtoConverter {

    public LeaveCalendarDto.TeamMemberDto toMemberDto(TeamMember member) {
        if (member == null) {
            return null;
        }

        return new LeaveCalendarDto.TeamMemberDto(
                member.getId(),
                member.getName()
        );
    }


    public LeaveCalendarDto.LeaveRequestDto toLeaveRequestDto(LeaveRequest request) {
        if (request == null) {
            return null;
        }

        return new LeaveCalendarDto.LeaveRequestDto(
                request.getId(),
                toMemberDto(request.getTeamMember()),
                request.getStartDate(),
                request.getEndDate(),
                request.getReason(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}
