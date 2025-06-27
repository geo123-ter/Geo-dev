const apiKey = 'f26ba1e2cbcc4a9ab3e2e342e46e2729';
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryButtons = document.querySelectorAll('.category-btn');

let currentCategory = 'general';
let currentPage = 1;
const pageSize = 5; // articles per page
let currentQuery = '';

function fetchNews(query = '', category = 'general', page = 1) {
  let url = '';

  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      newsContainer.innerHTML = '';

      if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = '<p>No news found.</p>';
        return;
      }

      data.articles.forEach(article => {
        const articleEl = document.createElement('article');
        articleEl.innerHTML = `
          <h2>${article.title}</h2>
          ${article.urlToImage ? `<img src="${article.urlToImage}" alt="Article image">` : ''}
          <p>${article.description || ''}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(articleEl);
      });

      // Pagination controls
      renderPagination(data.totalResults, page, pageSize);
    })
    .catch(err => {
      newsContainer.innerHTML = '<p>Error loading news. Try again later.</p>';
      console.error(err);
    });
}

function renderPagination(totalResults, currentPage, pageSize) {
  const totalPages = Math.ceil(totalResults / pageSize);
  let paginationHTML = '<div id="pagination" style="text-align:center; margin: 20px 0;">';

  for (let i = 1; i <= totalPages && i <= 10; i++) { // limit max pages to 10
    paginationHTML += `<button class="page-btn" data-page="${i}" style="margin: 0 3px; padding: 5px 10px; cursor:pointer;${i === currentPage ? 'font-weight:bold; background:#007acc; color:white;' : ''}">${i}</button>`;
  }
  paginationHTML += '</div>';

  // Add or replace pagination below news
  let oldPagination = document.getElementById('pagination');
  if (oldPagination) {
    oldPagination.outerHTML = paginationHTML;
  } else {
    newsContainer.insertAdjacentHTML('afterend', paginationHTML);
  }

  // Add click events to pagination buttons
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.getAttribute('data-page'));
      currentPage = page;
      fetchNews(currentQuery, currentCategory, currentPage);
    });
  });
}

// Category button click
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.getAttribute('data-category');
    currentQuery = '';
    searchInput.value = '';
    currentPage = 1;
    fetchNews('', currentCategory, currentPage);
  });
});

// Search button click
searchBtn.addEventListener('click', () => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  fetchNews(currentQuery, '', currentPage);
});

// Initial fetch
fetchNews('', currentCategory, currentPage);


const menuToggle = document.getElementById('menuToggle');
const categoriesNav = document.getElementById('categories');

menuToggle.addEventListener('click', () => {
  if (categoriesNav.classList.contains('open')) {
    categoriesNav.classList.remove('open');
    categoriesNav.classList.add('closed');
  } else {
    categoriesNav.classList.remove('closed');
    categoriesNav.classList.add('open');
  }
});


//dark theme toggle

const darkModeToggle = document.getElementById('darkModeToggle');

// Load saved theme from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
});
