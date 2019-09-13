const __ = process.cwd();
const _ = require('lodash');
const { Env } = require(`${__}/helpers/helpers`);
const { BackError } = require(`${__}/helpers/back.error`);
const Models = require(`${__}/orm/models/index`);
const sequelize = require(__ + '/bin/sequelize');

const Render = {};

Render.Index = (req, res, next) => {
  if (req.user && req.user.type === 'candidate') {
    return res.redirect('/profile')
  }
  if (req.user && req.user.type === 'es') {
    if (!_.isNil(req.user.opts) && 'currentEs' in req.user.opts) {
      return res.redirect('/candidates')
    } else {
      return res.redirect('/select/es');
    }
  }
  if (req.user && req.user.type === 'admin') {
    return res.redirect('/back-office')
  }
  // return res.redirect('https://welcome.mstaff.co
  return res.render('index', { layout: 'landing' })
};

Render.Login = (req, res) => res.render('users/login', { layout: 'onepage' });

Render.resetPassword = (req, res, next) => {
  Models.User.findOne({
    where: { key: req.params.key },
    attributes: ['id', 'password', 'key']
  }).then(user => {
    if (!user) {
      req.flash('error_msg', 'Utilisateur inconnu.');
      return res.redirect('/');
    }
    res.render('users/reset_password', { layout: 'onepage' })
  }).catch(err => next(new BackError(err)));
};

Render.Redirect = (req, res) => res.redirect('/');

Render.Logout = (req, res) => req.logout() + req.session.destroy() + res.redirect('/');

Render.Register = (req, res) => res.render('users/register', { layout: 'onepage' });

Render._404 = (req, res) => res.render('error', { error: 'Lien invalide' });

Render.ResetPassword = (req, res) => res.render('users/reset-passwd', { layout: 'onepage' });

if (Env.isDev) {
  Render.Test = (req, res) => {

    try {
      Models.Establishment.repository.getWhereBelongsToSuperGroup(2)
        .then(results => {
          console.log(results.length);
          res.status(200).send();
        });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  };
}

module.exports = Render;