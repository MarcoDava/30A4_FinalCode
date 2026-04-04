package com.example.demo.Sensor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

// Blackboard pattern: Central database managing all sensor data
// All components request data through this database
@Component
public class SensorDatabase {
    
    @Value("${sensor.csv.path:}")
    private String csvPathProperty;
    
    private String csvFile;
    private static final String CSV_HEADER = "sensorId,timestamp,temperature,humidity,co2Level,smokeLevelAQI,airPressure";
    
    private final List<SensorReading> readings = new ArrayList<>();
    
    public SensorDatabase() {
        // For direct instantiation (non-Spring tests), initialize with default path
        this.csvFile = "./sensor_readings.csv";
        readFromCSV();
    }
    
    // Initialize database after Spring injects @Value fields
    @PostConstruct
    private void initializeDatabase() {
        // Only resolve from property if not already set by constructor
        if (csvFile == null || csvFile.isEmpty()) {
            if (csvPathProperty != null && !csvPathProperty.isEmpty()) {
                csvFile = csvPathProperty;
            } else {
                csvFile = "./sensor_readings.csv";
            }
        }
        // Re-read with possibly updated path
        readFromCSV();
    }
    
    // Allow manual setting of CSV path (useful for tests)
    public void setCsvFile(String path) {
        this.csvFile = path;
    }
    
    // Save reading to memory and write to CSV file
    public void saveInformation(SensorReading reading) {
        if (reading != null) {
            readings.add(reading);
            writeToCSV();
        }
    }
    
    // Get all stored readings from blackboard
    public List<SensorReading> getAllInformation() {
        return new ArrayList<>(readings);
    }
    
    // Get readings for a specific sensor from blackboard
    public List<SensorReading> getInformationBySensorId(String sensorId) {
        if (sensorId == null) {
            return new ArrayList<>();
        }
        return readings.stream()
                .filter(r -> sensorId.equals(r.getSensorId()))
                .collect(Collectors.toList());
    }
    
    // Get total count of readings
    public int getTotalCount() {
        return readings.size();
    }
    
    // Get count for specific sensor
    public int getCountBySensorId(String sensorId) {
        return getInformationBySensorId(sensorId).size();
    }
    
    // Clear all readings from memory and CSV file
    public void deleteInformation() {
        readings.clear();
        writeHeaderToCSV();
    }
    
    // Read all data from CSV file into memory
    private void readFromCSV() {
        try {
            Path filePath = Paths.get(csvFile).toAbsolutePath();
            if (!Files.exists(filePath)) {
                createNewCSV();
                return;
            }
            
            List<String> lines = Files.readAllLines(filePath);
            readings.clear();
            
            for (int i = 1; i < lines.size(); i++) {
                SensorReading reading = parseCSVLine(lines.get(i));
                if (reading != null) {
                    readings.add(reading);
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading CSV: " + e.getMessage());
        }
    }
    
    // Write all readings to CSV file
    private void writeToCSV() {
        try {
            Path filePath = Paths.get(csvFile).toAbsolutePath();
            Files.createDirectories(filePath.getParent());
            
            List<String> lines = new ArrayList<>();
            lines.add(CSV_HEADER);
            
            for (SensorReading reading : readings) {
                lines.add(formatReadingAsCSV(reading));
            }
            
            Files.write(filePath, lines);
        } catch (IOException e) {
            System.err.println("Error writing to CSV: " + e.getMessage());
        }
    }
    
    // Write only header to CSV (for clearing)
    private void writeHeaderToCSV() {
        try {
            Path filePath = Paths.get(csvFile).toAbsolutePath();
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, (CSV_HEADER + "\n").getBytes());
        } catch (IOException e) {
            System.err.println("Error writing header: " + e.getMessage());
        }
    }
    
    // Create new CSV file with header
    private void createNewCSV() {
        try {
            Path filePath = Paths.get(csvFile).toAbsolutePath();
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, (CSV_HEADER + "\n").getBytes());
        } catch (IOException e) {
            System.err.println("Error creating CSV: " + e.getMessage());
        }
    }
    
    // Format reading as CSV line
    private String formatReadingAsCSV(SensorReading reading) {
        return String.format(
            "%s,%s,%.2f,%.2f,%.2f,%.2f,%.2f",
            reading.getSensorId(),
            reading.getTimestamp(),
            reading.getTemperature(),
            reading.getHumidity(),
            reading.getCo2Level(),
            reading.getSmokeLevelAQI(),
            reading.getAirPressure()
        );
    }
    
    // Parse CSV line to SensorReading
    private SensorReading parseCSVLine(String line) {
        try {
            String[] parts = line.split(",");
            if (parts.length != 7) return null;
            
            SensorReading reading = new SensorReading();
            reading.setSensorId(parts[0]);
            reading.setTimestamp(LocalDateTime.parse(parts[1]));
            reading.setTemperature(Double.parseDouble(parts[2]));
            reading.setHumidity(Double.parseDouble(parts[3]));
            reading.setCo2Level(Double.parseDouble(parts[4]));
            reading.setSmokeLevelAQI(Double.parseDouble(parts[5]));
            reading.setAirPressure(Double.parseDouble(parts[6]));
            
            return reading;
        } catch (Exception e) {
            return null;
        }
    }
}
