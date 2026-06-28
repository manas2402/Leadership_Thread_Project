import { expect, Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export type BookingDetails = {
  firstName: string;
  lastName: string;
  totalPrice?: string;
  depositPaid?: boolean;
};

export default class BookingPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly totalPriceInput: Locator;
  readonly depositToggle: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Tolerant selectors.
    this.firstNameInput =
      page.locator('input[name*="first"], input[id*="first"], input[placeholder*="First"], [data-testid*="first"]').first();
    this.lastNameInput =
      page.locator('input[name*="last"], input[id*="last"], input[placeholder*="Last"], [data-testid*="last"]').first();
    this.totalPriceInput = page.locator('input[name*="price"], input[id*="price"], [data-testid*="price"]').first();

    this.depositToggle = page.locator('input[type="checkbox"], input[type="radio"], [role="switch"]').first();

    this.submitButton = page
      .locator('button:has-text("Book"), button:has-text("Submit"), button:has-text("Confirm"), input[type="submit"]')
      .first();

    this.successMessage = page.locator('[data-testid*="success"], .success, text=/success/i').first();
  }

  async assertFormLoaded() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillBookingForm(details: { firstName: string; lastName: string }) {
    await this.fill(this.firstNameInput, details.firstName);
    await this.fill(this.lastNameInput, details.lastName);
  }

  async submitBooking() {
    await this.click(this.submitButton);
  }

  async expectSuccess() {
    await this.successMessage.waitFor({ state: 'visible', timeout: 20_000 });
  }
}

