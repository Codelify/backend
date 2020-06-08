require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    use_env_variable: 'DEV_DATABASE_URL',
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    use_env_variable: '',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    use_env_variable: 'DATABASE_URL',
  },
};
