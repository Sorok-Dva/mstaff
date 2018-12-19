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
  index:  (req, res) => res.render('back-office/index', { layout, title: 'Tableau de bord' }),
  stats:  (req, res) => res.render('back-office/stats', { layout, title: 'Statistiques' })
};
