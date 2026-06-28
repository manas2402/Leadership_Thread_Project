import { expect, Locator, Page } from '@playwright/test';

export default class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  protected getByRoleSafe(role: Parameters<Page['getByRole']>[0], name?: string | RegExp) {
    // Helper to reduce repetition.
    if (name === undefined) return this.page.getByRole(role as any);
    return this.page.getByRole(role as any, { name });
  }

  async waitForVisible(locator: Locator, timeoutMs = 10_000) {
    await expect(locator).toBeVisible({ timeout: timeoutMs });
  }

  async waitForEnabled(locator: Locator, timeoutMs = 10_000) {
    await expect(locator).toBeEnabled({ timeout: timeoutMs });
  }

  async click(locator: Locator) {
    // If selector resolves to multiple nodes (common with tolerant locators), click the first visible one.
    const firstVisible = locator.first();
    await this.waitForVisible(firstVisible);
    await this.waitForEnabled(firstVisible);
    await firstVisible.click();
  }

  async fill(locator: Locator, value: string) {
    await this.waitForVisible(locator);
    await locator.fill(value);
  }

  async selectOptionByValue(locator: Locator, value: string) {
    await this.waitForVisible(locator);
    await locator.selectOption(value);
  }

  async textContent(locator: Locator) {
    await this.waitForVisible(locator);
    const t = await locator.textContent();
    return (t ?? '').trim();
  }
}

