const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto('https://dev-alpha.dashboard.igoalzero.com', { waitUntil: 'networkidle', timeout: 60000 });
  await page.fill('#username', 'QAa');
  await page.fill('input[type="password"]', 'igz123');
  await Promise.all([
    page.click("//button[@class='ig-button authentication-submit-button']"),
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 })
  ]);

  await page.click("//span[normalize-space()='MODULE :']");
  await page.fill("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", 'A MOD');
  await page.waitForTimeout(500);
  await page.click("xpath=//button[normalize-space()='A MOD']");
  await page.waitForTimeout(2000);
  await page.click("xpath=//button[contains(@class,'filterButton-') and not(contains(@class,'addNewfilterButton'))]");
  await page.waitForTimeout(1000);
  await page.click("xpath=//button[contains(@class,'trigger-') and normalize-space()='Date']");
  await page.waitForTimeout(1000);
  await page.click("xpath=//label[normalize-space()='Custom']");
  await page.waitForTimeout(1000);

  const fromCount = await page.locator("//input[@placeholder='From Date']").count();
  const toCount = await page.locator("//input[@placeholder='To Date']").count();
  console.log('fromCount', fromCount, 'toCount', toCount);

  await page.click("//input[@placeholder='From Date']");
  await page.waitForTimeout(1000);
  const monthHeaderCount = await page.locator("//div[contains(@class,'react-datepicker__current-month')]").count();
  const prevCount = await page.locator("//button[@aria-label='Previous Month']").count();
  const nextCount = await page.locator("//button[@aria-label='Next Month']").count();
  console.log('monthHeaderCount', monthHeaderCount, 'prevCount', prevCount, 'nextCount', nextCount);

  if (monthHeaderCount > 0) {
    const monthHeaderText = await page.locator("//div[contains(@class,'react-datepicker__current-month')]").first().textContent();
    console.log('monthHeaderText', monthHeaderText.trim());
  }

  const fromDayLocator = page.locator("xpath=//div[contains(@aria-label, ',') and contains(@aria-label, ' 1') and normalize-space()='1']");
  const fromCountDay = await fromDayLocator.count();
  console.log('from day count', fromCountDay);
  if (fromCountDay > 0) {
    await fromDayLocator.first().click();
    console.log('Clicked from date 1');
  }

  await page.waitForTimeout(1000);
  await page.click("//input[@placeholder='To Date']");
  await page.waitForTimeout(1000);
  const toDayLocator = page.locator("xpath=//div[contains(@aria-label, ',') and contains(@aria-label, ' 10') and normalize-space()='10']");
  const toCountDay = await toDayLocator.count();
  console.log('to day count', toCountDay);
  if (toCountDay > 0) {
    await toDayLocator.first().click();
    console.log('Clicked to date 10');
  }

  await page.waitForTimeout(1000);
  console.log('from value', await page.locator("//input[@placeholder='From Date']").inputValue());
  console.log('to value', await page.locator("//input[@placeholder='To Date']").inputValue());

  await page.click("//button[normalize-space()='Apply']");
  await page.waitForTimeout(2000);

  const activeItems = await page.locator("//ul[contains(@class,'activeFiltersBar')]//li").all();
  console.log('activeFilter count', activeItems.length);
  for (let i = 0; i < activeItems.length; i++) {
    console.log('active item', i, await activeItems[i].textContent());
    console.log(await activeItems[i].evaluate(el => el.outerHTML));
  }

  const activeBadge = await page.locator("//ul[contains(@class,'activeFiltersBar')]//li[.//span[normalize-space() = 'Date:']]").count();
  console.log('active badge Date count', activeBadge);

  const allInputs = await page.locator('input').all();
  console.log('total inputs', allInputs.length);
  for (let i = 0; i < Math.min(allInputs.length, 50); i++) {
    console.log(i, await allInputs[i].getAttribute('placeholder'), await allInputs[i].getAttribute('type'), await allInputs[i].getAttribute('id'), await allInputs[i].getAttribute('class'));
  }

  await browser.close();
})();
