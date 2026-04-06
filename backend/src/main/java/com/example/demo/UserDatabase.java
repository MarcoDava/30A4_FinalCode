package com.example.demo;

import java.util.HashMap;
import java.util.Map;

public class UserDatabase {

    private static final Map<String, String> USERS = new HashMap<>();

    static {
        USERS.put("admin", "admin123");
        USERS.put("user1", "password1");
        USERS.put("dispatcher", "dispatch99");
        USERS.put("marcodava@gmail.com", "Cypher098");
    }

    public static boolean validate(String username, String password) {
        String stored = USERS.get(username);
        return stored != null && stored.equals(password);
    }

    public static boolean exists(String username) {
        return USERS.containsKey(username);
    }

    public static void addUser(String username, String password) {
        USERS.put(username, password);
    }
}
