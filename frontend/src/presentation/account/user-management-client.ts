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

/** Placeholder until a real API client is wired to the backend. */
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
