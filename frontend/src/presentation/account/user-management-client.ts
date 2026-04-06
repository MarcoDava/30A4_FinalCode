/**
 * Frontend boundary aligned with UserManagement: account actions are delegated here,
 * not implemented inside presentation pages.
 */
export interface UserManagementClient {
  login(username: string, password: string): Promise<boolean>;
  createAccount(
    username: string,
    password: string,
    email: string,
    phoneNumber: string
  ): Promise<boolean>;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

/** Real HTTP client that delegates to the Spring Boot backend. */
export function createHttpUserManagementClient(): UserManagementClient {
  return {
    async login(username, password) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        return data.success === true;
      } catch {
        return false;
      }
    },
    async createAccount(username, password, email, phoneNumber) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email, phoneNumber }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        return data.success === true;
      } catch {
        return false;
      }
    },
  };
}

/** Placeholder — always fails. Use createHttpUserManagementClient() in production. */
export function createStubUserManagementClient(): UserManagementClient {
  return {
    async login() {
      return false;
    },
    async createAccount() {
      return false;
    },
  };
}
