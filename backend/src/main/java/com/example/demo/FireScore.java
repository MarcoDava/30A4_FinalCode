package com.example.demo;



public class FireScore {
    private String id;
    private String sensorID;
    private double latitude;
    private double longitude;
    private double firescore;
    private String timestamp;
    private String status;

    public FireScore() {}

    public FireScore(String id, String sensorID, double latitude, double longitude, double firescore, String timestamp, String status) {
        this.id = id;
        this.sensorID = sensorID;
        this.latitude = latitude;
        this.longitude = longitude;
        this.firescore = firescore;
        this.timestamp = timestamp;
        this.status = status;
    }

    public String getId() { return id; }
    public String getSensorID() { return sensorID; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public double getFireScore() { return firescore; }
    public String getTimestamp() { return timestamp; }
    public String getStatus() { return status; }

    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

}
