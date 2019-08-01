const { check } = require('express-validator');
const HTTPValidation = {};

HTTPValidation.createDemo = [
  check('email').isEmail(),
  check('phone').isMobilePhone(),
  check('type').exists(),
  check('nameEs').exists()
];

module.exports = HTTPValidation;