package com.example.demo;

import java.time.Instant;

public class FireAlert {
    private final String id;
    private final String sensorID;
    private final String areaName;
    private final String type; // "FIRE_SCORE" or "FIRE_VULNERABILITY"
    private final double score;
    private final String timestamp;
    private final String message;

    public FireAlert(String id, String sensorID, String areaName, String type, double score) {
        this.id = id;
        this.sensorID = sensorID;
        this.areaName = areaName;
        this.type = type;
        this.score = score;
        this.timestamp = Instant.now().toString();
        this.message = type.equals("FIRE_SCORE")
            ? String.format("High fire score at %s: %.1f", areaName, score)
            : String.format("High fire vulnerability at %s: %.1f / 10", areaName, score);
    }

    public String getId()        { return id; }
    public String getSensorID()  { return sensorID; }
    public String getAreaName()  { return areaName; }
    public String getType()      { return type; }
    public double getScore()     { return score; }
    public String getTimestamp() { return timestamp; }
    public String getMessage()   { return message; }
}
