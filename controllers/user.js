const { check, validationResult } = require('express-validator/check');
const User = require('../models/index').User;
const bcrypt = require('bcryptjs');

module.exports = {
  /**
   * ensureIsNotAuthenticated MiddleWare
   * @param req
   * @param res
   * @param next
   * @returns {*}
   * @description Ensure that the current user is logged-out
   */
  ensureIsNotAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'Vous êtes déjà connecté.');
      res.redirect('/');
    }
  },
  /**
   * ensureAuthenticated MiddleWare
   * @param req
   * @param res
   * @param next
   * @returns {*}
   * @description Ensure that the current user is logged-in
   */
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'You are not logged');
      res.redirect('/');
    }
  },
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {
    case 'create': {
      return [
        check('email').isEmail(),
        check('password')
          .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
          .matches(/\d/).withMessage('must contain a number'),
        check('firstName').exists(),
        check('lastName').exists()
      ]
    }
    }
  },
  /**
   * Create User Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */
  create: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/register', { body: req.body, errors: errors.array() });
    }

    let password = req.body.password;
    let code_es = req.params.code_es;
    bcrypt.genSalt(10).then(salt => {
      bcrypt.hash(password, salt).then(hash => {
        User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          birthday: new Date(req.body.birthday),
          postal_code: req.body.postal_code,
          town: req.body.town,
          phone: req.body.phone
        }).then(user => res.render('login', { user }))
          .catch(error => res.render('users/register', { body: req.body, sequelizeError: error }));
      });
    });
  },
  /**
   * ComparePassword Method
   * @param candidatePassword
   * @param hash
   * @param callback
   * @returns callback
   * @description Compare two passwords hash to authenticate user.
   */
  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err;
      return callback(null, isMatch);
    });
  }
};
