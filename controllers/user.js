const bcrypt = require('bcryptjs');

const User = require('../models/index').User;
const UserController = {};

UserController.ensureIsNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Vous êtes déjà connecté.');
    res.redirect('/');
  }
};

UserController.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged');
    res.redirect('/');
  }
};

UserController.create = (req, res) => {
  let password = req.body.password;
  bcrypt.genSalt(10).then(salt => {
    bcrypt.hash(password, salt).then(hash => {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      }).then(user => res.render('login', { user }))
        .catch(error => res.render('users/register', { sequelizeError: error }));
    });
  });
};

UserController.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports = UserController;