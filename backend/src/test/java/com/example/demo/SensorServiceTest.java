package com.example.demo;

import com.example.demo.Sensor.Sensor;
import com.example.demo.Sensor.SensorDatabase;
import com.example.demo.Sensor.SensorReading;
import com.example.demo.Sensor.SensorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SensorPortAPI Integration Tests")
class SensorServiceTest {
    
    private Sensor sensor;
    private SensorDatabase database;
    private SensorService sensorService;
    
    @BeforeEach
    void setUp() {
        sensor = new Sensor();
        database = new SensorDatabase();
        database.deleteInformation();  // Clear CSV before each test
        sensorService = new SensorService(sensor, database);
    }
    
    // ==================== SensorService Tests ====================
    
    @Test
    @DisplayName("Get current reading and store it")
    void testGetCurrentReadingStoresInDatabase() {
        String sensorId = "sensor-001";
        
        SensorReading reading = sensorService.getInformation(sensorId);
        
        assertNotNull(reading);
        assertEquals(sensorId, reading.getSensorId());
        assertEquals(1, database.getTotalCount());
        
        System.out.println("✓ Current reading stored");
        System.out.println("  Total readings: " + database.getTotalCount());
    }
    
    @Test
    @DisplayName("Multiple readings stored")
    void testMultipleCurrentReadingsAllStored() {
        int readingCount = 5;
        for (int i = 0; i < readingCount; i++) {
            sensorService.getInformation("sensor-001");
        }
        
        assertEquals(5, database.getTotalCount());
        List<SensorReading> allReadings = sensorService.getAllInformation();
        assertEquals(5, allReadings.size());
        
        System.out.println("✓ Multiple readings stored");
        System.out.println("  Total: " + database.getTotalCount());
    }
    
    @Test
    @DisplayName("Filter readings by sensor ID")
    void testGetReadingsBySensorId() {
        sensorService.getInformation("sensor-001");
        sensorService.getInformation("sensor-001");
        sensorService.getInformation("sensor-002");
        sensorService.getInformation("sensor-002");
        sensorService.getInformation("sensor-002");
        
        assertEquals(5, database.getTotalCount());
        assertEquals(2, sensorService.getInformationBySensorId("sensor-001").size());
        assertEquals(3, sensorService.getInformationBySensorId("sensor-002").size());
        
        System.out.println("✓ Filtered by sensor ID");
        System.out.println("  Total: " + database.getTotalCount());
        System.out.println("  Sensor-001: " + sensorService.getInformationBySensorId("sensor-001").size());
        System.out.println("  Sensor-002: " + sensorService.getInformationBySensorId("sensor-002").size());
    }
    
    @Test
    @DisplayName("Fire scenario reading stored")
    void testGetFireScenarioReadingStoresInDatabase() {
        String sensorId = "sensor-fire-001";
        
        sensorService.startFireScenario();
        SensorReading reading = sensorService.getFireScenarioInformation(sensorId);
        
        assertNotNull(reading);
        assertEquals(sensorId, reading.getSensorId());
        assertEquals(1, database.getTotalCount());
        System.out.println("✓ Fire scenario reading stored");
        System.out.println("  Temp: " + String.format("%.2f", reading.getTemperature()) + "°C");
        System.out.println("  Smoke: " + String.format("%.2f", reading.getSmokeLevelAQI()));
    }
    
    @Test
    @DisplayName("Fire scenario progression stored")
    void testFireScenarioProgressionStored() {
        sensorService.startFireScenario();
        double[] temperatures = new double[10];
        
        for (int i = 0; i < 10; i++) {
            SensorReading reading = sensorService.getFireScenarioInformation("sensor-fire-001");
            temperatures[i] = reading.getTemperature();
        }
        
        assertEquals(10, database.getTotalCount());
        List<SensorReading> allReadings = sensorService.getAllInformation();
        assertEquals(10, allReadings.size());
        
        assertTrue(allReadings.stream().allMatch(r -> "sensor-fire-001".equals(r.getSensorId())));
        
        System.out.println("✓ Fire scenario progression stored");
        System.out.println("  Total readings: " + database.getTotalCount());
        System.out.println("  Temp range: " + String.format("%.1f", temperatures[0]) + 
                " to " + String.format("%.1f", temperatures[9]) + "°C");
    }
    
    @Test
    @DisplayName("Clear all readings")
    void testClearAllReadings() {
        sensorService.getInformation("sensor-001");
        sensorService.getInformation("sensor-001");
        sensorService.getInformation("sensor-002");
        assertEquals(3, database.getTotalCount());
        
        sensorService.deleteInformation();
        
        assertEquals(0, database.getTotalCount());
        assertEquals(0, sensorService.getAllInformation().size());
        
        System.out.println("✓ All readings cleared");
        System.out.println("  Total after clear: " + database.getTotalCount());
    }
    
    @Test
    @DisplayName("Readings statistics")
    void testReadingsStatistics() {
        sensorService.getInformation("sensor-001");
        sensorService.getInformation("sensor-001");
        sensorService.getInformation("sensor-002");
        
        String stats = sensorService.getStats();
        
        assertEquals("Total readings: 3", stats);
        System.out.println("✓ Statistics: " + stats);
    }
    
    @Test
    @DisplayName("Complete data flow")
    void testCompleteDataFlow() {
        System.out.println("✓ Complete sensor data flow:");
        System.out.println();
        
        System.out.println("  1. Getting 3 normal readings:");
        for (int i = 0; i < 3; i++) {
            SensorReading reading = sensorService.getInformation("sensor-001");
            System.out.printf("     Reading %d: Temp=%.2f°C, Humidity=%.1f%%%n", 
                    i + 1, reading.getTemperature(), reading.getHumidity());
        }
        
        System.out.println("  2. Fire scenario readings:");
        sensorService.startFireScenario();
        for (int i = 0; i < 5; i++) {
            SensorReading reading = sensorService.getFireScenarioInformation("sensor-fire-001");
            System.out.printf("     Reading %d: Temp=%.2f°C, Smoke=%.1f%n", 
                    i + 1, reading.getTemperature(), reading.getSmokeLevelAQI());
        }
        sensorService.stopFireScenario();
        
        System.out.println("  3. Verification:");
        System.out.println("     Total readings: " + sensorService.getAllInformation().size());
        System.out.println("     Sensor-001: " + sensorService.getInformationBySensorId("sensor-001").size());
        System.out.println("     Sensor-fire-001: " + sensorService.getInformationBySensorId("sensor-fire-001").size());
        
        assertEquals(8, sensorService.getAllInformation().size());
        assertEquals(3, sensorService.getInformationBySensorId("sensor-001").size());
        assertEquals(5, sensorService.getInformationBySensorId("sensor-fire-001").size());
        
        System.out.println();
        System.out.println("✓ Complete flow test passed!");
    }
}
