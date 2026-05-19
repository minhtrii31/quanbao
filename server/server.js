require('dotenv').config();
const http = require('http');
const { validateEnv } = require('./config/env');

validateEnv();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
