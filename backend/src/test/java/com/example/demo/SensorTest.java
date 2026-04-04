package com.example.demo;

import com.example.demo.Sensor.Sensor;
import com.example.demo.Sensor.SensorReading;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Sensor Test Suite")
class SensorTest {
    
    @Test
    @DisplayName("Set and get sensor ID")
    void testSetGetSensorId() {
        SensorReading reading = new SensorReading();
        String id = "sensor-001";
        
        reading.setSensorId(id);
        
        assertEquals(id, reading.getSensorId());
        System.out.println("✓ Sensor ID: " + reading.getSensorId());
    }
    
    @Test
    @DisplayName("Set and get timestamp")
    void testSetGetTimestamp() {
        SensorReading reading = new SensorReading();
        LocalDateTime now = LocalDateTime.now();
        
        reading.setTimestamp(now);
        
        assertEquals(now, reading.getTimestamp());
        System.out.println("✓ Timestamp: " + reading.getTimestamp());
    }
    
    @Test
    @DisplayName("Set and get temperature")
    void testSetGetTemperature() {
        SensorReading reading = new SensorReading();
        double temp = 25.5;
        
        reading.setTemperature(temp);
        
        assertEquals(temp, reading.getTemperature());
        System.out.println("✓ Temperature: " + reading.getTemperature() + "°C");
    }
    
    @Test
    @DisplayName("All properties together")
    void testAllProperties() {
        SensorReading reading = new SensorReading();
        LocalDateTime timestamp = LocalDateTime.now();
        
        reading.setSensorId("sensor-test");
        reading.setTimestamp(timestamp);
        reading.setTemperature(22.5);
        reading.setHumidity(60.0);
        reading.setCo2Level(450.0);
        reading.setSmokeLevelAQI(5.0);
        reading.setAirPressure(1013.25);
        
        assertEquals("sensor-test", reading.getSensorId());
        assertEquals(timestamp, reading.getTimestamp());
        assertEquals(22.5, reading.getTemperature());
        assertEquals(60.0, reading.getHumidity());
        assertEquals(450.0, reading.getCo2Level());
        assertEquals(5.0, reading.getSmokeLevelAQI());
        assertEquals(1013.25, reading.getAirPressure());
        
        System.out.println("✓ All properties:");
        System.out.println("  Sensor ID: " + reading.getSensorId());
        System.out.println("  Temperature: " + reading.getTemperature() + "°C");
        System.out.println("  Humidity: " + reading.getHumidity() + "%");
        System.out.println("  CO2: " + reading.getCo2Level() + " ppm");
        System.out.println("  Smoke: " + reading.getSmokeLevelAQI());
        System.out.println("  Pressure: " + reading.getAirPressure() + " hPa");
    }

    @Test
    @DisplayName("Normal sensor reading with variance")
    void testSensorGetCurrentReading() {
        Sensor sensor = new Sensor();
        String sensorId = "sensor-1";
        
        SensorReading reading = sensor.getCurrentReading(sensorId);
        
        assertEquals(sensorId, reading.getSensorId());
        assertNotNull(reading.getTimestamp());
        assertTrue(reading.getTemperature() > 15.0 && reading.getTemperature() < 25.0);
        assertTrue(reading.getHumidity() > 40.0 && reading.getHumidity() < 60.0);
        assertTrue(reading.getCo2Level() > 370.0 && reading.getCo2Level() < 430.0);
        
        System.out.println("✓ Normal reading:");
        System.out.println("  Temp: " + String.format("%.2f", reading.getTemperature()) + "°C");
        System.out.println("  Humidity: " + String.format("%.2f", reading.getHumidity()) + "%");
        System.out.println("  CO2: " + String.format("%.2f", reading.getCo2Level()) + " ppm");
    }
    
    @Test
    @DisplayName("Fire scenario progression")
    void testFireScenarioProgression() {
        Sensor sensor = new Sensor();
        String sensorId = "sensor-fire";
        
        System.out.println("✓ Fire scenario progression:");
        
        double[] temps = new double[12];
        double[] smoke = new double[12];
        
        for (int i = 0; i < 12; i++) {
            SensorReading reading = sensor.getFireScenarioReading(sensorId);
            temps[i] = reading.getTemperature();
            smoke[i] = reading.getSmokeLevelAQI();
            
            System.out.printf("  Step %2d - Temp: %6.1f°C, Smoke: %6.1f%n", i + 1, temps[i], smoke[i]);
        }
        
        for (int i = 1; i < temps.length; i++) {
            assertTrue(temps[i] >= temps[i - 1] - 0.1);
            assertTrue(smoke[i] >= smoke[i - 1] - 0.1);
        }
    }
    
    @Test
    @DisplayName("Fire scenario start and stop")
    void testFireScenarioStartStop() {
        Sensor sensor = new Sensor();
        
        sensor.startFireScenario();
        double firstTemp = sensor.getFireScenarioReading("sensor").getTemperature();
        
        for (int i = 0; i < 14; i++) {
            sensor.getFireScenarioReading("sensor");
        }
        double laterTemp = sensor.getFireScenarioReading("sensor").getTemperature();
        
        sensor.stopFireScenario();
        sensor.startFireScenario();
        double restartTemp = sensor.getFireScenarioReading("sensor").getTemperature();
        
        assertTrue(laterTemp > firstTemp);
        assertEquals(firstTemp, restartTemp, 1.0);
        
        System.out.println("✓ Start/stop test:");
        System.out.println("  Initial: " + String.format("%.2f", firstTemp) + "°C");
        System.out.println("  Later: " + String.format("%.2f", laterTemp) + "°C");
        System.out.println("  After restart: " + String.format("%.2f", restartTemp) + "°C");
    }
}

