// Elementos del DOM
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.querySelector(".results");
const historyContainer = document.querySelector(".history-sidebar");

// Historial
let searchHistory = JSON.parse(localStorage.getItem("musicSearchHistory")) || [];

// Función de búsqueda
async function searchMusic(query) {
  if (!query) return;
  
  try {
    searchButton.disabled = true;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    resultsContainer.innerHTML = '';
    
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=12`);
    const data = await response.json();
    
    if (!data.results?.length) {
      resultsContainer.innerHTML = `<div class="error"><i class="fas fa-music"></i><p>No se encontraron resultados</p></div>`;
    } else {
      displayResults(data.results.slice(0, 12));
      updateHistory(query);
    }
  } catch {
    resultsContainer.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i><p>Error al conectar</p></div>`;
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = '<i class="fas fa-search"></i><span>Buscar</span>';
  }
}

// Mostrar resultados
function displayResults(tracks) {
  resultsContainer.innerHTML = tracks.map((track, i) => `
    <div class="track-card" style="animation-delay: ${i * 0.1}s">
      <img src="${track.artworkUrl100.replace('100x100', '300x300')}" alt="${track.trackName}">
      <div class="track-info">
        <h3>${track.trackName || 'Sin título'}</h3>
        <p>${track.artistName}</p>
        <p>${track.collectionName || 'Álbum no disponible'}</p>
      </div>
      <div class="track-actions">
        ${track.previewUrl ? `
          <button class="preview-button" data-preview="${track.previewUrl}">
            <i class="fas fa-play"></i> Escuchar
          </button>
          <audio src="${track.previewUrl}"></audio>
        ` : '<p class="no-preview">Previsualización no disponible</p>'}
      </div>
    </div>
  `).join("");

  document.querySelectorAll('.preview-button').forEach(btn => {
    btn.addEventListener('click', function() {
      const audio = this.nextElementSibling;
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) a.pause();
        a.previousElementSibling?.classList.remove('playing');
        a.previousElementSibling && (a.previousElementSibling.innerHTML = '<i class="fas fa-play"></i> Escuchar');
      });
      
      if (audio.paused) {
        audio.play();
        this.classList.add('playing');
        this.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        audio.onended = () => {
          this.classList.remove('playing');
          this.innerHTML = '<i class="fas fa-play"></i> Escuchar';
        };
      } else {
        audio.pause();
        this.classList.remove('playing');
        this.innerHTML = '<i class="fas fa-play"></i> Escuchar';
      }
    });
  });
}

// Actualizar historial
function updateHistory(query) {
  if (query && !searchHistory.includes(query)) {
    if (searchHistory.length >= 10) searchHistory.shift();
    searchHistory.push(query);
    localStorage.setItem("musicSearchHistory", JSON.stringify(searchHistory));
    renderHistory();
  }
}

// Renderizar historial
function renderHistory() {
  historyContainer.innerHTML = `
  <div class="history-container">
    <div class="history-header">
      <h3><i class="fas fa-history"></i> Historial</h3>
      <i class="fas fa-chevron-down toggle-icon"></i>
    </div>
    <div class="history-content ${searchHistory.length ? 'expanded' : ''}">
      ${searchHistory.length ? searchHistory.map(term => `
        <div class="history-item"><i class="fas fa-search"></i> ${term}</div>
      `).reverse().join('') : '<p class="empty-history">No hay búsquedas recientes</p>'}
    </div>
    ${searchHistory.length ? `<button class="clear-history"><i class="fas fa-trash-alt"></i> Borrar historial</button>` : ''}
  </div>

  ${searchHistory.length > 2 ? `
    <div class="recommendations-container">
      <h3><i class="fas fa-lightbulb"></i> Recomendaciones</h3>
      <div class="recommendation-item">Radio similar a ${[...new Set(searchHistory)][0]}</div>
      <div class="recommendation-item">Artistas como ${[...new Set(searchHistory)][1]}</div>
      <div class="recommendation-item">Explora ${[...new Set(searchHistory)][2]}</div>
    </div>
  ` : ''}
`;

  document.querySelector('.history-header')?.addEventListener('click', () => {
    const content = document.querySelector('.history-content');
    content.classList.toggle('expanded');
    document.querySelector('.toggle-icon')?.classList.toggle('fa-chevron-down');
    document.querySelector('.toggle-icon')?.classList.toggle('fa-chevron-up');
  });

  document.querySelector('.clear-history')?.addEventListener('click', () => {
    searchHistory = [];
    localStorage.removeItem("musicSearchHistory");
    renderHistory();
  });

  document.querySelectorAll('.history-item, .recommendation-item').forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.textContent.split(' ').pop();
      searchMusic(searchInput.value);
    });
  });
}

// Event Listeners
searchButton.addEventListener("click", () => searchMusic(searchInput.value.trim()));
searchInput.addEventListener("keypress", (e) => e.key === "Enter" && searchMusic(searchInput.value.trim()));

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
  setTimeout(() => document.body.classList.add('loaded'), 300);
});