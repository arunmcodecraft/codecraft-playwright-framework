const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const baseUrl = 'https://dev-alpha.dashboard.igoalzero.com';
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[id="username"]', { timeout: 20000 });
  await page.fill('[id="username"]', 'QAa');
  await page.fill('[type="password"]', 'igz123');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }),
    page.click("//button[@class='ig-button authentication-submit-button']")
  ]);
  console.log('logged in', page.url());
  // Attempt to open A MOD
  await page.waitForSelector("xpath=//span[normalize-space()='MODULE :']", { timeout: 30000 });
  console.log('Found MODULE icon');
  await page.click("xpath=//span[normalize-space()='MODULE :']");
  await page.waitForTimeout(1000);
  await page.waitForSelector("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", { timeout: 30000 });
  console.log('Found module search input');
  await page.fill("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", 'A MOD');
  await page.waitForTimeout(500);
  await page.waitForSelector("xpath=//button[normalize-space()='A MOD']", { timeout: 30000 });
  console.log('Found A MOD button');
  const ModuleRecordPage = require('../src/pages/aModuleRecordCreationPage');
  const moduleRecordPage = new ModuleRecordPage(page, null);
  await moduleRecordPage.searchAndSelectModule();
  console.log('A MOD module opened');
  const summaryTextCount = await page.locator('text=Summary').count();
  console.log('text=Summary count', summaryTextCount);
  const summaryExactCount = await page.locator('text="Summary"').count();
  console.log('text="Summary" count', summaryExactCount);
  const summaryLinkCount = await page.locator('a', { hasText: 'Summary' }).count();
  console.log('anchor Summary count', summaryLinkCount);
  const summaryDivCount = await page.locator('div', { hasText: 'Summary' }).count();
  console.log('div Summary count', summaryDivCount);
  const anySummary = await page.evaluate(() => {
    const matches = Array.from(document.querySelectorAll('*')).filter(el => el.textContent.trim() === 'Summary');
    return matches.length;
  });
  console.log('exact textContent Summary count', anySummary);
  const html = await page.content();
  console.log('PAGE_CONTENT_START');
  console.log(html.slice(0, 20000));
  console.log('PAGE_CONTENT_END');
  const summaryHtml = await summaryContainer.evaluate((el) => el.outerHTML);
  console.log('SUMMARY_CONTAINER_HTML_START');
  console.log(summaryHtml);
  console.log('SUMMARY_CONTAINER_HTML_END');
  const filterButtons = await page.locator("//button[.//img or .//svg]").all();
  console.log('all filter-like buttons count', filterButtons.length);
  for (let i = 0; i < filterButtons.length; i++) {
    const html = await filterButtons[i].evaluate((el) => el.outerHTML);
    console.log(`BUTTON_${i}_HTML_START`);
    console.log(html);
    console.log(`BUTTON_${i}_HTML_END`);
  }
  await browser.close();
})();
