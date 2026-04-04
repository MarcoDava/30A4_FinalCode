package com.example.demo.dashboard.model;

//HARD CODED VALUES TO SHOW DEMO

public class DispatchUnit {
    private String id;
    private String unitName;
    private String status;
    private String assignedIncidentId;
    private String location;

    public DispatchUnit() {}

    public DispatchUnit(String id, String unitName, String status, String assignedIncidentId, String location) {
        this.id = id;
        this.unitName = unitName;
        this.status = status;
        this.assignedIncidentId = assignedIncidentId;
        this.location = location;
    }

    public String getId() { return id; }
    public String getUnitName() { return unitName; }
    public String getStatus() { return status; }
    public String getAssignedIncidentId() { return assignedIncidentId; }
    public String getLocation() { return location; }

    public void assignToIncident(String incidentId) {
        this.assignedIncidentId = incidentId;
        this.status = "Assigned";
    }

    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

    public void updateLocation(String newLocation) {
        this.location = newLocation;
    }



}
