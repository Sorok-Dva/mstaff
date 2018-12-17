const { check, validationResult } = require('express-validator/check');
const Establishment = require('../models/index').Establishment;
const bcrypt = require('bcryptjs');

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {
      case 'create': {
        return [
          check('email').isEmail(),
          check('firstName').exists(),
          check('lastName').exists()
        ]
      }
    }
  },
  /**
   * Create User Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */
  create: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/registerDemo', { body: req.body, errors: errors.array() });
    }

    User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      type: 'es' //@TODO edit User migration to add type column in user table
    }).then(user => res.render('users/login', { user }))
      .catch(error => res.render('users/register', { body: req.body, sequelizeError: error }));
  }
};
