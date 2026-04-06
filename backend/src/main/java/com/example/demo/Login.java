package com.example.demo;

public class Login {
    public boolean login(String username, String password) {
        return UserDatabase.validate(username, password);
    }
}
