const { check } = require('express-validator');
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
  check('salaries_count').isNumeric()
];

HTTPValidation.editLinkES = [
  check('id').isNumeric()
];

module.exports = HTTPValidation;