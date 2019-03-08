const { validationResult } = require('express-validator/check');
const { Demo } = require('../models/index').Demo;

module.exports = {
  /**
   * Create Demo Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */
  create: (req, res) => {
    // Inscription concernant une demo ES
    /*if (req.body.type && req.body.esName) {

    }*/
  }
};