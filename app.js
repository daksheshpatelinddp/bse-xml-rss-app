// Load saved companies from localStorage when the app starts
function loadWatchlist() {
  const storedWatchlist = localStorage.getItem('watchlist');
  return storedWatchlist ? JSON.parse(storedWatchlist) : [];
}

// Save current list state to localStorage
function saveWatchlist(list) {
  localStorage.setItem('watchlist', JSON.stringify(list));
}

// Global watchlist array initialized directly from storage
let watchlist = loadWatchlist();

// Display items on the screen
function renderWatchlist() {
  const container = document.getElementById('watchlist-container');
  if (!container) return;

  container.innerHTML = '';

  if (watchlist.length === 0) {
    container.innerHTML = '<p>No companies in watchlist.</p>';
    return;
  }

  watchlist.forEach((company, index) => {
    const item = document.createElement('div');
    item.className = 'watchlist-item';
    item.textContent = company;
    container.appendChild(item);
  });
}

// Fixed Add Company Function: Reads input field value directly
function addCompany() {
  const inputElement = document.getElementById('company-input');
  if (!inputElement) return;

  const companyName = inputElement.value.trim();
  if (!companyName) return;

  watchlist.push(companyName);
  saveWatchlist(watchlist);
  renderWatchlist();

  inputElement.value = ''; // Reset input field
}

// Fixed Clear Watchlist Function
function clearWatchlist() {
  watchlist = [];
  localStorage.removeItem('watchlist');
  renderWatchlist();
}

// Run initial load and setup event listeners once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Render initial items saved in localStorage on first load
  renderWatchlist();

  // Attach button click events safely
  const addButton = document.getElementById('add-btn');
  if (addButton) {
    addButton.addEventListener('click', addCompany);
  }

  const clearButton = document.getElementById('clear-btn');
  if (clearButton) {
    clearButton.addEventListener('click', clearWatchlist);
  }
});