const { check, validationResult } = require('express-validator/check');
const User = require('../models/index').User;
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
    User.findAll({
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
  }
};
