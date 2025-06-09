import fs from 'fs';
import { TextEncoder, TextDecoder } from 'util';
import { createRequire } from 'module';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const require = createRequire(import.meta.url);
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('./index.html','utf8');

test('renders chart or fallback', async () => {
  const dom = new JSDOM(html, {runScripts:'dangerously', resources:'usable'});
  global.fetch = () => Promise.resolve({json: () => Promise.resolve({weeklyIndex:[], latestItems:[]})});
  await new Promise(r=>dom.window.addEventListener('load', r));
  const chart = dom.window.document.getElementById('chart');
  const fallback = dom.window.document.getElementById('fallback');
  expect(chart || fallback).toBeTruthy();
});
