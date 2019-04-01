const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.postAddExperience = [
  check('name').isLength({ min: 3 }),
  check('post_id').isNumeric(),
  check('service_id').isNumeric(),
  check('internship').isBoolean(),
  check('current').isBoolean()
];

HTTPValidation.postAddFormation = [
  check('name').isLength({ min: 3 })
];

HTTPValidation.postAddDiploma = [
  check('name').isLength({ min: 3 })
];

HTTPValidation.putFormation = [
  check('name').isLength({ min: 4 })
];

HTTPValidation.getWish = [
  check('id').isNumeric()
];

HTTPValidation.removeWish = [
  check('id').isNumeric()
];

HTTPValidation.getEditWish = [
  check('id').isNumeric()
];

module.exports = HTTPValidation;