const { check } = require('express-validator');
const HTTPValidation = {};

HTTPValidation.findByCity = [
  check('city').exists().isLength({ min: 1 })
];

module.exports = HTTPValidation;