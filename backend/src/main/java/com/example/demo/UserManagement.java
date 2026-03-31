package com.example.demo;

public abstract class UserManagement {

    protected Login loginAccount;
    protected ViewAccount accountView;
    protected CreateAccount accountCreate;
    protected EditAccount accountEdit;

    public abstract boolean getUserRole(String role);

    public boolean login(String username, String password) {
        return loginAccount.login(username, password);
    }

    public boolean createAccount(String username, String password,
                                 String email, String phoneNumber) {
        return accountCreate.createAccount(username, password, email, phoneNumber);
    }

    public boolean editAccount(String username, String password,
                               String email, String phoneNumber) {
        return accountEdit.editAccount(username, password, email, phoneNumber);
    }
}
