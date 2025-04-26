const searchBtn = document.getElementById('searchBtn');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.getElementById('searchInput');
const dropdown = document.getElementById('dropdown');

// Mock data
const mockData = ['Apple', 'Banana', 'Orange', 'Mango', 'Grape', 'Peach'];

// Close the search panel
function closeSearch() {
  searchContainer.classList.remove('expanded');
  searchContainer.classList.add('colapse');
  searchBtn.textContent = '🔍';
  searchInput.value = '';
  dropdown.style.display = 'none';
}

// Open the search panel
function openSearch() {
  searchContainer.classList.add('expanded');
  searchContainer.classList.remove('colapse');
  searchBtn.textContent = '❌';
  searchInput.focus();
}

// Filter matching data
function filterData(query) {
  return mockData.filter(item => item.toLowerCase().includes(query.toLowerCase()));
}

// Highlight matched text
function highlightMatch(item, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return item.replace(regex, '<strong>$1</strong>');
}

// Show dropdown list
function showDropdown(items, query) {
  dropdown.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = highlightMatch(item, query);
    li.addEventListener('click', () => {
      searchInput.value = item;
      closeSearch();
    });
    dropdown.appendChild(li);
  });
  dropdown.style.display = items.length ? 'block' : 'none';
}

// Toggle search when button clicked
searchBtn.addEventListener('click', () => {
  if (searchContainer.classList.contains('expanded')) {
    closeSearch();
  } else {
    openSearch();
  }
});
    
// Auto-expand on typing + show matches
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  const results = filterData(query);

  if (query) {
    openSearch();
  } else {
    searchBtn.textContent = '🔍';
  }

  showDropdown(results, query);
});

// Collapse when clicking outside
document.addEventListener('click', (event) => {
  if (!searchContainer.contains(event.target)) {
    closeSearch();
  }
});

// Collapse with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSearch();
  }
});
