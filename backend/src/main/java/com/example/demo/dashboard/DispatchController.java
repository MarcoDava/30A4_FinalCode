package com.example.demo.dashboard;
import com.example.demo.dashboard.model.DispatchUnit;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

//HARD CODED VALUES TO SHOW DEMO

@RestController
@RequestMapping("/api/dispatch")
public class DispatchController {

    @GetMapping("/units")
    public List<DispatchUnit> getUnits() {
        // Arrays.asList is used instead of List.of because some entries have null assignedIncidentId
        return Arrays.asList(
            new DispatchUnit("UNIT-F01", "Fire Engine 1",    "on-scene",   "INC-001", "Sector 4 — Warehouse District"),
            new DispatchUnit("UNIT-F02", "Fire Engine 2",     "dispatched", "INC-005", "En route to Sector 9")
        );
    }
}
