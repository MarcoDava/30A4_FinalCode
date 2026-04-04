# SensorDatabase API Documentation

## Overview

The `SensorDatabase` provides a centralized, persistent data repository for sensor readings. Other subsystems (frontend, analytics, alerts, etc.) can access, read, and write data **without directly interacting with sensor generation components**.

The database follows a **Blackboard architectural pattern**: all components query the central database for data rather than point-to-point communication.

---

## Accessing the Database

### Via Spring Dependency Injection (Recommended for Backend Services)

```java
@Service
public class MyAnalyticsService {
    
    private final SensorDatabase database;
    
    @Autowired
    public MyAnalyticsService(SensorDatabase database) {
        this.database = database;
    }
    
    public void analyzeReadings() {
        // Use database methods here
    }
}
```

### Direct Instantiation (For Standalone Tools/Tests)

```java
SensorDatabase database = new SensorDatabase();
// Ready to use immediately with default CSV path: ./sensor_readings.csv
```

---

## API Methods

### 1. Read All Data

**Method:** `List<SensorReading> getAllInformation()`

**Description:** Retrieves all sensor readings from the database.

**Returns:** `List<SensorReading>` containing all stored readings

**Example:**
```java
List<SensorReading> allReadings = database.getAllInformation();
System.out.println("Total readings: " + allReadings.size());

for (SensorReading reading : allReadings) {
    System.out.println("Sensor: " + reading.getSensorId());
    System.out.println("Temp: " + reading.getTemperature() + "°C");
    System.out.println("Timestamp: " + reading.getTimestamp());
}
```

---

### 2. Read by Sensor ID

**Method:** `List<SensorReading> getInformationBySensorId(String sensorId)`

**Description:** Filters readings by a specific sensor ID.

**Parameters:**
- `sensorId` (String): The sensor identifier (e.g., "sensor-001")

**Returns:** `List<SensorReading>` for the specified sensor, or empty list if not found

**Example:**
```java
List<SensorReading> sensor001Data = database.getInformationBySensorId("sensor-001");
System.out.println("Readings from sensor-001: " + sensor001Data.size());

for (SensorReading reading : sensor001Data) {
    System.out.println("Temperature: " + reading.getTemperature());
    System.out.println("Humidity: " + reading.getHumidity());
}
```

---

### 3. Write Data to Database

**Method:** `void saveInformation(SensorReading reading)`

**Description:** Stores a new sensor reading in memory and persists it to CSV.

**Parameters:**
- `reading` (SensorReading): The reading object to store

**Returns:** void

**Example:**
```java
// Create a new reading
SensorReading reading = new SensorReading();
reading.setSensorId("external-sensor-001");
reading.setTimestamp(LocalDateTime.now());
reading.setTemperature(22.5);
reading.setHumidity(55.0);
reading.setCo2Level(450.0);
reading.setSmokeLevelAQI(10.0);
reading.setAirPressure(1013.25);

// Save to database
database.saveInformation(reading);
System.out.println("Reading saved successfully");
```

---

### 4. Get Total Count

**Method:** `int getTotalCount()`

**Description:** Returns the total number of readings stored in the database.

**Returns:** int - Total count of all readings

**Example:**
```java
int totalReadings = database.getTotalCount();
System.out.println("Database contains " + totalReadings + " readings");
```

---

### 5. Get Sensor-Specific Count

**Method:** `int getCountBySensorId(String sensorId)`

**Description:** Returns the number of readings for a specific sensor.

**Parameters:**
- `sensorId` (String): The sensor identifier

**Returns:** int - Count of readings for that sensor

**Example:**
```java
int sensorReadings = database.getCountBySensorId("sensor-002");
System.out.println("Sensor-002 has " + sensorReadings + " readings");
```

---

### 6. Clear All Data

**Method:** `void deleteInformation()`

**Description:** Removes all readings from memory and resets the CSV file to header-only.

**Returns:** void

**Example:**
```java
// Clear database (use with caution!)
database.deleteInformation();
System.out.println("Database cleared");
```

---

## SensorReading Data Model

Each reading contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `sensorId` | String | Unique sensor identifier |
| `timestamp` | LocalDateTime | When the reading was taken |
| `temperature` | double | Temperature in °C |
| `humidity` | double | Humidity as % (0-100) |
| `co2Level` | double | CO₂ concentration in ppm |
| `smokeLevelAQI` | double | Smoke/AQI level (0-500) |
| `airPressure` | double | Air pressure in hPa |

### Creating a SensorReading

```java
SensorReading reading = new SensorReading();

// Use setters to populate
reading.setSensorId("sensor-001");
reading.setTimestamp(LocalDateTime.now());
reading.setTemperature(20.5);
reading.setHumidity(50.0);
reading.setCo2Level(400.0);
reading.setSmokeLevelAQI(0.0);
reading.setAirPressure(1013.0);

// Access data with getters
String id = reading.getSensorId();
double temp = reading.getTemperature();
LocalDateTime ts = reading.getTimestamp();
```

