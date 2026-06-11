package com.simon.leave_calendar_backend.service;

import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import com.simon.leave_calendar_backend.model.LeaveStatus;
import com.simon.leave_calendar_backend.model.TeamMember;
import com.simon.leave_calendar_backend.repository.LeaveRequestRepository;
import com.simon.leave_calendar_backend.repository.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
public class OnCallService {

    private final TeamMemberRepository memberRepository;
    private final LeaveRequestRepository leaveRepository;
    private final LocalDate anchorDate;

    public OnCallService(TeamMemberRepository memberRepository, LeaveRequestRepository leaveRepository, @Value("${app.oncall.anchor-date}") String anchorDateStr) {
        this.memberRepository = memberRepository;
        this.leaveRepository = leaveRepository;
        LocalDate raw = LocalDate.parse(anchorDateStr);
        this.anchorDate = raw.with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
    }

    public List<LeaveCalendarDto.OnCallWeekDto> findSchedule(LocalDate from, int weeks){
        List<TeamMember> members = memberRepository.findAll();
        if (members.isEmpty()) {
            return List.of();
        }

        LocalDate weekStart = from.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        List<LeaveCalendarDto.OnCallWeekDto> result = new ArrayList<>();

        for (int i = 0; i < weeks; i++) {
            LocalDate wStart = weekStart.plusWeeks(i);
            LocalDate wEnd = wStart.plusDays(6);

            TeamMember onCall = resolveOnCall(members, wStart);

            boolean conflict = !leaveRepository
                    .findApprovedOverlapping(onCall.getId(), wStart, wEnd, LeaveStatus.APPROVED)
                    .isEmpty();

            result.add(new LeaveCalendarDto.OnCallWeekDto(
                    wStart.getYear(),
                    wStart.get(java.time.temporal.WeekFields.ISO.weekOfWeekBasedYear()),
                    wStart,
                    wEnd,
                    new LeaveCalendarDto.TeamMemberDto(onCall.getId(), onCall.getName()),
                    conflict
            ));
        }

        return result;

    }

    public LeaveCalendarDto.OnCallWeekDto findWeekFor(LocalDate date){
        return findSchedule(date, 1).getFirst();
    }


    private TeamMember resolveOnCall(List<TeamMember> members, LocalDate weekStart) {
        long weeksBetween = ChronoUnit.WEEKS.between(anchorDate, weekStart);

        int index = (int) ((weeksBetween % members.size() + members.size()) % members.size());
        return members.get(index);
    }
}
