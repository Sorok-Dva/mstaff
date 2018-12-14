const { check, validationResult } = require('express-validator/check');
const User = require('../models/index').User;
const bcrypt = require('bcryptjs');

module.exports = {
  // Middlewares
  ensureIsNotAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'Vous êtes déjà connecté.');
      res.redirect('/');
    }
  },
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'You are not logged');
      res.redirect('/');
    }
  },
  validate: (method) => {
    switch (method) {
    case 'create': {
      return [
        check('email').isEmail(),
        check('password')
          .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
          .matches(/\d/).withMessage('must contain a number'),
        check('firstName').exists()
      ]
    }
    }
  },
  // End Middlewares
  create: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/register', { body: req.body, errors: errors.array() });
    }

    let password = req.body.password;
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
  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err;
      callback(null, isMatch);
    });
  }
};
