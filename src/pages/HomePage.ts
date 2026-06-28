import { expect, Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export type RoomCard = {
  title: string;
  priceText: string;
};

export default class HomePage extends BasePage {
  readonly rooms: Locator;
  readonly roomCards: Locator;
  readonly firstRoomCta: Locator;

  constructor(page: Page) {
    super(page);

    // Generic selectors (assignment site may vary). These are written to be tolerant.
    this.rooms = page.locator('[data-testid="room"], [class*="room"], [id*="room"]');
    this.roomCards = page.locator('[data-testid="room-card"], [class*="room-card"], [id*="room-card"], .room-card');
    this.firstRoomCta = page.locator(
      'button:has-text("Book"), button:has-text("Select"), a:has-text("Book"), a:has-text("Select").first'
    );
  }

  async assertLoaded() {
    // Wait for some page landmark.
    await expect(this.page.locator('body')).toBeVisible();
  }

  async getRoomCount(): Promise<number> {
    // Prefer cards; fallback to rooms.
    const countCards = await this.roomCards.count();
    if (countCards > 0) return countCards;

    const countRooms = await this.rooms.count();
    if (countRooms > 0) return countRooms;

    // Heuristic fallback for this UI: count reservation/book links.
    const reservationLinks = this.page.locator('a[href*="/reservation/"]').filter({ hasText: /book/i });
    return await reservationLinks.count();
  }

  async getAvailableRooms(): Promise<RoomCard[]> {
    // Try to derive title/price from common patterns.
    const cards = this.roomCards;
    const count = await cards.count();

    // If we can't detect cards, fallback to raw rooms.
    const toUse = count > 0 ? cards : this.rooms;
    const toUseCount = await toUse.count();

    const result: RoomCard[] = [];
    for (let i = 0; i < toUseCount; i++) {
      const item = toUse.nth(i);

      // Common patterns on the assignment site.
      const title =
        (await item
          .locator('h1,h2,h3,[class*="title"],[data-testid*="title"], .card-title')
          .first()
          .textContent()) ?? '';

      // Price may be inside text like "$200"; keep heuristic tolerant.
      const priceText =
        (await item
          .locator('[class*="price"],[data-testid*="price"], .price, text=/\\$\\s*\\d+/')
          .first()
          .textContent()) ?? '';

      result.push({ title: title.trim(), priceText: priceText.trim() });
    }

    return result;

  }

  async selectRoomByIndex(index: number): Promise<void> {
    const cards = this.roomCards;
    const countCards = await cards.count();

    const cardsToUse = countCards > 0 ? cards : this.rooms;
    const room = cardsToUse.nth(index);
    await expect(room).toBeVisible();

    // Assignment site uses "Book now" links that go to /reservation/:id?... 
    // Target only anchors (not header/footer links) to avoid strict-mode collisions.
    const bookLink = room.locator('a:has-text("Book now"), a:has-text("Book Now"), a:has-text("Book").first');

    // If the book link isn't inside the room container, fallback to a reservation-like link.
    if ((await bookLink.count()) > 0) {
      await this.click(bookLink.first());
      return;
    }

    const reservationLink = this.page.locator('a[href*="/reservation/"]').first();
    await this.click(reservationLink);
  }
}


