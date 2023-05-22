require('dotenv').config();

const database =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

module.exports = {
  DATABASE_URL: database,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.TOKENSECRET,
};
