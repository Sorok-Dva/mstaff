const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.login = [
  check('email').isEmail().normalizeEmail(),
];

module.exports = HTTPValidation;