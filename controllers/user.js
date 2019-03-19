const { validationResult } = require('express-validator/check');
const { User, Candidate, Establishment } = require('../models/index');
const { BackError } = require('../helpers/back.error');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../bin/mailer');

module.exports = {
  /**
   * Create User Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */

};
