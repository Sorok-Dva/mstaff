const { check, validationResult } = require('express-validator/check');
const Models = require('../models/index');
const layout = 'admin';

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {

    }
  },
  index:  (req, res) => res.render('back-office/index', { layout, title: 'Tableau de bord', a: { main: 'dashboard', sub: 'overview' } }),
  stats:  (req, res) => res.render('back-office/stats', { layout, title: 'Statistiques', a: { main: 'dashboard', sub: 'stats' } }),
  getUsers:(req, res) => {
    Models.User.findAll({
      attributes: {
        exclude: ['password']
      }
    }).then(users => {
      res.render('back-office/users/list', {
        layout,
        title: 'Liste des utilisateurs (tout type confondu)',
        a: { main: 'users', sub: 'all' },
        users })
    });
  },
  getCandidates:(req, res) => {
    Models.User.findAll({
      where: {
        type: 'candidate'
      },
      include:[{
        model: Models.Candidate,
        as: 'candidate'
      }],
      attributes: {
        exclude: ['password']
      }
    }).then(users => {
      res.render('back-office/candidates/list', {
        layout,
        title: 'Liste des candidats',
        a: { main: 'users', sub: 'candidates' },
        users })
    });
  },
  getUser:(req, res) => {
    Models.User.findOne({
      where: {
        id: req.params.id
      },
      include:[{
        model: Models.Candidate,
        as: 'candidate'
      }],
      attributes: {
        exclude: ['password']
      }
    }).then(user => {
      res.render('back-office/users/show', {
        layout,
        title: `Profil de ${user.dataValues.firstName} ${user.dataValues.lastName}`,
        a: { main: 'users', sub: 'profile' },
        user
      })
    });
  },
  impersonateUser:(req, res) => {
    Models.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password'] }
    }).then(user => {
      let originalUser = req.user.id;
      let originalRole = req.user.role;
      req.logIn(user, (err) => console.log(err));
      req.session.originalUser = originalUser;
      req.session.role = originalRole;
      res.redirect('/');
    });
  },
  removeUserImpersonation:(req, res) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: { exclude: ['password'] }
    }).then(user => {
      delete req.session.originalUser;
      delete req.session.role;
      req.logIn(user, (err) => console.log(err));
      res.redirect('/');
    });
  }
};
