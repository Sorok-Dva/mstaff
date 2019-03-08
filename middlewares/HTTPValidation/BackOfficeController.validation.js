const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.sendCandidateVerifEmail = [
  check('email').isEmail().normalizeEmail(),
];

module.exports = HTTPValidation;