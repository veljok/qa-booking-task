const { test, expect } = require('@playwright/test');

//Closing overlays function
async function closeOverlays(page) {

    await page.getByRole('button', {
        name: /accept|agree|dismiss|close|got it|sign in|google/i
    }).first().click({ timeout: 3000 }).catch(() => { });

    await page.keyboard.press('Escape').catch(() => { });
    await page.mouse.click(10, 10).catch(() => { });
}

test.describe('booking edge cases', () => {
    //Searching with invalid input
    test('Search with invalid destination input', async ({ page }) => {
        await page.goto('https://www.booking.com');
        await closeOverlays(page);
        const searchBox = page.locator('input[name="ss"]');

        // random input
        await searchBox.fill('@@@@@@###$$$');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);

        const results = page.locator('[data-testid="property-card"]');

        const count = await results.count();

        await expect(page).toHaveURL(/ss=|search/i);
        await expect(page.locator('body')).toBeVisible();

        // check if page is not crashed
        await expect(page).toHaveURL(/ss=|search/);
    });

    //does empty search work
    test('Empty search submit shows validation or stays on page', async ({ page }) => {

        await page.goto('https://www.booking.com');
        await closeOverlays(page);

        const searchButton = page.getByRole('button', { name: /search/i });
        await searchButton.click();
        await page.waitForLoadState('domcontentloaded');

        const url = page.url();
        expect(url).toContain('booking.com');

        await expect(page.locator('input[name="ss"]')).toBeVisible();
    });

    //extra whitespace input
    test('Search handles extra whitespace in input', async ({ page }) => {

        await page.goto('https://www.booking.com');
        await closeOverlays(page);

        const searchBox = page.locator('input[name="ss"]');

        // input a lot of spaces
        await searchBox.fill('     Novi     Sad     ');
        await page.keyboard.press('Enter');

        // wait for result
        const results = page.locator('[data-testid="property-card"]');
        await expect(results.first()).toBeVisible({ timeout: 20000 });

        // check if url shows search without extra spaces
        await expect(page).toHaveURL(/Novi.*Sad/i);
    });

});