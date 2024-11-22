// Do your work here...
const bookForm = document.getElementById('bookForm');
const searchBookForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const searchBookTitle = document.getElementById('searchBookTitle');

let books = [];

// Fungsi untuk SAVE data ke localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('books', JSON.stringify(books));
};

// Fungsi untuk GET data dari localStorage
const loadFromLocalStorage = () => {
  const storedBooks = localStorage.getItem('books');
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderBooks();
  }
};


// Fungsi untuk CREATE elemen buku
const createBookElement = (book) => {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  const isCompleteButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
  isCompleteButton.addEventListener('click', () => {
    moveBookToOtherShelf(book.id);
  });

  const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');
  deleteButton.addEventListener('click', () => {
    deleteBook(book.id);
  });

   const editButton = bookItem.querySelector('[data-testid="bookItemEditButton"]');
  editButton.addEventListener('click', () => {
    editBook(book.id);
  });



  return bookItem;
};

// Fungsi untuk RENDER buku ke rak
const renderBooks = () => {
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    const filteredBooks = books.filter(book => {
        const searchTerm = searchBookTitle.value.toLowerCase();
        return book.title.toLowerCase().includes(searchTerm);
    });


    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
};

// Fungsi untuk ADD buku baru
const addBook = (title, author, year, isComplete) => {
  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete
  };
  books.push(newBook);
  saveToLocalStorage();
  renderBooks();
};

// Fungsi untuk MOVE buku antar rak
const moveBookToOtherShelf = (bookId) => {
  books = books.map(book => {
    if (book.id === bookId) {
      return { ...book, isComplete: !book.isComplete };
    }
    return book;
  });
  saveToLocalStorage();
  renderBooks();
};

// Fungsi untuk DELETE buku
const deleteBook = (bookId) => {
  books = books.filter(book => book.id !== bookId);
  saveToLocalStorage();
  renderBooks();
};

// Fungsi untuk EDIT buku
const editBook = (bookId) => {
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        const book = books[bookIndex];
        const newTitle = prompt('Edit judul buku:', book.title);
        const newAuthor = prompt('Edit penulis buku:', book.author);
        const newYear = parseInt(prompt('Edit tahun buku:', book.year));


        if (newTitle !== null && newAuthor !== null && !isNaN(newYear)) {
            books[bookIndex] = { ...book, title: newTitle, author: newAuthor, year: newYear };
            saveToLocalStorage();
            renderBooks();
        }
    }
};

// Form ADD buku
bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    addBook(title, author, year, isComplete);

    bookForm.reset();
});

// Fitur Search
searchBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    renderBooks();
});
searchBookTitle.addEventListener('input', renderBooks);

// Load data from localStorage saat halaman dimuat
loadFromLocalStorage();