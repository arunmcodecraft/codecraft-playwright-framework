const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const baseUrl = 'https://dev-alpha.dashboard.igoalzero.com';
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[id="username"]', { timeout: 30000 });
  await page.fill('[id="username"]', 'QAa');
  await page.fill('[type="password"]', 'igz123');
  await Promise.all([
    page.click("//button[@class='ig-button authentication-submit-button']"),
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 })
  ]);
  await page.waitForSelector("xpath=//span[normalize-space()='MODULE :']", { timeout: 30000 });
  await page.click("xpath=//span[normalize-space()='MODULE :']");
  await page.waitForSelector("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", { timeout: 30000 });
  await page.fill("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", 'A MOD');
  await page.waitForTimeout(500);
  await page.click("xpath=//button[normalize-space()='A MOD']");
  await page.waitForTimeout(2000);
  const filterButton = page.locator("xpath=//button[contains(@class,'filterButton-') and not(contains(@class,'addNewfilterButton'))]");
  await filterButton.waitFor({ state: 'visible', timeout: 10000 });
  await filterButton.click();
  await page.waitForTimeout(1000);
  const dateTab = page.locator("xpath=//button[contains(@class,'trigger-') and normalize-space()='Date']");
  await dateTab.waitFor({ state: 'visible', timeout: 10000 });
  await dateTab.click();
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const panel = document.querySelector('div.panel-EP6Ask');
    if (!panel) return 'panel not found';
    const elements = Array.from(panel.querySelectorAll('*'));
    const labels = elements
      .filter(el => ['Today', 'Yesterday', 'Last 7 Days', 'Last Week', 'Month to Date', 'Previous Month', 'Custom'].includes(el.textContent.trim()))
      .map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim(), outerHTML: el.outerHTML.slice(0, 500) }));
    return labels;
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
