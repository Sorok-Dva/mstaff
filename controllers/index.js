const Models = require('../models/index');

module.exports = {
  getIndex:     (req, res, next) => {
    // If the url call an es (ex: sante.mstaff.co) so we show es homepage else redirect to mstaff.co
    if (req.headers.host.split('.')[0] !== req.headers.host) {
      Models.Establishment.findOne({
        where: {
          domain_enable: true,
          domain_name: req.headers.host.split('.')[0]
        }
      }).then(es => {
        if (!es) return res.redirect(`${req.headers.host.split('.')[1]}/404`);
        return res.render('establishments/homepage');
      });
    } else {
      if (req.user) {
        return res.redirect('/profile')
      }
      return res.render('index', { layout: 'landing' })
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
  getRegisterDemo:(req, res) => res.render('demo/register'),
  getProfile: (req, res, next) => {
    if (req.user.type === 'candidate') {
      Models.User.findOne({
        where: { id: req.user.id },
        include:[{
          model: Models.Candidate,
          as: 'candidate',
          include: {
            model: Models.Experience,
            as: 'experiences',
            include: [{
              model: Models.Service,
              as: 'service'
            }, {
              model: Models.Post,
              as: 'poste'
            }]
          }
        }]
      }).then(user => {
        return res.render('users/profile', { user, a: { main: 'profile' } })
      }).catch(error => next(error));
    }
  },
  getEditProfile: (req, res, next) => {
    if (req.user.type === 'candidate') {
      Models.User.findOne({
        where: { id: req.user.id },
        include:[{
          model: Models.Candidate,
          as: 'candidate'
        }]
      }).then(user => {
        return res.render('users/edit', { user, a: { main: 'profile' } })
      }).catch(error => next(error));
    }
  }
};