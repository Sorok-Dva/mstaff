const { check, validationResult } = require('express-validator/check');
const User = require('../models/index').User;
const Candidate = require('../models/index').Candidate;
const Establishment = require('../models/index').Establishment;
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
   * ensureIsAdmin MiddleWare
   * @param req
   * @param res
   * @param next
   * @returns {*}
   * @description Ensure that the current user is an admin
   */
  ensureIsAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (['Admin'].includes(req.user.role) || ['Admin'].includes(req.session.role)) {
        next();
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  },
  /**
   * ensureIsCandidate MiddleWare
   * @param req
   * @param res
   * @param next
   * @returns {*}
   * @description Ensure that the current user is a candidate
   */
  ensureIsCandidate: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (['candidate'].includes(req.user.type)) {
        next();
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  },
  /**
   * ensureIsEs MiddleWare
   * @param req
   * @param res
   * @param next
   * @returns {*}
   * @description Ensure that the current user is an es
   */
  ensureIsEs: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (['es'].includes(req.user.type)) {
        next();
      } else {
        res.redirect('/');
      }
    } else {
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
    case 'ApiVerifyEmailAvailability': {
      return [
        check('email').isEmail()
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
    let password = req.body.password;
    let esCode = req.params.esCode;
    let esId = null;

    if (!errors.isEmpty()) {
      return res.render('users/register', { layout: 'onepage', body: req.body, errors: errors.array() });
    }

    if (esCode) {
      Establishment.findOne({
        attributes: ['id', 'code'],
        where: {
          code: esCode
        }
      }).then(es => {
        if (es) {
          esId = es.dataValues.id;
        }
      });
    }
    let usr;
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
          phone: req.body.phone,
          role: 'User',
          type: 'candidate'
        }).then(user => {
          usr = user;
          return Candidate.create({
            user_id: user.id,
            es_id: (esId) || null
          });
        }).then(candidate => {
          res.render(`users/registerWizard`, { layout: 'onepage', user: usr, candidate });
        }).catch(error => res.render('users/register', { layout: 'onepage', body: req.body, sequelizeError: error }));
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
      return callback(err, isMatch);
    });
  },
  /**
   * [API] Verify Email Availability Method
   * @param req
   * @param res
   * @returns boolean
   * @description Check if email is already used by a user. Used by registration form.
   */
  ApiVerifyEmailAvailability: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    User.findOne({
      where: { email: req.params.email },
      attributes: [ 'id' ]
    }).then(user => {
      return res.status(201).json({ available: !user });
    });
  }
};
