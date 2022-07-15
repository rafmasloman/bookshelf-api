const {
  addBook,
  getAllBook,
  getBookById,
  deleteBookById,
  updateBook,
} = require('./control');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBook,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookById,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookById,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBook,
  },
];

module.exports = routes;
