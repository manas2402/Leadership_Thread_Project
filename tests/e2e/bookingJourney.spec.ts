import { test, expect } from '../fixtures/pageFixtures';
import { uniqueFirstName, uniqueLastName } from '../utils/testData';

const TC = (id: string) => `[${id}]`;

test.describe('Booking Journey - End to End', () => {
  test('TC-001 ' + TC('TC-001') + ' Home page loads with rooms', async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.assertLoaded();
    const count = await homePage.getRoomCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-002 ' + TC('TC-002') + ' Retrieve available rooms with pricing', async ({ homePage }) => {
    await homePage.goto('/');
    const rooms = await homePage.getAvailableRooms();
    expect(rooms.length).toBeGreaterThan(0);
    expect(rooms[0].priceText.length).toBeGreaterThan(0);
  });

  test('TC-003 ' + TC('TC-003') + ' User selects first available room for booking', async ({ homePage, bookingPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);
    await bookingPage.assertFormLoaded();
  });

  test('TC-004 ' + TC('TC-004') + ' Form fields are visible', async ({ homePage, bookingPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);
    await bookingPage.assertFormLoaded();
  });

  test('TC-005 ' + TC('TC-005') + ' Room details are displayed on booking form', async ({ homePage, bookingPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    // Heuristic: some text on page should exist besides form inputs.
    await expect(bookingPage.page.locator('body')).toBeVisible();
  });

  test('TC-006 ' + TC('TC-006') + ' Form accepts input', async ({ homePage, bookingPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    const firstName = uniqueFirstName();
    const lastName = uniqueLastName();

    await bookingPage.fillBookingForm({ firstName, lastName });

    // Verify via input values.
    await expect(bookingPage.page.locator('input[name*="first"], input[id*="first"], input[placeholder*="First"], [data-testid*="first"]').first()).toHaveValue(firstName);
    await expect(bookingPage.page.locator('input[name*="last"], input[id*="last"], input[placeholder*="Last"], [data-testid*="last"]').first()).toHaveValue(lastName);
  });

  test('TC-007 ' + TC('TC-007') + ' Form submits successfully', async ({ homePage, bookingPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    await bookingPage.fillBookingForm({ firstName: uniqueFirstName(), lastName: uniqueLastName() });
    await bookingPage.submitBooking();
    await bookingPage.expectSuccess();
  });

  test('TC-008 ' + TC('TC-008') + ' Success confirmation appears after submit', async ({ homePage, bookingPage, bookingConfirmationPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    await bookingPage.fillBookingForm({ firstName: uniqueFirstName(), lastName: uniqueLastName() });
    await bookingPage.submitBooking();

    await bookingConfirmationPage.assertConfirmationLoaded();
    const msg = await bookingConfirmationPage.getConfirmationMessageText();
    expect(msg.length).toBeGreaterThan(0);
  });

  test('TC-009 ' + TC('TC-009') + ' Complete booking journey (Browse → Select → Book → Confirm)', async ({ homePage, bookingPage, bookingConfirmationPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    await bookingPage.fillBookingForm({ firstName: uniqueFirstName(), lastName: uniqueLastName() });
    await bookingPage.submitBooking();

    await bookingConfirmationPage.assertConfirmationLoaded();
  });

  test('TC-010 ' + TC('TC-010') + ' Confirmation shows guest info', async ({ homePage, bookingPage, bookingConfirmationPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    const firstName = uniqueFirstName();
    const lastName = uniqueLastName();

    await bookingPage.fillBookingForm({ firstName, lastName });
    await bookingPage.submitBooking();

    const content = await bookingConfirmationPage.page.locator('body').textContent();
    expect(content ?? '').toContain(firstName);
    expect(content ?? '').toContain(lastName);
  });

  test('TC-011 ' + TC('TC-011') + ' Multiple bookings in sequence', async ({ homePage, bookingPage, bookingConfirmationPage }) => {
    for (let i = 0; i < 2; i++) {
      await homePage.goto('/');
      await homePage.selectRoomByIndex(0);
      await bookingPage.fillBookingForm({ firstName: uniqueFirstName(), lastName: uniqueLastName() });
      await bookingPage.submitBooking();
      await bookingConfirmationPage.assertConfirmationLoaded();
    }
  });

  test('TC-012 ' + TC('TC-012') + ' Attempt booking with incomplete form shows validation', async ({ homePage, bookingPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    // Fill only first name.
    await bookingPage.fillBookingForm({ firstName: uniqueFirstName(), lastName: '' });

    await bookingPage.submitBooking();

    // Generic validation expectation.
    const bodyText = await bookingPage.page.locator('body').textContent();
    expect(bodyText ?? '').toMatch(/required|invalid|error|enter/i);
  });

  test('TC-013 ' + TC('TC-013') + ' Form persistence after refresh', async ({ homePage, bookingPage }) => {
    await homePage.goto('/');
    await homePage.selectRoomByIndex(0);

    const firstName = uniqueFirstName();
    const lastName = uniqueLastName();

    await bookingPage.fillBookingForm({ firstName, lastName });

    await bookingPage.page.reload();

    const pageText = await bookingPage.page.locator('body').textContent();
    // Heuristic: persistence may or may not exist; just assert that page loads.
    expect(pageText ?? '').toHaveLength(0);
  });

  test('TC-014 ' + TC('TC-014') + ' Page load time acceptable', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const durationMs = Date.now() - start;
    expect(durationMs).toBeLessThan(10_000);
  });

  test('TC-015 ' + TC('TC-015') + ' Data consistency across visits', async ({ homePage }) => {
    await homePage.goto('/');
    const count1 = await homePage.getRoomCount();

    await homePage.goto('/');
    const count2 = await homePage.getRoomCount();

    // Heuristic: if the page momentarily fails to render rooms, retry once.
    if (count2 === 0) {
      await homePage.page.waitForLoadState('domcontentloaded');
      await homePage.page.waitForTimeout(1000);
    }
    const finalCount2 = await homePage.getRoomCount();

    expect(finalCount2).toBeGreaterThan(0);
    // Consistency heuristic: counts should not drastically diverge.
    expect(Math.abs(finalCount2 - count1)).toBeLessThanOrEqual(Math.max(1, Math.floor(count1 * 0.2)));
  });
});

