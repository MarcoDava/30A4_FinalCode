package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class FireScoreAgent {

    @GetMapping("/latest")
    public List<FireScore> getLatest() {
        return List.of(
            new FireScore("001","FIRE-001", 85.0, 45.0, 100.0, "2026-04-04T10:40:00Z", "high"),
            new FireScore("002","FIRE-002", 86.0, 46.0, 75.0, "2026-04-04T10:38:00Z", "medium"),
            new FireScore("003","FIRE-003", 87.0, 47.0, 50.0, "2026-04-04T10:39:00Z", "low")
        );
    }

    @GetMapping("/history")
    public List<FireScore> getHistory() {
        return List.of(
            new FireScore("001","FIRE-H001", 88.0, 48.0, 100.0, "2026-04-03T14:00:00Z", "high"),
            new FireScore("002","FIRE-H002", 89.0, 49.0, 75.0, "2026-04-03T11:20:00Z", "medium"),
            new FireScore("003","FIRE-H003", 90.0, 50.0, 50.0, "2026-04-02T18:45:00Z", "low")
        );
    }
}

