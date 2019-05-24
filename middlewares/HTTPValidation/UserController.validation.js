const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.normalizeEmail = [
  check('email').isEmail().normalizeEmail()
];
HTTPValidation.create = [
  check('email').isEmail().normalizeEmail(),
  check('password')
    .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number'),
  check('country').exists(),
  check('firstName').exists().custom( (value) => {
    let regName = /^([a-zA-Z \-]){3,30}$/;
    if (!regName.test(value)){
      throw new Error('Le prénom doit contenir uniquement des caractères alphabétiques')
    }
  }),
  check('lastName').exists().custom( (value) => {
    let regName = /^([a-zA-Z \-]){3,30}$/;
    if (!regName.test(value)){
      throw new Error('Le nom doit contenir uniquement des caractères alphabétiques')
    }
  }),
  check('phone').exists().isLength({ min: 10, max: 14 }).withMessage('Invalid phone number')
];

HTTPValidation.resetPassword = [
  check('key').exists().isLength({ min: 10 }).withMessage('wrong user key'),
  check('password')
    .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number')
];

HTTPValidation.changePassword = [
  check('password')
    .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number')
];

HTTPValidation.ApiVerifyEmailAvailability = [
  check('email').isEmail().normalizeEmail()
];

module.exports = HTTPValidation;