import './style.css';

const initApp = () => {
  const form = document.getElementById('rss-form');
  const input = document.getElementById('url-input');
  const feedsContainer = document.getElementById('feeds-container');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const url = input.value.trim();
    
    if (!url) {
      input.classList.add('is-invalid');
      return;
    }

    const feedCard = document.createElement('div');
    feedCard.className = 'card mb-3';
    feedCard.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${url}</h5>
        <p class="card-text text-muted">Поток добавлен</p>
      </div>
    `;
    
    feedsContainer.appendChild(feedCard);
    input.value = '';
    input.classList.remove('is-invalid');
  });

  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
  });
};

document.addEventListener('DOMContentLoaded', initApp);