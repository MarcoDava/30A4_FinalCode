package com.example.demo;

public class PublicManagement {

    private MapRepresentation mapDisplay;

    public PublicManagement(MapRepresentation mapDisplay) {
        this.mapDisplay = mapDisplay;
    }

    public void displayMap() {
        // Delegation, not implementation
        mapDisplay.displayMap();
    }

    public void displayBuilding(String buildingID) {
        mapDisplay.displayBuilding(buildingID);
    }
}
