/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const app = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route(routes);
  await server.start();
  console.log(`Server run on port ${server.info.uri}`);
};

app();
