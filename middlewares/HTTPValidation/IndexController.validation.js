const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.login = [
  check('username').isEmail().normalizeEmail(),
];

module.exports = HTTPValidation;