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
  console.log('Logged in to', page.url());
  await page.waitForSelector("xpath=//span[normalize-space()='MODULE :']", { timeout: 30000 });
  await page.click("xpath=//span[normalize-space()='MODULE :']");
  await page.waitForSelector("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", { timeout: 30000 });
  await page.fill("xpath=//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]", 'A MOD');
  await page.waitForTimeout(500);
  await page.click("xpath=//button[normalize-space()='A MOD']");
  await page.waitForTimeout(2000);
  await page.waitForSelector("xpath=//span[contains(@class,'moduleUnderline') or normalize-space()='A MOD']", { timeout: 30000 });
  console.log('A MOD loaded');

  const candidates = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.map((button) => {
      const text = button.innerText.trim();
      const aria = button.getAttribute('aria-label');
      const alt = button.querySelector('img') ? button.querySelector('img').getAttribute('alt') : null;
      const src = button.querySelector('img') ? button.querySelector('img').getAttribute('src') : null;
      return {
        text,
        aria,
        alt,
        src,
        outerHTML: button.outerHTML.slice(0, 400)
      };
    }).filter((b) => {
      const search = (b.text + ' ' + (b.aria || '') + ' ' + (b.alt || '') + ' ' + (b.src || '')).toLowerCase();
      return search.includes('filter') || search.includes('summary') || search.includes('sort') || search.includes('reset') || search.includes('status') || search.includes('search');
    });
  });

  console.log('Candidates:', JSON.stringify(candidates, null, 2));

  const filterButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons
      .filter(button => button.innerText.trim() === '' && button.querySelector('img'))
      .map((button) => ({
        alt: button.querySelector('img')?.getAttribute('alt') || null,
        src: button.querySelector('img')?.getAttribute('src') || null,
        outerHTML: button.outerHTML.slice(0, 400)
      }));
  });
  console.log('Icon buttons:', JSON.stringify(filterButtons, null, 2));

  await browser.close();
})();
