document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const articles = document.querySelectorAll('.article-card');

  if (!searchInput || !articles.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    articles.forEach((article) => {
      const title = article.querySelector('.article-title')?.innerText.toLowerCase() || '';
      const snippet = article.querySelector('.article-snippet')?.innerText.toLowerCase() || '';
      const tags = Array.from(article.querySelectorAll('.category'))
        .map((tag) => tag.innerText.toLowerCase())
        .join(' ');

      if (title.includes(query) || snippet.includes(query) || tags.includes(query)) {
        article.style.display = 'flex';
      } else {
        article.style.display = 'none';
      }
    });
  });
});
