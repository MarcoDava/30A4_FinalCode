package com.example.demo.Sensor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

//Implementation of SensorPortAPI
@Service
public class SensorService implements SensorPortAPI {
    
    private final Sensor sensor;
    private final SensorDatabase database;
    
    @Autowired
    public SensorService(Sensor sensor, SensorDatabase database) {
        this.sensor = sensor;
        this.database = database;
    }
    
    @Override
    public SensorReading getInformation(String sensorId) {
        SensorReading reading = sensor.getCurrentReading(sensorId);
        database.saveInformation(reading);
        return reading;
    }
    
    @Override
    public SensorReading getFireScenarioInformation(String sensorId) {
        SensorReading reading = sensor.getFireScenarioReading(sensorId);
        database.saveInformation(reading);
        return reading;
    }
    
    @Override
    public List<SensorReading> getAllInformation() {
        return database.getAllInformation();
    }
    
    @Override
    public List<SensorReading> getInformationBySensorId(String sensorId) {
        return database.getInformationBySensorId(sensorId);
    }
    
    @Override
    public void deleteInformation() {
        database.deleteInformation();
    }
    
    public void startFireScenario() {
        sensor.startFireScenario();
    }
    
    public void stopFireScenario() {
        sensor.stopFireScenario();
    }
    
    public String getStats() {
        int total = database.getTotalCount();
        return String.format("Total readings: %d", total);
    }
}
