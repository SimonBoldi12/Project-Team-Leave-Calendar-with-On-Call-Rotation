package com.simon.leave_calendar_backend;

import com.simon.leave_calendar_backend.model.TeamMember;
import com.simon.leave_calendar_backend.repository.TeamMemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TeamMemberRepository repository;

    public DataSeeder(TeamMemberRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        List<String> names = List.of("Alice", "Bob", "Charlie", "Diana");
        for (String name : names) {
            if (!repository.existsByName(name)) {
                repository.save(new TeamMember(name));
            }
        }
    }
}