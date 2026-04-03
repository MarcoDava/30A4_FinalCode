/**
 * Shared presentation contract for account-facing UI pages (login, registration).
 * Presentation only: no credential validation, persistence, or role logic.
 */
export interface AccountPagesPresentation {
  displayPage(): void;
}
