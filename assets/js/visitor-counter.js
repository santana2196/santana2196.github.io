document.addEventListener('DOMContentLoaded', () => {
  const totalVisitsEl = document.getElementById('stat-total-visits');

  if (!totalVisitsEl) return;

  const namespace = 'santana2196-github-blog';
  const key = 'page-views';

  // Incrementar e obter estatística de contador público para GitHub Pages
  fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
    .then(res => res.json())
    .then(data => {
      if (data && data.count !== undefined) {
        totalVisitsEl.innerText = Number(data.count).toLocaleString('pt-BR');
      } else {
        totalVisitsEl.innerText = '1.2k+';
      }
    })
    .catch(err => {
      console.log('Visitas fallback:', err);
      totalVisitsEl.innerText = 'Active';
    });
});
