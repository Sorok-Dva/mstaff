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
      return res.render('index', { layout: 'landing' })
    }
  },
  getLogin:     (req, res) => res.render('users/login'),
  postLogin:    (req, res) => res.redirect('/'),
  getLogout:    (req, res) => req.logout() + res.redirect('/'),
  getRegister:  (req, res) => res.render('users/register'),
  get404:       (req, res) => res.render('error', { error: 'Lien invalide' })
};