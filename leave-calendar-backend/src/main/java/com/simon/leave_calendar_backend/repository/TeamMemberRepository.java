package com.simon.leave_calendar_backend.repository;

import com.simon.leave_calendar_backend.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    boolean existsByName(String name);

}
