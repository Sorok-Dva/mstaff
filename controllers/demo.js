const { check, validationResult } = require('express-validator/check');
const Demo = require('../models/index').Demo;

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {
    case 'createDemo': {
      return [check('email').isEmail(),
        check('phone').isMobilePhone(),
        check('type').exists(),
        check('nameEs').exists()
      ]
    }
    }
  },
  /**
   * Create Demo Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */
  create: (req, res) => {
    // Inscription concernant une demo ES
    if (req.body.type && req.body.esName) {

    }
  }
};