import fs from 'fs/promises';
import Parser from 'rss-parser';
import { parseISO, format } from 'date-fns';
import { scoreItem, bucketWeeks } from './impact.js';
import exposure from './clientExposure.json' assert { type: 'json' };

const FEEDS = [
  'https://ustr.gov/archive/Meta_Content/RSS/ustr_press_releases_10475.xml',
  'https://ustr.gov/archive/Meta_Content/RSS/ustr_recent_news_10495.xml',
  'https://www.wto.org/library/rss/latest_news_e.xml'
];

const parser = new Parser();

async function fetchFeed(url){
  const feed = await parser.parseURL(url);
  const source = url.includes('ustr') ? 'USTR' : url.includes('wto') ? 'WTO' : 'RSS';
  return feed.items.map(item => {
    const date = item.isoDate || item.pubDate || new Date().toISOString();
    const iso = format(new Date(date), 'yyyy-MM-dd');
    const impact = scoreItem(item.title || '', exposure);
    return {
      date: iso,
      source,
      title: item.title || '',
      link: item.link || '',
      impact
    };
  });
}

async function main(){
  let items = [];
  for(const url of FEEDS){
    try{
      const list = await fetchFeed(url);
      items = items.concat(list);
    }catch(e){
      console.error('Failed feed', url, e.message);
    }
  }
  items.sort((a,b)=>b.impact-a.impact);
  const latestItems = items.slice(0,10);
  const weeklyIndex = bucketWeeks(items);
  await fs.writeFile('data.json', JSON.stringify({weeklyIndex, latestItems}, null, 2));
}

main();
