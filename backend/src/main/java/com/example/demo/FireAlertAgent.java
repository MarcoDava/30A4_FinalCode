package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/alerts")
public class FireAlertAgent {

    private static final double THRESHOLD = 9.0;

    private final FireScoreAgent fireScoreAgent;
    private final FireVulnerabilityAgent fireVulnerabilityAgent;

    // Active alerts keyed by "type:sensorID" — prevents duplicate alerts per sensor
    private final Map<String, FireAlert> activeAlerts = new ConcurrentHashMap<>();

    @Autowired
    public FireAlertAgent(FireScoreAgent fireScoreAgent, FireVulnerabilityAgent fireVulnerabilityAgent) {
        this.fireScoreAgent = fireScoreAgent;
        this.fireVulnerabilityAgent = fireVulnerabilityAgent;
    }

    @Scheduled(fixedRate = 5000)
    public void checkAlerts() {
        for (FireScore score : fireScoreAgent.getLatest()) {
            String key = "FIRE_SCORE:" + score.getSensorID();
            if (score.getFireScore() > THRESHOLD) {
                activeAlerts.computeIfAbsent(key, k -> new FireAlert(
                    UUID.randomUUID().toString(),
                    score.getSensorID(),
                    score.getSensorID(),
                    "FIRE_SCORE",
                    score.getFireScore()
                ));
            } else {
                activeAlerts.remove(key);
            }
        }

        for (FireVulnerability vuln : fireVulnerabilityAgent.getStatus()) {
            String key = "FIRE_VULNERABILITY:" + vuln.getSensorID();
            if (vuln.getFireVulnerabilityScore() > THRESHOLD) {
                activeAlerts.computeIfAbsent(key, k -> new FireAlert(
                    UUID.randomUUID().toString(),
                    vuln.getSensorID(),
                    vuln.getAreaName(),
                    "FIRE_VULNERABILITY",
                    vuln.getFireVulnerabilityScore()
                ));
            } else {
                activeAlerts.remove(key);
            }
        }
    }

    @GetMapping
    public List<FireAlert> getAlerts() {
        return new ArrayList<>(activeAlerts.values());
    }
}
