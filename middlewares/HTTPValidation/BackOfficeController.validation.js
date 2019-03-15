const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.sendCandidateVerifEmail = [
  check('email').isEmail().normalizeEmail(),
];

HTTPValidation.addUserInEstablishment = [
  check('email').isEmail().normalizeEmail(),
];

HTTPValidation.createEstablishmentFromReference = [
  check('name').exists().isLength({ min: 5 }),
  check('finess_et').isNumeric().isLength({ min: 7, max: 9 }),
  check('finess_ej').isNumeric().isLength({ min: 7, max: 9 }),
  check('siret').isLength({ min: 14, max: 18 }),
  check('salaries_count').isNumeric(),
  check('domain_enable').isLength({ min: 1, max: 1 })
];

module.exports = HTTPValidation;