const _ = require('lodash');
const Models = require('../models/index');
const mailer = require('../bin/mailer');

module.exports = {
  getIndex: (req, res, next) => {
    if (!req.subdomain) {
      if (req.user && req.user.type === 'candidate') {
        return res.redirect('/profile')
      }
      if (req.user && req.user.type === 'es') {
        if (req.session.currentEs) {
          return res.redirect('/needs')
        } else {
          return res.redirect('/select/es');
        }
      }
      if (req.user && req.user.type === 'admin') {
        return res.redirect('/back-office')
      }
      return res.render('index', { layout: 'landing' })
    } else {
      // console.log(req.subdomain);
      Models.Establishment.findOne({
        where: {
          domain_enable: true,
          domain_name: req.subdomain
        }
      }).then(es => {
        if (!es) return res.redirect(`/404`);
        return res.render('establishments/homepage');
      });
    }
  },
  getLogin: (req, res) => res.render('users/login', { layout: 'onepage' }),
  postLogin: (req, res) => res.redirect('/'),
  getLogout: (req, res) => req.logout() + req.session.destroy() + res.redirect('/'),
  getRegister: (req, res) => {
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
  },
  getValidateAccount: (req, res) => {
    if (req.params.key) {
      Models.User.findOne({
        where: { key: req.params.key },
        attributes: ['key', 'id', 'firstName', 'email', 'validated']
      }).then(user => {
        if (_.isNil(user)) {
          req.flash('error_msg', 'Clé de validation invalide.');
          return res.render('/', { layout: 'landing' });
        }
        user.validated = true;
        user.save().then(result => {
          req.flash('success_msg', 'Compte validé avec succès. Vous pouvez désormais vous connecter.');
          mailer.sendEmail({
            to: user.email,
            subject: 'Votre inscription est confirmée.',
            template: 'candidate/emailValidated',
            context: { user: user }
          });
          res.redirect('/login');
        })
      });
    } else {
      req.flash('error_msg', 'Clé de validation invalide.');
      res.redirect('/');
    }
  },
  getRegisterWizard: (req, res) => res.render('users/registerWizard'),
  get404: (req, res) => res.render('error', { error: 'Lien invalide' }),
  getRegisterDemo: (req, res) => res.render('demo/register')
};