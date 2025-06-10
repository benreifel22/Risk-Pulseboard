async function main() {
  const ctx = document.getElementById('chart').getContext('2d');
  let data;
  try {
    const res = await fetch('./data.json');
    if (!res.ok) throw new Error('Request failed');
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!data || !Array.isArray(data.weeklyIndex) || data.weeklyIndex.length === 0) {
    document.getElementById('chart').remove();
    document.getElementById('latest').insertAdjacentHTML('afterend',
      '<p style="margin-top:32px;color:#555">No data yet — check back tomorrow.</p>');
    return;
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.weeklyIndex.map((_, i) => `Week ${i + 1}`),
      datasets: [{
        label: 'Risk Index',
        data: data.weeklyIndex,
        borderColor: 'blue',
        tension: 0.3,
      }]
    }
  });

  const list = document.getElementById('latest');
  data.latestItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

main();
