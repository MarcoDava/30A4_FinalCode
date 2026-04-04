import type { AccountPagesPresentation } from '@/presentation/account/account-pages-presentation';
import type { UserManagementClient } from '@/presentation/account/user-management-client';

/**
 * Presentation-level login screen: collects credentials and delegates to UserManagement.
 */
export class LoginPage implements AccountPagesPresentation {
  message = '';

  constructor(
    private readonly userManagement: UserManagementClient,
    private readonly onChange: () => void
  ) {}

  displayPage(): void {
    this.message = '';
    this.onChange();
  }

  async submit(username: string, password: string): Promise<boolean> {
    const u = username.trim();
    if (!u || !password) {
      this.message = 'Please fill in all required fields';
      this.onChange();
      return false;
    }

    const ok = await this.userManagement.login(u, password);
    this.message = ok ? 'Login successful' : 'Invalid username or password';
    this.onChange();
    return ok;
  }
}
