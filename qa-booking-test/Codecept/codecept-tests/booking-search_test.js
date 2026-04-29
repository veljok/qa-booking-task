Feature('Booking Search');

Before(({ I }) => {

    I.amOnPage('https://www.booking.com');

    I.pressKey('Escape');
    I.wait(2);

    // close sign in
    I.grabNumberOfVisibleElements('button[aria-label="Dismiss sign-in info."]').then(count => {
        if (count > 0) I.click('button[aria-label="Dismiss sign-in info."]');
    });

});
Scenario('User sees results', async ({ I }) => {

    // input destination
    I.fillField('input[name="ss"]', 'Novi Sad');
    I.wait(1);
    // submit
    I.pressKey('Enter');
    // wait for url
    I.waitInUrl('searchresults', 15);
    // wait for results
    I.waitForElement('[data-testid="property-card"]', 15);
    // check if there are any result
    I.seeElement('[data-testid="property-card"]');
});
//searching with date
Scenario('Search with date', ({ I }) => {

    I.fillField('input[name="ss"]', 'Novi Sad');

    // open calendar
    I.click('[data-testid="searchbox-dates-container"]');

    // pick dates
    I.click('[data-date="2026-05-12"]');
    I.click('[data-date="2026-05-17"]');

    I.click('button[type="submit"]');

    // validate
    I.waitForElement('[data-testid="property-card"]', 15);
    I.seeElement('[data-testid="property-card"]');
});
// search with changing guests and rooms
Scenario('Search with guests and rooms', ({ I }) => {

    I.fillField('input[name="ss"]', 'Novi Sad')

    I.click('[data-testid="occupancy-config"]')
    I.waitForElement('[data-testid="occupancy-popup"]', 10)
    //change number of guests in DOM (because of the lack of locators on page)
    I.executeScript(() => {
        const el = document.querySelector('#group_adults')
        el.value = 5
        el.dispatchEvent(new Event('input', { bubbles: true }))
    })
    //change number of rooms in DOM (same reason)
    I.executeScript(() => {
        const el = document.querySelector('#no_rooms')
        if (el) {
            el.value = 3
            el.dispatchEvent(new Event('input', { bubbles: true }))
        }
    })

    I.click('button[type="submit"]')

    I.waitForElement('[data-testid="property-card"]', 15)
    I.seeElement('[data-testid="property-card"]')
})