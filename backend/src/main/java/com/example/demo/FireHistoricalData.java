package com.example.demo;

import java.time.LocalDateTime;

// Data class for storing historical building fire information
public class FireHistoricalData {
    
    private String buildingId;
    private String buildingName;
    private String buildingMaterial;
    private int buildingAge;
    private LocalDateTime lastFireDate;
    private String lastFireCause;
    private double fireExtentPercentage;
    private String lastInspectionDate;
    private String fireRiskLevel;
    private String notes;
    
    // Constructor
    public FireHistoricalData() {
    }
    
    // Constructor with all fields
    public FireHistoricalData(String buildingId, String buildingName, String buildingMaterial, 
                             int buildingAge, LocalDateTime lastFireDate, String lastFireCause,
                             double fireExtentPercentage, String lastInspectionDate, 
                             String fireRiskLevel, String notes) {
        this.buildingId = buildingId;
        this.buildingName = buildingName;
        this.buildingMaterial = buildingMaterial;
        this.buildingAge = buildingAge;
        this.lastFireDate = lastFireDate;
        this.lastFireCause = lastFireCause;
        this.fireExtentPercentage = fireExtentPercentage;
        this.lastInspectionDate = lastInspectionDate;
        this.fireRiskLevel = fireRiskLevel;
        this.notes = notes;
    }
    
    // Getters
    public String getBuildingId() {
        return buildingId;
    }
    
    public String getBuildingName() {
        return buildingName;
    }
    
    public String getBuildingMaterial() {
        return buildingMaterial;
    }
    
    public int getBuildingAge() {
        return buildingAge;
    }
    
    public LocalDateTime getLastFireDate() {
        return lastFireDate;
    }
    
    public String getLastFireCause() {
        return lastFireCause;
    }
    
    public double getFireExtentPercentage() {
        return fireExtentPercentage;
    }
    
    public String getLastInspectionDate() {
        return lastInspectionDate;
    }
    
    public String getFireRiskLevel() {
        return fireRiskLevel;
    }
    
    public String getNotes() {
        return notes;
    }
    
    // Setters
    public void setBuildingId(String buildingId) {
        this.buildingId = buildingId;
    }
    
    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }
    
    public void setBuildingMaterial(String buildingMaterial) {
        this.buildingMaterial = buildingMaterial;
    }
    
    public void setBuildingAge(int buildingAge) {
        this.buildingAge = buildingAge;
    }
    
    public void setLastFireDate(LocalDateTime lastFireDate) {
        this.lastFireDate = lastFireDate;
    }
    
    public void setLastFireCause(String lastFireCause) {
        this.lastFireCause = lastFireCause;
    }
    
    public void setFireExtentPercentage(double fireExtentPercentage) {
        this.fireExtentPercentage = fireExtentPercentage;
    }
    
    public void setLastInspectionDate(String lastInspectionDate) {
        this.lastInspectionDate = lastInspectionDate;
    }
    
    public void setFireRiskLevel(String fireRiskLevel) {
        this.fireRiskLevel = fireRiskLevel;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    @Override
    public String toString() {
        return "FireHistoricalData{" +
                "buildingId='" + buildingId + '\'' +
                ", buildingName='" + buildingName + '\'' +
                ", buildingMaterial='" + buildingMaterial + '\'' +
                ", buildingAge=" + buildingAge +
                ", lastFireDate=" + lastFireDate +
                ", lastFireCause='" + lastFireCause + '\'' +
                ", fireExtentPercentage=" + fireExtentPercentage +
                ", lastInspectionDate='" + lastInspectionDate + '\'' +
                ", fireRiskLevel='" + fireRiskLevel + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}
