const { test, expect } = require('@playwright/test');

test.describe('Booking Search', () => {

    //open booking.com and close all popup windows
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.booking.com');
        await page.addInitScript(() => {
            Object.defineProperty(window, 'google', {
                get: () => undefined
            });
        });
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('button', { name: /dismiss|accept|agree|close|sign in/i })
            .click({ timeout: 5000 })
            .catch(() => { });
        await page.locator('body').press('Escape').catch(() => { });
    })
    // test if results are visible
    test('User sees results', async ({ page }) => {
        await page.fill('input[name="ss"]', 'Novi Sad');
        await page.keyboard.press('Enter');
        await page.waitForURL(/searchresults/, { timeout: 15000 });
        const results = page.locator('[data-testid="property-card"]');
        await expect(results.first()).toBeVisible();
    })
    //search with date
    test('Search with date', async ({ page }) => {
        await page.fill('input[name="ss"]', 'Novi Sad');
        await page.getByTestId('searchbox-dates-container').click();
        await page.getByRole('checkbox', { name: 'Tu 12 May' }).click();
        await page.getByRole('checkbox', { name: 'Su 17 May' }).click();
        await page.getByRole('button', { name: /search/i }).click();
        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible();
    });

    test('Search with guests and rooms', async ({ page }) => {
        //number of adults or rooms 
        const ADULTS = 5;
        const ROOMS = 3;

        await page.fill('input[name="ss"]', 'Novi Sad');
        await page.getByTestId('occupancy-config').click();
        await page.getByTestId('occupancy-popup').waitFor({ state: 'visible' });

        const adultsInput = page.locator('#group_adults');
        await adultsInput.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, ADULTS);

        const roomsInput = page.locator('#no_rooms');
        if (await roomsInput.count() > 0) {
            await roomsInput.evaluate((el, value) => {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, ROOMS);
        }

        await page.getByRole('button', { name: /search/i }).click();
        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible({ timeout: 15000 });
    });

})