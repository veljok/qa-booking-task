const { test, expect } = require('@playwright/test');

//Closing overlays function
async function closeOverlays(page) {

    await page.getByRole('button', {
        name: /accept|agree|dismiss|close|got it|sign in|google/i
    }).first().click({ timeout: 3000 }).catch(() => { });

    await page.mouse.click(10, 10).catch(() => { });

    await page.keyboard.press('Escape').catch(() => { });
}
//test group
test.describe('Booking Filters', () => {
    //search for a destination before each test 
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.booking.com');
        //close overlays
        await closeOverlays(page);

        await page.fill('input[name="ss"]', 'Paris');
        await page.keyboard.press('Enter');

        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible({ timeout: 20000 });
        //close overlays again
        await closeOverlays(page);
    });
    //Filter by rating
    test('Filters by rating', async ({ page }) => {

        const filter = page
            .getByRole('group', { name: /review score/i })
            .getByRole('checkbox', { name: /very good.*8\+/i });

        await filter.click();

        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible();
    });

    //rating validation
    test('Results have rating 8+', async ({ page }) => {

        const filter = page
            .getByRole('group', { name: /review score/i })
            .getByRole('checkbox', { name: /very good.*8\+/i });

        await filter.click();
        const ratings = page.locator('[data-testid="property-card"] [data-testid="review-score"]');
        await expect(ratings.first()).toBeVisible();

        //count number of results 8 or greater
        const count = await ratings.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const text = await ratings.nth(i).innerText();

            const value = parseFloat(text.replace(',', '.'));
            if (isNaN(value)) continue;

            expect(value).toBeGreaterThanOrEqual(8);
        }
    });
    //sorting 
    test('Sort by price (highest first)', async ({ page }) => {

        await page.mouse.click(10, 10);

        const sortBtn = page.getByTestId('sorters-dropdown-trigger');
        await sortBtn.click();

        const highestPrice = page.locator('[data-testid="sorters-dropdown"] button')
            .filter({ hasText: /price/i })
            .filter({ hasText: /high/i });

        await highestPrice.first().click();

        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible();
    });
});