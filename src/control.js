/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
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
    const updatedAt = insertedAt;

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
      updatedAt,
    };

    if (!name) {
      return handlingResponse(
        res,
        'fail',
        'Gagal menambahkan buku. Mohon isi nama buku',
        400,
      );
    }

    if (pageCount < readPage) {
      return handlingResponse(
        res,
        'fail',
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        400,
      );
    }

    books.push(newBooks);

    const checkId = (book) => book.id === id;

    const bookId = books.filter(checkId);

    const data = {
      bookId: bookId[0].id,
    };

    return handlingResponse(
      res,
      'success',
      'Buku berhasil ditambahkan',
      201,
      data,
    );
  } catch (error) {
    return handlingResponse(res, 'error', 'Buku gagal ditambahkan', 500);
  }
};

const getAllBook = (req, res) => {
  try {
    const { name, reading, finished } = req.query;

    let data = {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    };

    if (books.length >= 1) {
      if (name) {
        const getBookByName = books.filter((book) =>
          book.name.toLowerCase().includes(name.toLowerCase()),
        );

        data = {
          books: getBookByName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        };

        return handlingResponse(res, 'success', null, 200, data);
      }

      if (reading) {
        const getBookByReading = books.filter(
          (book) => Number(reading) === Number(book.reading),
        );

        data = {
          books: getBookByReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        };
      }

      if (finished) {
        const getBookByFinished = books.filter(
          (book) => Number(finished) === Number(book.finished),
        );

        data = {
          books: getBookByFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        };
      }

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

    const checkId = books.filter((book) => book.id === id);

    console.log(typeof checkId[0].id);
    console.log(id);
    console.log(checkId[0].id === id);

    const data = {
      book: checkId[0],
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
    const { id } = req.params;

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
    const updatedAt = new Date().toISOString();

    const checkId = books.findIndex((book) => book.id === id);

    if (!name) {
      return handlingResponse(
        res,
        'fail',
        'Gagal memperbarui buku. Mohon isi nama buku',
        400,
      );
    }

    if (pageCount <= readPage) {
      return handlingResponse(
        res,
        'fail',
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        400,
      );
    }

    console.log(checkId);
    if (checkId !== -1) {
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
        updatedAt,
      };
      return handlingResponse(res, 'success', 'Buku berhasil diperbarui', 200);
    }
    return handlingResponse(res, 'failed', 'Buku gagal diperbarui', 404);
  } catch (error) {
    console.log(error);
  }
};

const deleteBookById = (req, res) => {
  const { id } = req.params;

  const checkId = books.findIndex((book) => book.id === id);

  if (checkId !== -1) {
    books.splice(checkId, 1);
    return handlingResponse(res, 'success', 'Buku berhasil dihapus', 200);
  }

  return handlingResponse(
    res,
    'fail',
    'Buku gagal dihapus. Id tidak ditemukan',
    404,
  );
};

module.exports = {
  addBook,
  getAllBook,
  getBookById,
  deleteBookById,
  updateBook,
};
