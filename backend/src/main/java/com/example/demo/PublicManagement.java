package com.example.demo;

import java.util.List;

public class PublicManagement {

    private final FireVulnerabilityAgent vulnerabilityAgent;

    public PublicManagement(FireVulnerabilityAgent vulnerabilityAgent) {
        this.vulnerabilityAgent = vulnerabilityAgent;
    }

    public List<FireVulnerability> getVulnerabilityPoints() {
        return vulnerabilityAgent.getStatus();
    }

    public FireVulnerability getVulnerabilityForSensor(String sensorID, double longitude, double latitude) {
        return vulnerabilityAgent.calculateVulnerability(sensorID, longitude, latitude);
    }
}
