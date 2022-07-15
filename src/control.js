const uuid = require('uuid');
const books = require('./books');

const handlingResponse = (res, status, message, code, data) => {
  let response = res.response({
    status,
    message,
    data,
  });

  if (!data) {
    response = res.response({
      status,
      message,
    });
  }

  if (!message) {
    response = res.response({
      status,
      data,
    });
  }

  response.code(code);
  return response;
};

const addBook = (req, res) => {
  try {
    const id = uuid.v1();
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.payload;

    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updateAt = insertedAt;

    const newBooks = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updateAt,
    };

    if (!name) {
      return handlingResponse(
        res,
        'fail',
        'Gagal menambahkan buku. Mohon isi nama buku',
        400
      );
    }

    if (pageCount <= readPage) {
      return handlingResponse(
        res,
        'fail',
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        400
      );
    }

    books.push(newBooks);

    const checkId = (book) => {
      return book.id === id;
    };

    const bookId = books.filter(checkId);

    const data = {
      bookdId: bookId[0].id,
    };

    return handlingResponse(
      res,
      'success',
      'Buku berhasil ditambahkan',
      201,
      data
    );
  } catch (error) {
    return handlingResponse(res, 'error', 'Buku gagal ditambahkan', 500);
  }
};

const getAllBook = (req, res) => {
  try {
    const newBook = [];
    const {name} = req.query;
    
    

    books.map((book) => {
      const bookData = {};

      bookData.id = book.id;
      bookData.name = book.name;
      bookData.publisher = book.publisher;

      newBook.push(bookData);
    });

    const data = {
      books: newBook,
    };

    const getName = data.books.filter(book => {
      return book.name === name
    })

    if (books.length >= 1) {
      return handlingResponse(res, 'success', null, 200, data);
    }

    if (books.length < 1) {
      return handlingResponse(res, 'success', null, 200, data);
    }
  } catch (error) {
    return handlingResponse(res, 'error', error, 500);
  }
};

const getBookById = (req, res) => {
  try {
    const { id } = req.params;

    const checkId = books.filter((book) => {
      return book.id === id;
    });

    console.log(typeof checkId[0].id);
    console.log(id);
    console.log(checkId[0].id === id);

    const data = {
      books: checkId[0],
    };

    if (checkId[0].id === id) {
      return handlingResponse(res, 'success', null, 200, data);
    }
  } catch (error) {
    return handlingResponse(res, 'fail', 'Buku tidak ditemukan', 404);
  }
};


const updateBook = (req, res) => {
  try {
    const {id} = req.params

    const {name,year, author, summary, publisher, pageCount, readPage, reading} = req.payload
    const updateAt = new Date().toISOString()
  
    const checkId = books.findIndex((book) => {
      return book.id === id;
    });
  
    if(!name) {
      return handlingResponse(res, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', 400)
    }
  
    if (pageCount <= readPage) {
      return handlingResponse(
        res,
        'fail',
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        400
      );
    }
  
    books[checkId] = {
      ...books[checkId],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updateAt
    }
  
    return handlingResponse(res, 'success', 'Buku berhasil diperbarui', 200)
  } catch (error) {
    console.log(error)
  }

}

const deleteBookById = (req, res) => {
  const {id} = req.params

  

  const checkId = books.findIndex((book) => {
    return book.id === id;
  });

  if(checkId !== -1) {
    books.splice(checkId, 1);
    return handlingResponse(res, 'success', 'Catatan berhasil dihapus', 200)
  }

  return handlingResponse(res, 'fail', 'Catatan gagal dihapus. Id tidak ditemukan', 404)

};

module.exports = { addBook, getAllBook, getBookById, deleteBookById, updateBook };
