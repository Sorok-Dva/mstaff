const Models = require('../models/index');

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
          req.flash('error', 'Code ES invalide.');
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
  getRegisterWizard: (req, res) => res.render('users/registerWizard'),
  get404: (req, res) => res.render('error', { error: 'Lien invalide' }),
  getRegisterDemo: (req, res) => res.render('demo/register')
};