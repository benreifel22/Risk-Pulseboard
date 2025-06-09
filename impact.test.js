import fs from 'fs';
import { scoreItem } from './impact.js';
const exposure = JSON.parse(fs.readFileSync('./clientExposure.json'));

test('severity keywords map to scores', () => {
  expect(scoreItem('New embargo announced', {})).toBe(5);
  expect(scoreItem('Tariff increase planned', {})).toBe(4);
  expect(scoreItem('Preliminary investigation launched', {})).toBe(2);
  expect(scoreItem('Misc news', {})).toBe(1);
});

test('exposure multiplier applied', () => {
  expect(scoreItem('Ban on China imports', exposure)).toBe(10);
});
