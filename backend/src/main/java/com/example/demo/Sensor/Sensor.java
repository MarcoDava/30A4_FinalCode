//Generates the random sensor data for both normal and fire scenarios

package com.example.demo.Sensor;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Random;

@Component
public class Sensor {
    private final Random random;

    private Double baseTemperature = 20.0;
    private Double baseHumidity = 50.0;
    private Double baseCO2 = 400.0;
    private Double baseSmoke = 0.0;
    private Double basePressure = 1013.0;
    
    private int simulationStep = 0;
    private boolean firingScenario = false;
    
    public Sensor() {
        this.random = new Random();
    }
        
    public SensorReading getCurrentReading(String sensorId) {
        SensorReading reading = new SensorReading();
        reading.setSensorId(sensorId);
        reading.setTimestamp(LocalDateTime.now());
        reading.setTemperature(baseTemperature + random.nextGaussian() * 0.5);
        reading.setHumidity(baseHumidity + random.nextGaussian() * 2.0);
        reading.setCo2Level(baseCO2 + random.nextGaussian() * 10.0);
        reading.setSmokeLevelAQI(baseSmoke + random.nextGaussian() * 0.1);
        reading.setAirPressure(basePressure + random.nextGaussian() * 0.3);
        return reading;
    }   

    public SensorReading getFireScenarioReading(String sensorId) {
        if (!firingScenario) startFireScenario();
        
        SensorReading reading = new SensorReading();
        reading.setSensorId(sensorId);
        reading.setTimestamp(LocalDateTime.now());
        
        Double temp, smoke, humidity;
        if (simulationStep < 10) {
            temp = 20.0 + (simulationStep * 1.0);
            smoke = simulationStep * 5.0;
            humidity = 50.0 - (simulationStep * 2.0);
        } else if (simulationStep < 30) {
            temp = 30.0 + ((simulationStep - 10) * 1.5);
            smoke = 50.0 + ((simulationStep - 10) * 5.0);
            humidity = 30.0 - ((simulationStep - 10) * 1.0);
        } else {
            temp = 60.0 + ((simulationStep - 30) * 2.0);
            smoke = 150.0 + ((simulationStep - 30) * 3.0);
            humidity = 5.0;
        }
        
        reading.setTemperature(temp);
        reading.setHumidity(Math.max(0.0, humidity));
        reading.setCo2Level(400.0 + (smoke * 2.0));
        reading.setSmokeLevelAQI(smoke);
        reading.setAirPressure(1013.0 - (simulationStep * 0.5));
        
        simulationStep++;
        return reading;
    }
    
    public void startFireScenario() {
        firingScenario = true;
        simulationStep = 0;
    }
    
    public void stopFireScenario() {
        firingScenario = false;
        simulationStep = 0;
    }
}

