import { test as base, expect, Page } from '@playwright/test';
import HomePage from '../../src/pages/HomePage';
import BookingPage from '../../src/pages/BookingPage';
import BookingConfirmationPage from '../../src/pages/BookingConfirmationPage';

type Fixtures = {
  homePage: HomePage;
  bookingPage: BookingPage;
  bookingConfirmationPage: BookingConfirmationPage;
};

type WorkerFixtures = {};

type PageFixtures = Fixtures;

export const test = base.extend<PageFixtures & WorkerFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },
  bookingConfirmationPage: async ({ page }, use) => {
    await use(new BookingConfirmationPage(page));
  }
});

export { expect };


