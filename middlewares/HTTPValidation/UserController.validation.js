const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.create = [
  check('email').isEmail().normalizeEmail(),
  check('password')
    .isLength({ min: 3 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number'),
  check('firstName').exists(),
  check('lastName').exists()
];

HTTPValidation.ApiVerifyEmailAvailability = [
  check('email').isEmail().normalizeEmail()
];

module.exports = HTTPValidation;