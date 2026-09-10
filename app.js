// Function to load watchlist from local storage on startup
function loadWatchlist() {
  const storedWatchlist = localStorage.getItem('watchlist');
  return storedWatchlist ? JSON.parse(storedWatchlist) : [];
}

// Helper function to save current state to local storage
function saveWatchlist(list) {
  localStorage.setItem('watchlist', JSON.stringify(list));
}

// Initialize state from storage
let watchlist = loadWatchlist();

// Render initial UI on page load
function renderWatchlist() {
  const container = document.getElementById('watchlist-container');
  if (!container) return;
  
  container.innerHTML = '';
  watchlist.forEach((company, index) => {
    const item = document.createElement('div');
    item.textContent = company;
    container.appendChild(item);
  });
}

// 1. Add Company Handler (Persists to localStorage)
function addCompany(companyName) {
  if (!companyName) return;

  watchlist.push(companyName);
  saveWatchlist(watchlist); // Write back to localStorage
  renderWatchlist();
}

// 2. Clear Watchlist Handler (Removes from localStorage)
function clearWatchlist() {
  watchlist = [];
  localStorage.removeItem('watchlist'); // Clear from localStorage
  renderWatchlist();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  renderWatchlist();
});