export async function load(){
  let data;
  try{
    const res = await fetch('./data.json');
    data = await res.json();
  }catch(e){
    data = null;
  }

  if(!data || !data.weeklyIndex || !data.weeklyIndex.length){
    const p = document.createElement('p');
    p.textContent = 'No data yet — check back tomorrow.';
    document.querySelector('h1').insertAdjacentElement('afterend', p);
    return;
  }

  renderChart(data.weeklyIndex);
  renderList(data.latestItems);
}

function renderChart(weeks){
  const ctx=document.getElementById('chart');
  new Chart(ctx,{
    type:'line',
    data:{
      labels:weeks.map(w=>w.week),
      datasets:[{label:'Impact',data:weeks.map(w=>w.impact),borderColor:'#d94a3a'}]
    },
    options:{scales:{y:{min:0,max:10}}}
  });
}

function renderList(items){
  const list=document.getElementById('item-list');
  items.forEach(it=>{
    const li=document.createElement('li');
    const badge=document.createElement('span');
    badge.className='badge';
    badge.textContent=it.impact.toFixed(1);
    if(it.impact>=8) badge.style.background='#d94a3a';
    else if(it.impact>=5) badge.style.background='#e4a11b';
    else badge.style.background='#2e7d32';
    const a=document.createElement('a');
    a.href=it.link; a.textContent=it.title; a.target='_blank';
    li.appendChild(badge); li.appendChild(a);
    list.appendChild(li);
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', load);
}
