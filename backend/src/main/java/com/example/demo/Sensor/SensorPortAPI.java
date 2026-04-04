package com.example.demo.Sensor;

import java.util.List;
//interface for which we can interact with
public interface SensorPortAPI {
    
    // Get current normal sensor reading with Gaussian noise
    SensorReading getInformation(String sensorId);
    
    // Get fire scenario sensor reading at current simulation step
    SensorReading getFireScenarioInformation(String sensorId);
    
    // Get all stored sensor readings
    List<SensorReading> getAllInformation();
    
    // Get readings for a specific sensor
    List<SensorReading> getInformationBySensorId(String sensorId);
    
    // Remove all stored readings
    void deleteInformation();
}
