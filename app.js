// Function to load initial watchlist from backend worker
async function loadWatchlist() {
  try {
    const response = await fetch('/api/watchlist');
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error('Error fetching watchlist:', error);
  }
  
  // Fallback to localStorage if API request is unavailable
  const storedWatchlist = localStorage.getItem('watchlist');
  return storedWatchlist ? JSON.parse(storedWatchlist) : [];
}

// Global state array
let watchlist = [];

// Function to render saved companies in the UI
function renderWatchlist() {
  const container = document.getElementById('watchlist-container');
  if (!container) return;

  container.innerHTML = '';

  if (watchlist.length === 0) {
    container.innerHTML = '<div>No companies in watchlist.</div>';
    return;
  }

  watchlist.forEach((company) => {
    const item = document.createElement('div');
    item.className = 'watchlist-item';
    item.textContent = company;
    container.appendChild(item);
  });
}

// Add company handler: Updates state, localStorage, and sends API request
async function addCompany() {
  const input = document.getElementById('company-input');
  if (!input) return;

  const companyName = input.value.trim();
  if (!companyName) return;

  // Prevent duplicates
  if (!watchlist.includes(companyName)) {
    watchlist.push(companyName);
  }

  // Local storage update
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  input.value = '';
  renderWatchlist();

  // Network request to Cloudflare Worker backend
  try {
    await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watchlist })
    });
  } catch (error) {
    console.error('Error saving watchlist to backend:', error);
  }
}

// Clear watchlist handler: Clears local state and sends clear request
async function clearWatchlist() {
  watchlist = [];
  localStorage.removeItem('watchlist');
  renderWatchlist();

  // Network request to Cloudflare Worker backend
  try {
    await fetch('/api/watchlist', {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error clearing watchlist on backend:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch latest state from backend/localStorage
  watchlist = await loadWatchlist();
  renderWatchlist();

  // Attach button event listeners
  const addButton = document.getElementById('add-btn');
  const clearButton = document.getElementById('clear-btn');

  if (addButton) {
    addButton.addEventListener('click', addCompany);
  }

  if (clearButton) {
    clearButton.addEventListener('click', clearWatchlist);
  }
});