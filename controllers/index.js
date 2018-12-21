const Establishment = require('../models/index').Establishment;

module.exports = {
  getIndex:     (req, res) => {
    // If the url call an es (ex: sante.mstaff.co) so we show es homepage else redirect to mstaff.co
    if (req.headers.host.split('.')[0] !== req.headers.host) {
      Establishment.findOne({
        where: {
          domain_enable: true,
          domain_name: req.headers.host.split('.')[0]
        }
      }).then(es => {
        if (!es) return res.redirect(`${req.headers.host.split('.')[1]}/404`);
        return res.render('establishments/homepage');
      });
    } else {
      let opts = {};
      if (!req.user) opts.layout = 'landing';
      return res.render('index', opts)
    }
  },
  getLogin:     (req, res) => res.render('users/login'),
  postLogin:    (req, res) => res.redirect('/'),
  getLogout:    (req, res) => req.logout() + res.redirect('/'),
  getRegister:  (req, res) => {
    if (req.params.esCode) {
      Establishment.findOne({
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
          res.render('users/register', { es });
        }
      });
    } else {
      res.render('users/register');
    }
  },
  getRegisterWizard:  (req, res) => console.log(res.locals) + res.render('users/registerWizard'),
  get404:       (req, res) => res.render('error', { error: 'Lien invalide' }),
  getRegisterDemo:(req, res) => res.render('demo/register')
};