package com.example.demo;

public class UserManagementImpl extends UserManagement {

    public UserManagementImpl() {
        this.loginAccount  = new Login();
        this.accountCreate = new CreateAccount();
        this.accountEdit   = new EditAccount();
        this.accountView   = new ViewAccount();
    }

    @Override
    public boolean getUserRole(String role) {
        // All authenticated users share a single role for now.
        return "user".equals(role) || "admin".equals(role);
    }
}
