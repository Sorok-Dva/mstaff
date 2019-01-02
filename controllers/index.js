const Models = require('../models/index');

module.exports = {
  test: (req, res, next) => {
    console.log(req.params);
    Models.Establishment.findOne({
      where: {
        domain_enable: true,
        domain_name: req.params.sub
      }
    }).then(es => {
      if (!es) return res.redirect(`${req.headers.host.split('.')[1]}/404`);
      return res.render('establishments/homepage');
    });
  },
  getIndex:     (req, res, next) => {
    if (!req.subdomain) {
      if (req.user && (req.user.type === 'candidate' || 'admin')) {
        return res.redirect('/profile')
      }
      return res.render('index', { layout: 'landing' })
    } else {
      // render subdomain specific data
      res.render('index', { layout: 'onepage' });
    }
  },
  getLogin:     (req, res) => res.render('users/login', { layout: 'onepage' }),
  postLogin:    (req, res) => res.redirect('/'),
  getLogout:    (req, res) => req.logout() + res.redirect('/'),
  getRegister:  (req, res) => {
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
  getRegisterWizard:  (req, res) => res.render('users/registerWizard'),
  get404: (req, res) => res.render('error', { error: 'Lien invalide' }),
  getRegisterDemo:(req, res) => res.render('demo/register')
};