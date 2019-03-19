const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { BackError } = require(`${__}/helpers/back.error`);
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Mailer = require(`${__}/components/mailer`);
const Models = require(`${__}/models/index`);

const User = {};

User.create =(req, res, next) => {
  const errors = validationResult(req);
  let { password } = req.body;
  let { esCode } = req.params;
  let esId = null;

  if (!errors.isEmpty()) {
    return res.render('users/register', { layout: 'onepage', body: req.body, errors: errors.array() });
  }

  if (esCode) {
    Models.Establishment.findOne({
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
      return Models.Candidate.create({
        user_id: user.id,
        es_id: esId || null
      })
    }).then(candidate => {
      Mailer.sendUserVerificationEmail(usr);
      res.redirect('login');
    }).catch(error => res.render('users/register', { layout: 'onepage', body: req.body, sequelizeError: error }));
  });
};

User.ValidateAccount = (req, res) => {
  if (req.params.key) {
    Models.User.findOne({
      where: { key: req.params.key },
      attributes: ['key', 'id', 'firstName', 'email', 'validated']
    }).then(user => {
      if (_.isNil(user)) {
        req.flash('error_msg', 'Clé de validation invalide.');
        return res.render('/', { layout: 'landing' });
      }
      user.validated = true;
      user.save().then(result => {
        req.flash('success_msg', 'Compte validé avec succès. Vous pouvez désormais vous connecter.');
        mailer.sendEmail({
          to: user.email,
          subject: 'Votre inscription est confirmée.',
          template: 'candidate/emailValidated',
          context: { user: user }
        });
        res.redirect('/login');
      })
    });
  } else {
    req.flash('error_msg', 'Clé de validation invalide.');
    return res.redirect('/');
  }
};

User.resetPassword = (req, res, next) => {
  const errors = validationResult(req);
  let { password } = req.body;
  let { key } = req.params;

  if (!errors.isEmpty()) {
    return res.render('users/reset_password', { layout: 'onepage', body: req.body, errors: errors.array() });
  }

  User.findOne({
    where: { key },
    attributes: ['id', 'password', 'key']
  }).then(user => {
    if (!user) {
      req.flash('error_msg', 'Utilisateur inconnu.');
      return res.redirect('/');
    }
    bcrypt.hash(password, 10).then(hash => {
      user.password = hash;
      user.key = crypto.randomBytes(20).toString('hex');
      user.save();
      return res.redirect('/login');
    });
  }).catch(err => next(new BackError(err)));
};

/**
 * ComparePassword Method
 * @param candidatePassword
 * @param hash
 * @param callback
 * @returns callback
 * @description Compare two passwords hash to authenticate user.
 */
User.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    return callback(err, isMatch);
  });
};

/**
 * [API] Verify Email Availability Method
 * @param req
 * @param res
 * @returns boolean
 * @description Check if email is already used by a user. Used by registration form.
 */
User.verifyEmailAvailability = (req, res) => {
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
};

module.exports = User;