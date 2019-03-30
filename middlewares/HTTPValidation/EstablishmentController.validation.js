const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.create = [
  check('email').isEmail(),
  check('firstName').exists(),
  check('lastName').exists()
];

module.exports = HTTPValidation;