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
  await page.click("xpath=//span[normalize-space()='MODULE :']");
  await page.waitForSelector("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]");
  await page.fill("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", 'A MOD');
  await page.waitForTimeout(500);
  await page.click("xpath=//button[normalize-space()='A MOD']");
  await page.waitForTimeout(3000);
  await page.waitForSelector("xpath=//button[contains(@class,'filterButton-') and not(contains(@class,'addNewfilterButton'))]");
  await page.click("xpath=//button[contains(@class,'filterButton-') and not(contains(@class,'addNewfilterButton'))]");
  await page.waitForTimeout(1000);
  await page.click("xpath=//button[contains(@class,'trigger-X043W6') and normalize-space()='Date']");
  await page.waitForTimeout(1000);
  await page.click("xpath=//label[normalize-space() = 'Last 7 Days']");
  await page.waitForTimeout(500);
  await page.click("xpath=//button[normalize-space()='Apply']");
  await page.waitForTimeout(3000);
  const badges = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('*')).filter(el => el.textContent && el.textContent.trim().includes('Clear All'));
    return nodes.map(n => ({ tag: n.tagName, class: n.className, text: n.textContent.trim(), outerHTML: n.outerHTML.slice(0,400) }));
  });
  console.log(JSON.stringify(badges, null, 2));
  await browser.close();
})();
