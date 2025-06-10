import fs from 'fs';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { load } from './dashboard.js';

let html = fs.readFileSync('./index.html','utf8');
// remove Chart.js script for test environment
html = html.replace(/<script src="\.\/chart\.umd\.js"><\/script>/,'');

function resetDom(){
  document.documentElement.innerHTML = html;
}

test('shows fallback when data missing', async () => {
  resetDom();
  global.fetch = () => Promise.resolve({json: () => Promise.resolve({weeklyIndex:[], latestItems:[]})});
  global.Chart = function(){};
  await load();
  const msg = document.querySelector('h1 + p');
  expect(msg.textContent).toMatch(/No data yet/);
});

test('renders chart when data present', async () => {
  resetDom();
  global.fetch = () => Promise.resolve({json: () => Promise.resolve({weeklyIndex:[{week:'2024-W01', impact:5}], latestItems:[]})});
  global.Chart = function(){};
  await load();
  const canvas = document.getElementById('chart');
  expect(canvas).toBeTruthy();
});
