const __ = process.cwd();
const _ = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const Models = require(`${__}/orm/models/index`);

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

Render.Register = (req, res) => {
  if (req.params.esCode) {
    Models.Establishment.findOne({
      attributes: ['id', 'name', 'code'],
      where: {
        code: req.params.esCode
      }
    }).then(es => {
      if (!es) {
        req.flash('error_msg', 'Code ES invalide.');
        return res.redirect('/register');
      } else {
        es = es.dataValues;
        res.render('users/register', { layout: 'onepage', es });
      }
    });
  } else {
    res.render('users/register', { layout: 'onepage' });
  }
};

Render._404 = (req, res) => res.render('error', { error: 'Lien invalide' });

Render.RegisterDemo = (req, res) => res.render('demo/register');

Render.ResetPassword = (req, res) => res.render('users/reset-passwd', { layout: 'onepage' });

module.exports = Render;