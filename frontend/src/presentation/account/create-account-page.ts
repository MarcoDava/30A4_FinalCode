import type { AccountPagesPresentation } from '@/presentation/account/account-pages-presentation';
import type { UserManagementClient } from '@/presentation/account/user-management-client';

export type CreateAccountFormValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phoneNumber: string;
};

/**
 * Presentation-level registration screen: collects account fields and delegates to UserManagement.
 */
export class CreateAccountPage implements AccountPagesPresentation {
  message = '';

  constructor(
    private readonly userManagement: UserManagementClient,
    private readonly onChange: () => void
  ) {}

  displayPage(): void {
    this.message = '';
    this.onChange();
  }

  async submit(values: CreateAccountFormValues): Promise<boolean> {
    const username = values.username.trim();
    const email = values.email.trim();
    const phone = values.phoneNumber.trim();
    if (!username || !values.password || !email || !phone) {
      this.message = 'Please fill in all required fields';
      this.onChange();
      return false;
    }
    if (values.password !== values.confirmPassword) {
      this.message = 'Passwords do not match';
      this.onChange();
      return false;
    }

    const ok = await this.userManagement.createAccount(username, values.password, email, phone);
    this.message = ok ? 'Account created successfully' : 'Could not create account';
    this.onChange();
    return ok;
  }
}
