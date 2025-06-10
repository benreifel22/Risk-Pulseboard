import { getISOWeek, getISOWeekYear, parseISO } from 'date-fns';

const SEVERITY_MAP = [
  {score:5, words:["ban","embargo","suspension"]},
  {score:4, words:["increase","raise","expanded"]},
  {score:3, words:["impose","tariff","sanction"]},
  {score:2, words:["investigate","review","preliminary"]}
];

export function scoreItem(title, exposure){
  const lower = title.toLowerCase();
  let severity = 1;
  for(const {score, words} of SEVERITY_MAP){
    if(words.some(w => lower.includes(w))){
      severity = score; break;
    }
  }
  let multiplier = 1;
  if(exposure){
    const {hsCodes = [], countries = []} = exposure;
    if(hsCodes.some(c => lower.includes(c)) || countries.some(c => lower.includes(c.toLowerCase())))
      multiplier = 2;
  }
  return severity * multiplier;
}

export function bucketWeeks(items, max=12){
  const map = new Map();
  for(const it of items){
    const d = parseISO(it.date);
    const week = `${getISOWeekYear(d)}-W${String(getISOWeek(d)).padStart(2,'0')}`;
    const arr = map.get(week) || [];
    arr.push(it.impact);
    map.set(week, arr);
  }
  const weeks = Array.from(map.entries()).map(([week, impacts]) => ({
    week,
    impact: Math.min(10, impacts.reduce((a,b)=>a+b,0)/impacts.length)
  })).sort((a,b)=>a.week.localeCompare(b.week)).slice(-max);
  return weeks;
}
