const Models = require('../models');

const UserController = {};

UserController.ensureIsNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Vous êtes déjà connecté.');
    res.redirect('/');
  }
};

module.exports = UserController;