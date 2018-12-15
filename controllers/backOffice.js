const { check, validationResult } = require('express-validator/check');
const User = require('../models/index').User;

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {

    }
  },
  index:  (req, res) => res.render('back-office/index')
};
