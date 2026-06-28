. Setup Instructions
How to install and run the tests:

Make sure Node.js and npm are installed (download from nodejs.org).

Open the project folder restful-booker-automation in VS Code.

In the VS Code terminal, run:

bash
npm install
npx playwright install
npm test
Expected output:

Code
✓ 15 passed (about 2m 30s)
2. Scenarios Covered
The automation suite includes 15 test cases:

Home page loads with rooms

Display all available rooms with pricing

Select a room for booking

Booking form shows required fields

Room details (name, price, description)

Fill booking form with valid data

Submit booking successfully

Success confirmation message appears

End‑to‑end booking journey (browse → select → book → confirm)

Confirmation shows correct guest info

Multiple bookings in sequence

Booking with incomplete form data

Form persistence after refresh

Page load time check

Rooms load consistently across visits

3. Automation Decisions
Why these scenarios?  
They represent the full booking journey, common user actions, and edge cases.

Assumptions made:

The demo site (https://automationintesting.online) is stable and accessible.

Test data (names, emails, dates) can be reused safely.

Risks identified:

Site downtime may cause test failures.

Dynamic content (rooms availability) may change.

Browser updates could affect selectors.

4. Time Spent
Exploration: ~45 minutes

Framework setup: ~1 hour

Automation development: ~2 hours

Documentation: ~30 minutes
Total: ~3 hours 50 minutes

5. AI Usage Disclosure
I used AI tools to accelerate framework setup and boilerplate code. Manual effort was focused on writing scenarios, refining selectors, and documentation.

Tool Used: Claude (Anthropic)
Contribution Split:

~40% framework setup (Playwright + TypeScript config, CI/CD basics)

~35% Page Object Models (base classes, reusable methods)

~25% utilities (test data generators, fixtures)

Manual Development:

All 15 scenarios were manually designed and validated.

Documentation (README, risks, assumptions, time tracking) was written manually.

Selector strategies and fallback logic were manually tested.
