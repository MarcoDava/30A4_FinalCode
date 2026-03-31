package com.example.demo;

public class ViewAccount {

    private String viewAccountId;

    public ViewAccount(String viewAccountId) {
        this.viewAccountId = viewAccountId;
    }

    public void displayAccount() {
        System.out.println("Viewing account: " + viewAccountId);
    }
}
