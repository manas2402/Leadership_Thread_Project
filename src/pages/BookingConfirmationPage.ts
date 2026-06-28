import { expect, Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class BookingConfirmationPage extends BasePage {
  readonly confirmationHeader: Locator;
  readonly bookingNumber: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.confirmationHeader = page.locator('h1,h2,h3').filter({ hasText: /confirm|booking|success/i }).first();
    this.bookingNumber =
      page.locator('[data-testid*="booking"], [class*="booking"], [id*="booking"], .booking').filter({ hasText: /\d/ }).first();

    this.confirmationMessage = page.locator('[data-testid*="confirmation"], .confirmation, .success, text=/confirmed|success/i').first();
  }

  async assertConfirmationLoaded() {
    await expect(this.confirmationHeader.or(this.confirmationMessage)).toBeVisible();
  }

  async getConfirmationMessageText(): Promise<string> {
    const el = this.confirmationMessage.first();
    await this.waitForVisible(el);
    return (await el.textContent())?.trim() ?? '';
  }
}

