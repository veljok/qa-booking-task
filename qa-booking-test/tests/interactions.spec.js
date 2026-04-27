const { test, expect } = require('@playwright/test');

//Closing overlays function
async function closeOverlays(page) {

    await page.getByRole('button', {
        name: /accept|agree|dismiss|close|got it|sign in|google/i
    }).first().click({ timeout: 3000 }).catch(() => { });

    await page.keyboard.press('Escape').catch(() => { });
    await page.mouse.click(10, 10).catch(() => { });
}

test.describe('Booking Filters', () => {

    //search for a destination before each test 
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.booking.com');
        await closeOverlays(page);
        await page.fill('input[name="ss"]', 'Novi Sad');
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible({ timeout: 20000 });

        //ui waits before filter
        await page.waitForTimeout(2000);
        await closeOverlays(page);
    });
    //filters ratings, interacts with wishlist toggle
    test('Filters by rating + wishlist toggle', async ({ page }) => {

        const filter = page
            .getByRole('group', { name: /review score/i })
            .getByRole('checkbox', { name: /very good.*8\+/i });

        await filter.click();
        await page.waitForTimeout(2000);

        const firstCard = page.locator('[data-testid="property-card"]').first();

        await expect(firstCard).toBeVisible();

        // wishlist dugme unutar kartice
        const wishlistBtn = firstCard.getByTestId('wishlist-button');
        await expect(wishlistBtn).toBeVisible();

        // add
        await wishlistBtn.click();

        await page.waitForTimeout(2000);

        // remove
        await wishlistBtn.click();

        //check if state changed
        await expect(wishlistBtn).toHaveAttribute(
            'aria-label',
            /save/i
        );
    });
    // does booking load more results on scroll
    test('Loads more results on scroll', async ({ page }) => {

        const cards = page.locator('[data-testid="property-card"]');

        // counts starting number of results
        const initialCount = await cards.count();
        expect(initialCount).toBeGreaterThan(0);

        // scroll
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(3000);

        // counts results after scroll
        const newCount = await cards.count();

        // compare
        expect(newCount).toBeGreaterThan(initialCount);
    });


});