const { test, expect } = require('@playwright/test');

test.describe('Booking Search', () => {

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
            await page.locator('body').press('Escape').catch(() => {});
    })

    test('User sees results', async ({ page }) => {
        await page.fill('input[name="ss"]', 'Paris');
        await page.keyboard.press('Enter');
        await page.waitForURL(/searchresults/, { timeout: 15000 });
        const results = page.locator('[data-testid="property-card"]');
        await expect(results.first()).toBeVisible();
    })

    test('Search with date', async ({ page }) => {
        await page.fill('input[name="ss"]', 'Paris');
        await page.getByTestId('searchbox-dates-container').click();
        await page.getByRole('checkbox', { name: 'Tu 12 May' }).click();
        await page.getByRole('checkbox', { name: 'Su 17 May' }).click();
        await page.getByRole('button', { name: /search/i }).click();
        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible();
    });

test('Search with guests and rooms', async ({ page }) => {

    await page.fill('input[name="ss"]', 'Paris');
    await page.getByTestId('occupancy-config').click();
    await page.getByTestId('occupancy-popup').waitFor({ state: 'visible' });
    const adultsInput = page.locator('#group_adults');
    const currentAdults = await adultsInput.getAttribute('value');
    if (currentAdults < 3) {
        await adultsInput.evaluate(el => {
            el.value = 3;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    const roomsInput = page.locator('#no_rooms');
    if (await roomsInput.count() > 0) {
        await roomsInput.evaluate(el => {
            el.value = 2;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }
    await page.getByRole('button', { name: /search/i }).click();
    await expect(page.locator('[data-testid="property-card"]').first())
        .toBeVisible();
});

 })