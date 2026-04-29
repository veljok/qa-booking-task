Feature('Booking Edge Cases');

Before(({ I }) => {

  I.amOnPage('https://www.booking.com')

  //close popup
  I.wait(2)
  I.click('button[aria-label="Dismiss sign-in info."]')
    .catch(() => {})

  I.pressKey('Escape') // fallback
  I.wait(1)
})
//searcching with invalid input
Scenario('Search with invalid destination input', ({ I }) => {

    I.fillField('input[name="ss"]', '@@@@@@###$$$');
    I.pressKey('Enter');

    I.wait(3);

    I.seeElement('body');

    // make sure it doesnt crash
    const url = I.grabCurrentUrl();
    I.say('Current URL: ' + url);
});

Scenario('Empty search submit shows validation', async ({ I }) => {

  // click on input but dont fill it
  I.click('input[name="ss"]')
  I.pressKey('Tab')

  // try to submit
  I.pressKey('Enter')
  I.wait(2)

  // check if we stayed on the page
  I.seeElement('input[name="ss"]')

  // check if we see any results
  I.dontSeeElement('[data-testid="property-card"]')
})

Scenario('Search handles extra whitespace in input', async ({ I }) => {

    I.fillField('input[name="ss"]', '     Novi     Sad     ');
    I.pressKey('Enter');

    I.waitForElement('[data-testid="property-card"]', 20);
    I.seeElement('[data-testid="property-card"]');

    const count = await I.grabNumberOfVisibleElements('[data-testid="property-card"]');
    I.say(`Results found: ${count}`);

    const assert = require('assert');
    assert.ok(count > 0);
});
