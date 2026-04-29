Feature('Booking Interactions');

Before(({ I }) => {

  I.amOnPage('https://www.booking.com');

  // close initial popup
  I.pressKey('Escape');
  I.wait(2);

  // search destination
  I.fillField('input[name="ss"]', 'Novi Sad');
  I.pressKey('Enter');

  // wait results
  I.waitForElement('[data-testid="property-card"]', 20);
  I.wait(2);
});
 
Scenario('Filters by rating + wishlist toggle', ({ I }) => {

  // click rating filter
  I.click('text=Review score');
  I.click('text=Very good: 8+');

  I.waitForElement('[data-testid="property-card"]', 20);

  const firstCard = locate('[data-testid="property-card"]').first();
  const wishlistBtn = firstCard.find('[data-testid="wishlist-button"]');

  I.seeElement(firstCard);

  // hover helps reveal wishlist button
  I.moveCursorTo(firstCard);
  I.wait(1);

  I.click(wishlistBtn);
  I.wait(2);

  I.click(wishlistBtn);
});
 // does booking load more results on scroll
Scenario('Loads more results on scroll', async ({ I }) => {

  const initialCount = await I.grabNumberOfVisibleElements('[data-testid="property-card"]');

  I.seeElement(locate('[data-testid="property-card"]').first());

  // scroll to bottom
  I.scrollPageToBottom();
  I.wait(3);

  const newCount = await I.grabNumberOfVisibleElements('[data-testid="property-card"]');

  I.say(`Initial: ${initialCount}, New: ${newCount}`);

  if (newCount <= initialCount) {
    throw new Error('Scroll did not load more results');
  }
});
//does going back and forward keep search results
Scenario('Back and Forward keeps search query', ({ I }) => {

  const urlBefore = I.grabCurrentUrl();

  I.executeScript(() => window.history.back());
  I.wait(2);

  I.executeScript(() => window.history.forward());
  I.wait(2);

  I.seeInCurrentUrl('ss=');
});