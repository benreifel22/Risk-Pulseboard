const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  let hasError = false;

  page.on('console', msg => {
    const type = msg.type();
    console.log(`console.${type}:`, msg.text());
    if (type === 'error') hasError = true;
  });

  page.on('requestfailed', req => {
    console.log('requestfailed:', req.url());
    hasError = true;
  });

  await page.goto('http://localhost:4173');
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();

  if (hasError) {
    console.error('Errors detected');
    process.exit(1);
  } else {
    console.log('No errors detected');
  }
})();
