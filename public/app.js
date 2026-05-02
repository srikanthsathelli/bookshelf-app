let books = [];
let currentFilter = 'all';

// ----- DOM elements -----
const form = document.getElementById('add-form');
const titleInput = document.getElementById('title-input');
const authorInput = document.getElementById('author-input');
const statusSelect = document.getElementById('status-select');
const errorMessage = document.getElementById('error-message');
const bookList = document.getElementById('book-list');
const emptyState = document.getElementById('empty-state');
const counter = document.querySelector('[data-testid="counter"]');
const filterButtons = document.querySelectorAll('.filter-btn');

// ----- Status flow -----
const statusOrder = ['to-read', 'reading', 'finished'];
const statusLabels = {
  'to-read': 'To Read',
  'reading': 'Reading',
  'finished': 'Finished'
};

// ----- localStorage -----
function loadBooks() {
  const saved = localStorage.getItem('bookshelf-books');
  if (saved) books = JSON.parse(saved);
}

function saveBooks() {
  localStorage.setItem('bookshelf-books', JSON.stringify(books));
}

// ----- Add Book -----
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusSelect.value;

  if (!title) {
    showError('Title is required');
    return;
  }

  hideError();

  books.push({
    id: Date.now().toString(),
    title,
    author: author || 'Unknown',
    status
  });

  saveBooks();
  render();
  form.reset();
  titleInput.focus();
});

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

// ----- Cycle Status -----
function cycleStatus(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;
  const idx = statusOrder.indexOf(book.status);
  book.status = statusOrder[(idx + 1) % statusOrder.length];
  saveBooks();
  render();
}

// ----- Delete -----
function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveBooks();
  render();
}

// ----- Filter -----
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

// ----- Render -----
function render() {
  const total = books.length;
  counter.textContent = `${total} ${total === 1 ? 'book' : 'books'} in your collection`;

  const filtered =
    currentFilter === 'all' ? books : books.filter((b) => b.status === currentFilter);

  bookList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  filtered.forEach((book) => {
    const li = document.createElement('li');
    li.className = `book-item ${book.status}`;
    li.dataset.testid = 'book-item';
    li.dataset.bookId = book.id;

    li.innerHTML = `
      <div class="book-info">
        <div class="book-title" data-testid="book-title">${escapeHtml(book.title)}</div>
        <div class="book-author" data-testid="book-author">by ${escapeHtml(book.author)}</div>
        <span class="book-status" data-testid="book-status">${statusLabels[book.status]}</span>
      </div>
      <div class="book-actions">
        <button class="status-btn" data-testid="status-btn">Next Status</button>
        <button class="delete-btn" data-testid="delete-btn">Delete</button>
      </div>
    `;

    li.querySelector('.status-btn').addEventListener('click', () => cycleStatus(book.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteBook(book.id));

    bookList.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ----- Init -----
loadBooks();
render();