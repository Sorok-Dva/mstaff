const { check } = require('express-validator');
const HTTPValidation = {};

HTTPValidation.login = [
  check('username').isEmail().normalizeEmail(),
];

module.exports = HTTPValidation;