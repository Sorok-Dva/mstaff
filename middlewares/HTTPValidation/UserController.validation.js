const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.create = [
  check('email').isEmail().normalizeEmail(),
  check('password')
    .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number'),
  check('firstName').exists(),
  check('lastName').exists()
];

HTTPValidation.resetPassword = [
  check('key').exists().isLength({ min: 10 }).withMessage('wrong user key'),
  check('password')
    .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number')
];

HTTPValidation.ApiVerifyEmailAvailability = [
  check('email').isEmail().normalizeEmail()
];

module.exports = HTTPValidation;