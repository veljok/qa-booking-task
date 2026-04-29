Feature('Booking Filters')

Before(({ I }) => {

    I.amOnPage('https://www.booking.com')

    //   I.pressKey('Escape')
    I.wait(2)

    // search
    I.fillField('input[name="ss"]', 'Novi Sad')
    I.pressKey('Enter')

    I.waitForElement('[data-testid="property-card"]', 15)

    // close popup (simplified)
    I.click('body')
})

//filtering
Scenario('Filters by rating', ({ I }) => {

    // click on filter section to scroll to it
    I.click('text=Review score')
    I.wait(1)

    // apply filter
    I.click('text=Very good: 8+')
    I.waitForElement('[data-testid="property-card"]', 15)
    I.seeElement('[data-testid="property-card"]')
})


//validating filters
Scenario('Results have rating 8+', async ({ I }) => {

    //apply filter
    I.click('text=Very good: 8+')
    I.wait(3)

    // grab all ratings from DOM
    const ratings = await I.executeScript(() => {
        const els = document.querySelectorAll(
            '[data-testid="review-score"], [aria-label*="Scored"]'
        )
        return Array.from(els).map(el => el.innerText)
    })

    console.log('Ratings found:', ratings)

    // check
    if (!ratings.length) {
        throw new Error('No ratings found')
    }

    // validate
    ratings.forEach(r => {
        const value = parseFloat(r.replace(',', '.'))

        if (!isNaN(value)) {
            if (value < 8) {
                throw new Error(`Rating below 8 found: ${value}`)
            }
        }
    })
})
//sorting by price
Scenario('Sort by price (highest first)', ({ I }) => {

    I.pressKey('Escape')
    I.wait(1)

    // to close date ui
    I.click('input[name="ss"]')
    I.pressKey('Escape')
    I.wait(1)

    I.waitForElement('[data-testid="property-card"]', 15)
    //click sort
    I.click('[data-testid="sorters-dropdown-trigger"]')
    I.click('text=Price (highest first)')

    I.waitForElement('[data-testid="property-card"]', 15)
    I.seeElement('[data-testid="property-card"]')
})
//test if numeric rating match textual
Scenario('Rating numeric and text consistency', async ({ I }) => {

  //apply filter
  I.click('text=Very good: 8+')
  I.wait(3)

  // get results (10 max)
  const results = await I.executeScript(() => {

    const cards = Array.from(
      document.querySelectorAll('[data-testid="property-card"]')
    ).slice(0, 10)

    return cards.map(card => {

      const scoreEl = card.querySelector('[data-testid="review-score"]')
      const labelEl = card.querySelector(
        '[data-testid="review-score"] + div, [aria-label*="Scored"]'
      )

      if (!scoreEl) return null

      const scoreText = scoreEl.innerText
      const score = parseFloat(scoreText.replace(',', '.'))

      let label = ''
      if (labelEl) {
        label = labelEl.innerText.toLowerCase()
      }

      return { score, label }
    })
  })

  //validation
  if (!results.length) {
    throw new Error('No results found')
  }

  for (const item of results) {
    if (!item || isNaN(item.score)) continue

    const score = item.score
    const label = item.label

    if (score >= 9) {
      if (!/superb|excellent|wonderful/.test(label)) {
        throw new Error(`Mismatch: ${score} -> ${label}`)
      }
    }

    else if (score >= 8) {
      if (!/very good|fabulous/.test(label)) {
        throw new Error(`Mismatch: ${score} -> ${label}`)
      }
    }

    else if (score >= 7) {
      if (!/good/.test(label)) {
        throw new Error(`Mismatch: ${score} -> ${label}`)
      }
    }
  }
})