const { check } = require('express-validator/check');
const _ = require('lodash');
const HTTPValidation = {};


HTTPValidation.postAddExperience = [
  check('name').isLength({ min: 3 }),
  check('post_id').isNumeric(),
  check('service_id').isNumeric(),
  check('internship').isBoolean(),
  check('current').isBoolean()
];

HTTPValidation.postAddFormation = [
  check('name').isLength({ min: 3 }),
  check('start').exists(),
  check('end').exists()
];

HTTPValidation.postAddDiploma = [
  check('name').isLength({ min: 3 }),
  check('start').exists(),
  check('end').exists()
];

HTTPValidation.putFormation = [
  check('name').isLength({ min: 4 }),
  check('start').exists(),
  check('end').exists()
];

HTTPValidation.getWish = [
  check('id').isNumeric()
];

HTTPValidation.removeWish = [
  check('id').isNumeric()
];

HTTPValidation.removeWishApplication = [
  check('id').isNumeric(),
  check('applicationId').isNumeric(),
];

HTTPValidation.getEditWish = [
  check('id').isNumeric()
];

HTTPValidation.checkPassEdit = [
  check('oldPassword').isLength({ min: 8 }),
  check('newPassword').isLength({ min: 8 }),
  check('newPasswordVerification').isLength({ min: 8 }),
];

module.exports = HTTPValidation;