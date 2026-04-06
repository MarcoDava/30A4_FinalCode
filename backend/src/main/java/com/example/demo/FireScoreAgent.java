package com.example.demo;

import com.example.demo.Sensor.SensorReading;
import com.example.demo.Sensor.SensorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class FireScoreAgent {

    // Known sensor IDs and their approximate Hamilton-area coordinates [lat, lng]
    private static final String[][] SENSORS = {
        {"FIRE-001",  "43.2557", "-79.8711"},  // Downtown Hamilton
        {"FIRE-002",  "43.2634", "-79.9195"},  // Westdale
        {"FIRE-003",  "43.2280", "-79.8195"},  // Stoney Creek
        {"FIRE-004",  "43.2163", "-79.9402"},  // Dundas
        {"FIRE-005",  "43.2750", "-79.8650"},  // Hamilton Harbour
    };

    private final SensorService sensorService;

    @Autowired
    public FireScoreAgent(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping("/latest")
    public List<FireScore> getLatest() {
        List<FireScore> results = new ArrayList<>();
        for (String[] sensor : SENSORS) {
            String sensorId = sensor[0];
            double lat = Double.parseDouble(sensor[1]);
            double lng = Double.parseDouble(sensor[2]);

            SensorReading reading = sensorService.getInformation(sensorId);
            results.add(toFireScore(sensorId, lat, lng, reading));
        }
        return results;
    }

    @GetMapping("/history")
    public List<FireScore> getHistory() {
        List<SensorReading> allReadings = sensorService.getAllInformation();
        List<FireScore> results = new ArrayList<>();
        for (SensorReading reading : allReadings) {
            // Look up coordinates for this sensor ID; default to Hamilton centre if unknown
            double lat = 43.2557;
            double lng = -79.8711;
            for (String[] sensor : SENSORS) {
                if (sensor[0].equals(reading.getSensorId())) {
                    lat = Double.parseDouble(sensor[1]);
                    lng = Double.parseDouble(sensor[2]);
                    break;
                }
            }
            results.add(toFireScore(reading.getSensorId(), lat, lng, reading));
        }
        return results;
    }

    // Converts a SensorReading into a FireScore.
    // Score formula: weighted sum of temperature (0-100°C), smoke AQI (0-200), and CO2 (400-2000 ppm).
    // Each component is normalized to 0-100 and combined to produce a 0-100 fire score.
    private FireScore toFireScore(String sensorId, double lat, double lng, SensorReading reading) {
        double tempScore  = Math.min(100.0, Math.max(0.0, (reading.getTemperature() - 20.0) / 80.0 * 100.0));
        double smokeScore = Math.min(100.0, Math.max(0.0, reading.getSmokeLevelAQI() / 200.0 * 100.0));
        double co2Score   = Math.min(100.0, Math.max(0.0, (reading.getCo2Level() - 400.0) / 1600.0 * 100.0));

        double fireScore = (tempScore * 0.4) + (smokeScore * 0.4) + (co2Score * 0.2);
        fireScore = Math.round(fireScore * 10.0) / 10.0;

        String status;
        if (fireScore >= 60) {
            status = "high";
        } else if (fireScore >= 30) {
            status = "medium";
        } else {
            status = "low";
        }

        String timestamp = reading.getTimestamp()
                .atOffset(ZoneOffset.UTC)
                .toString();

        return new FireScore(
            UUID.randomUUID().toString(),
            sensorId,
            lat,
            lng,
            fireScore,
            timestamp,
            status
        );
    }
}
