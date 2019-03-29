const container = require('orm/');
const database = container.resolve('database');

module.exports = () => database && database.truncate({ cascade: true });