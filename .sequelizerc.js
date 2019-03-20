const path = require('path');

module.exports = {
  "config": path.resolve('./orm/config', 'config.json'),
  "models-path": path.resolve('./orm/models'),
  "seeders-path": path.resolve('./orm/seeders'),
  "migrations-path": path.resolve('./orm/migrations')
};