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

  const filterElements = await page.evaluate(() => {
    const results = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      const html = node.outerHTML;
      const search = html.toLowerCase();
      if (search.includes('filter') || search.includes('summary') || search.includes('status')) {
        results.push({
          tag: node.tagName,
          class: node.className,
          id: node.id,
          outerHTML: html.slice(0, 400)
        });
      }
    }
    return results;
  });

  console.log('Elements containing filter/summary/status:', JSON.stringify(filterElements, null, 2));

  const summaryNode = await page.evaluate(() => {
    const summaryEl = [...document.querySelectorAll('*')].find(el => el.textContent?.trim() === 'Summary');
    if (!summaryEl) return null;
    const ancestors = [];
    let node = summaryEl;
    while (node) {
      ancestors.push({
        tag: node.tagName,
        class: node.className,
        id: node.id,
        outerHTML: node.outerHTML.slice(0, 400)
      });
      node = node.parentElement;
      if (ancestors.length > 10) break;
    }
    return ancestors;
  });
  console.log('Summary element ancestry:', JSON.stringify(summaryNode, null, 2));

  await browser.close();
})();
