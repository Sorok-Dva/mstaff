const { validationResult } = require('express-validator/check');
const { User, Candidate, Establishment } = require('../models/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../bin/mailer');

module.exports = {
  /**
   * Create User Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */
  create: (req, res) => {
    const errors = validationResult(req);
    let { password } = req.body;
    let { esCode } = req.params;
    let esId = null;

    if (!errors.isEmpty()) {
      return res.render('users/register', { layout: 'onepage', body: req.body, errors: errors.array() });
    }

    if (esCode) {
      Establishment.findOne({
        attributes: ['id', 'code'],
        where: {
          code: esCode
        }
      }).then(es => {
        if (es) {
          esId = es.dataValues.id;
        }
      });
    }
    let usr;
    bcrypt.hash(password, 10).then(hash => {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        birthday: new Date(req.body.birthday),
        postal_code: req.body.postal_code,
        town: req.body.town,
        phone: req.body.phone,
        role: 'User',
        type: 'candidate',
        key: crypto.randomBytes(20).toString('hex')
      }).then(user => {
        usr = user;
        return Candidate.create({
          user_id: user.id,
          es_id: esId || null
        })
      }).then(candidate => {
        mailer.sendEmail({
          to: req.body.email,
          subject: 'Création de votre compte sur Mstaff.',
          template: 'candidate/emailValidation',
          context: { user: usr }
        });
        res.render(`users/registerWizard`, { layout: 'onepage', user: usr, candidate });
      }).catch(error => res.render('users/register', { layout: 'onepage', body: req.body, sequelizeError: error }));
    });
  },
  /**
   * ComparePassword Method
   * @param candidatePassword
   * @param hash
   * @param callback
   * @returns callback
   * @description Compare two passwords hash to authenticate user.
   */
  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      return callback(err, isMatch);
    });
  },
  /**
   * [API] Verify Email Availability Method
   * @param req
   * @param res
   * @returns boolean
   * @description Check if email is already used by a user. Used by registration form.
   */
  ApiVerifyEmailAvailability: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    User.findOne({
      where: { email: req.params.email },
      attributes: [ 'id' ]
    }).then(user => {
      return res.status(201).json({ available: !user });
    });
  }
};
