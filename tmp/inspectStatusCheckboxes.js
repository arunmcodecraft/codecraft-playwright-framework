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
  const statusToggle = page.locator("xpath=//div[contains(@class,'filterElement')]//button[normalize-space()='Status']");
  await statusToggle.waitFor({ state: 'visible', timeout: 10000 });
  await statusToggle.click();
  await page.waitForTimeout(1000);
  const data = await page.evaluate(() => {
    const panel = document.querySelector('div.popup-AWPWds');
    if (!panel) return { error: 'panel not found' };
    const items = Array.from(panel.querySelectorAll('input[type=checkbox], button'))
      .map(el => {
        const label = el.closest('label')?.textContent?.trim() || el.getAttribute('aria-label') || el.textContent.trim();
        return {
          tag: el.tagName,
          type: el.type || null,
          class: el.className,
          id: el.id,
          label: label,
          outerHTML: el.outerHTML.slice(0, 400)
        };
      });
    const rows = Array.from(panel.querySelectorAll('div, label')).map(el => ({
      tag: el.tagName,
      class: el.className,
      id: el.id,
      text: el.textContent.trim().slice(0, 120),
      outerHTML: el.outerHTML.slice(0, 400)
    }));
    return { items: items.slice(0, 200), rows: rows.slice(0, 200) };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