---

## Persistence & Storage

**File Location:** 
- Default: `./sensor_readings.csv` (relative to working directory)
- Production: `${user.home}/FireWatch/sensor_readings.csv` (configured in `application.properties`)

**File Format:** CSV with header
```
sensorId,timestamp,temperature,humidity,co2Level,smokeLevelAQI,airPressure
sensor-001,2026-04-03T10:00:00,20.50,50.00,400.00,0.00,1013.00
sensor-002,2026-04-03T10:05:00,21.75,48.50,405.50,5.20,1012.50
```

**Persistence Behavior:**
- Data is automatically written to CSV after each `saveInformation()` call
- Data is automatically loaded from CSV on database initialization
- All changes persist across application restarts

---

## Common Use Cases

### Example 1: Analytics Dashboard (Read Recent Data)

```java
@Service
public class DashboardService {
    private final SensorDatabase database;
    
    @Autowired
    public DashboardService(SensorDatabase database) {
        this.database = database;
    }
    
    public AnalyticsSummary getLatestMetrics() {
        List<SensorReading> allReadings = database.getAllInformation();
        
        double avgTemp = allReadings.stream()
            .mapToDouble(SensorReading::getTemperature)
            .average()
            .orElse(0.0);
            
        int totalCount = database.getTotalCount();
        
        return new AnalyticsSummary(avgTemp, totalCount);
    }
}
```

### Example 2: Fire Alert System (Read by Sensor)

```java
@Service
public class FireAlertService {
    private final SensorDatabase database;
    
    @Autowired
    public FireAlertService(SensorDatabase database) {
        this.database = database;
    }
    
    public void checkFireRisk(String sensorId) {
        List<SensorReading> sensorData = database.getInformationBySensorId(sensorId);
        
        for (SensorReading reading : sensorData) {
            if (reading.getSmokeLevelAQI() > 100) {
                triggerFireAlert(sensorId, reading);
            }
        }
    }
}
```

### Example 3: External Data Integration (Write Data)

```java
@Service
public class ExternalSensorIntegrator {
    private final SensorDatabase database;
    
    @Autowired
    public ExternalSensorIntegrator(SensorDatabase database) {
        this.database = database;
    }
    
    public void importExternalReading(ExternalSensorData data) {
        SensorReading reading = new SensorReading();
        reading.setSensorId(data.getSensorId());
        reading.setTimestamp(data.getTimestamp());
        reading.setTemperature(data.getTemp());
        reading.setHumidity(data.getHumidity());
        reading.setCo2Level(data.getCO2());
        reading.setSmokeLevelAQI(data.getSmoke());
        reading.setAirPressure(data.getPressure());
        
        database.saveInformation(reading);
    }
}
```

---

## Configuration

### Change CSV File Path (Spring)

Edit `src/main/resources/application.properties`:
```properties
sensor.csv.path=/custom/path/to/sensor_data.csv
```

### Change CSV File Path (Programmatic)

```java
SensorDatabase database = new SensorDatabase();
database.setCsvFile("/path/to/custom/database.csv");
```

---

## Thread Safety & Concurrent Access

**Current Status:** Database uses in-memory ArrayList, suitable for single-threaded or lightly-concurrent scenarios.

**For High-Concurrency Scenarios:** Consider using `Collections.synchronizedList()` or adding `synchronized` methods. Contact development team if thread safety is needed.

---

## Error Handling

The database gracefully handles errors:
- **File not found:** Creates new CSV with headers automatically
- **Invalid CSV records:** Skips malformed lines, logs to `System.err`
- **Permission errors:** Logs error message, continues with in-memory data

```java
try {
    database.saveInformation(reading);
} catch (Exception e) {
    System.err.println("Failed to save reading: " + e.getMessage());
    // Data is still in memory, but not persisted
}
```

---

## Integration Checklist

- [ ] Add `SensorDatabase` dependency via Spring injection
- [ ] Review `SensorReading` data model
- [ ] Test read operations with `getAllInformation()` or `getInformationBySensorId()`
- [ ] Test write operations with `saveInformation()`
- [ ] Verify CSV file is created at configured path
- [ ] Confirm data persists across application restarts

---

## Support & Troubleshooting

**Question:** Where is my data stored?
- **Answer:** Check `application.properties` for `sensor.csv.path` or use default `./sensor_readings.csv`

**Question:** Can I modify readings after saving?
- **Answer:** Currently, no. Delete with `deleteInformation()` and re-save. Future enhancement: update/delete by ID.

**Question:** What's the performance limit?
- **Answer:** CSV currently rewritten on every save. Suitable for ~1000s of readings. For >10k readings/sec, consider database migration.

**Question:** How do I back up my data?
- **Answer:** Copy the CSV file. It's plain text and can be imported into Excel or other tools.

---

## Questions or Need Help?

Contact the backend development team for:
- Integration help
- Performance optimization
- Thread safety requirements
- Additional API features
