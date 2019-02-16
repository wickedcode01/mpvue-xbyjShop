const mysql = require('think-model-mysql');

module.exports = {
  handle: mysql,
  database: 'xbyjshop',
  prefix: 'xbyjshop_',
  encoding: 'utf8',
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '134679852',
  dateStrings: true,
  pageSize: 20,
};
