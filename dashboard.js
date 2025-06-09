async function load(){
  try{
    const res = await fetch('data.json');
    const data = await res.json();
    if(!data.weeklyIndex.length){
      document.getElementById('fallback').classList.remove('hidden');
      document.getElementById('chart').style.display='none';
      return;
    }
    renderChart(data.weeklyIndex);
    renderList(data.latestItems);
  }catch(e){
    document.getElementById('fallback').classList.remove('hidden');
    document.getElementById('chart').style.display='none';
  }
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

load();
