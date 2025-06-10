const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

it('renders chart or fallback', async () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

  await new Promise(r => {
    dom.window.document.addEventListener('DOMContentLoaded', r);
  });

  await new Promise(r => setTimeout(r, 1000));

  const hasCanvas = dom.window.document.querySelector('canvas');
  const hasP = dom.window.document.querySelector('p');
  expect(hasCanvas || hasP).not.toBeNull();
});
