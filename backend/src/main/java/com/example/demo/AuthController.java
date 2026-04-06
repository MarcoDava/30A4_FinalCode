package com.example.demo;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final Login login = new Login();
    private final CreateAccount createAccount = new CreateAccount();

    @PostMapping("/login")
    public Map<String, Boolean> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "");
        String password = body.getOrDefault("password", "");
        boolean success = login.login(username, password);
        return Map.of("success", success);
    }

    @PostMapping("/register")
    public Map<String, Boolean> register(@RequestBody Map<String, String> body) {
        String username    = body.getOrDefault("username", "");
        String password    = body.getOrDefault("password", "");
        String email       = body.getOrDefault("email", "");
        String phoneNumber = body.getOrDefault("phoneNumber", "");
        boolean success = createAccount.createAccount(username, password, email, phoneNumber);
        return Map.of("success", success);
    }
}
