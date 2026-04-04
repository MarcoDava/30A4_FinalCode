//Entity class for sensir reading and ensures the data types of outputs

package com.example.demo.Sensor;

import java.time.LocalDateTime;

public class SensorReading {
    private String sensorId;
    private LocalDateTime timestamp;
    private double temperature;
    private double humidity;
    private double co2Level;
    private double smokeLevelAQI;
    private double airPressure;
    
    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }

    public void setCo2Level(double co2Level) {
        this.co2Level = co2Level;
    }

    public void setSmokeLevelAQI(double smokeLevelAQI) {
        this.smokeLevelAQI = smokeLevelAQI;
    }

    public void setAirPressure(double airPressure) {
        this.airPressure = airPressure;
    }
    
    public String getSensorId() {
        return sensorId;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public double getTemperature() {
        return temperature;
    }
    
    public double getHumidity() {
        return humidity;
    }
    
    public double getCo2Level() {
        return co2Level;
    }
    
    public double getSmokeLevelAQI() {
        return smokeLevelAQI;
    }
    
    public double getAirPressure() {
        return airPressure;
    }
}
