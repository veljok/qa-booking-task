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

    //Filter by rating
    test('Filters by rating', async ({ page }) => {

        const filter = page
            .getByRole('group', { name: /review score/i })
            .getByRole('checkbox', { name: /very good.*8\+/i });

        await filter.click();

        // wait for ui update
        await page.waitForTimeout(2000);

        await expect(filter).toBeChecked();
        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible();
    });


    //rating validation
    test('Results have rating 8+', async ({ page }) => {

        const filter = page
            .getByRole('group', { name: /review score/i })
            .getByRole('checkbox', { name: /very good.*8\+/i });

        await filter.click();
        await page.waitForTimeout(2500);
        const ratings = page.locator(
            '[data-testid="review-score"], [aria-label*="Scored"]'
        );

        await expect(ratings.first()).toBeVisible({ timeout: 10000 });
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

        // remove overlay 
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
        const sortBtn = page.getByTestId('sorters-dropdown-trigger');
        await expect(sortBtn).toBeVisible();
        await sortBtn.click();
        const highestPrice = page.getByRole('option', {
            name: /price.*high/i
        });

        await highestPrice.click();

        //wait for ui
        await page.waitForTimeout(2000);
        await expect(page.locator('[data-testid="property-card"]').first())
            .toBeVisible();
        await expect(sortBtn).toBeVisible();
    });
    // test if numeric rating mach textual rating
    test('Rating numeric and text consistency', async ({ page }) => {

        // filter by rating
        const filter = page
            .getByRole('group', { name: /review score/i })
            .getByRole('checkbox', { name: /very good.*8\+/i });

        await filter.click();
        await page.waitForTimeout(2500);
        //count number of results
        const cards = page.locator('[data-testid="property-card"]');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0); // to be more than 0
        //check only the first 10 results
        for (let i = 0; i < Math.min(count, 10); i++) {

            const card = cards.nth(i);

            const scoreEl = card.locator('[data-testid="review-score"]');
            const textEl = card.locator('[data-testid="review-score"] + div, [aria-label*="Scored"]');
            //skip if score doesnt display
            if (!(await scoreEl.isVisible())) continue;

            const scoreText = await scoreEl.innerText();
            const score = parseFloat(scoreText.replace(',', '.'));

            if (isNaN(score)) continue;
            //make labels lowercase 
            let label = '';
            if (await textEl.isVisible()) {
                label = (await textEl.innerText()).toLowerCase();
            }

            // validation
            if (score >= 9) {
                expect(label).toMatch(/superb|excellent|wonderful/);
            } else if (score >= 8) {
                expect(label).toMatch(/very good|fabulous/);
            } else if (score >= 7) {
                expect(label).toMatch(/good/);
            }
        }
    });
});