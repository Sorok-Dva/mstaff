const { check } = require('express-validator/check');
const HTTPValidation = {};

HTTPValidation.create = [
  check('email').isEmail(),
  check('firstName').exists(),
  check('lastName').exists()
];

/*HTTPValidation.createATS = [
  check('esList').exists().custom((value, {req}) => {
    let esList = req.query.esList.split(' ');
    esList.forEach(val => {
      if (isNaN(val))
        throw new Error('Wrong Value in esList');
    });
    return true;
  })
];*/

module.exports = HTTPValidation;