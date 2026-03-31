package com.example.demo;

public class CreateAccount {

    public boolean createAccount(String username, String password,
                                 String email, String phoneNumber) {

        if (!validateFields(username, password, email, phoneNumber)) {
            return false;
        }

        // Simulate saving to database
        System.out.println("Account created for: " + username);
        return true;
    }

    public boolean validateFields(String username, String password,
                                  String email, String phoneNumber) {

        return !(username.isEmpty() || password.isEmpty()
                || email.isEmpty() || phoneNumber.isEmpty());
    }
}
