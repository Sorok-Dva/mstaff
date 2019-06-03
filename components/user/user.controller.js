const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { BackError } = require(`${__}/helpers/back.error`);
const Candidate = require(`./candidate/candidate.controller`);
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const httpStatus = require('http-status');
const Mailer = require(`${__}/components/mailer`);
const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const User = {};

User.create = (req, res, next) => {
  const errors = validationResult(req);
  let { password } = req.body;
  let esId = null;

  if (!errors.isEmpty()) {
    if (req.xhr) {
      return res.status(httpStatus.BAD_REQUEST).send({ body: req.body, errors: errors.array() });
    } else {
      return res.render('users/register', { layout: 'onepage', body: req.body, errors: errors.array() });
    }
  }
  let usr;
  bcrypt.hash(password, 10).then(hash => {
    Models.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      birthday: new Date(req.body.birthday),
      postal_code: req.body.postal_code,
      town: req.body.town,
      phone: req.body.phone,
      country: req.body.country,
      role: 'User',
      type: 'candidate',
      key: crypto.randomBytes(20).toString('hex')
    }).then(user => {
      usr = user;
      return Models.Candidate.create({
        user_id: user.id,
        percentage: {
          profile: {
            main: user.firstName && user.lastName && user.phone && user.town ? 20 : 0,
            description: 0,
            photo: 0,
          },
          experiences: 0,
          formations: 0,
          documents: { DIP: 0, RIB: 0, CNI: 0, VIT: 0 },
          total: user.firstName && user.lastName && user.phone && user.town ? 20 : 0
        },
        es_id: esId || null
      })
    }).then( () => {
      if (req.xhr) {
        req.session.atsUserId = usr.id;
        return res.status(httpStatus.CREATED).send({ result: 'created' });
      } else {
        Mailer.Main.sendUserVerificationEmail(usr);
        return res.redirect('login');
      }
    }).catch(error => {
      if (req.xhr){
        return res.status(httpStatus.BAD_REQUEST).send({ error: 'Une erreur est survenue lors de la creation de votre compte' });
      } else {
        res.render('users/register', { layout: 'onepage', body: req.body, sequelizeError: error });
      }
    });
  });
};

User.ValidateAccount = (req, res, next) => {
  if (req.params.key) {
    Models.User.findOne({
      where: { key: req.params.key, validated: false }
    }).then(user => {
      if (_.isNil(user)) {
        return next(new BackError('Clé de validation invalide ou compte déjà validé.', 403));
      }
      user.key = crypto.randomBytes(20).toString('hex');
      user.validated = true;
      user.save().then(result => {
        req.flash('success_msg', 'Compte validé avec succès. Vous pouvez désormais vous connecter.');
        mailer.sendEmail({
          to: user.email,
          subject: 'Votre inscription est confirmée.',
          template: 'candidate/emailValidated',
          context: { user: user }
        });
        Candidate.updatePercentage(user, 'identity');
        req.logIn(user, (err) => !_.isNil(err) ? next(new BackError(err)) : null);
        res.render('users/account-validated', { layout: 'onepage' });
      })
    });
  } else {
    req.flash('error_msg', 'Clé de validation invalide.');
    return res.redirect('/');
  }
};

User.sendResetPassword = (req, res, next) => {
  Models.User.findOne({
    where: { email: req.body.email },
    attributes: ['id', 'firstName', 'lastName', 'email', 'key']
  }).then(user => {
    if (!_.isNil(user)) {
      if (_.isNil(user.key)) {
        user.key = crypto.randomBytes(20).toString('hex');
        user.save();
      }
      Mailer.Main.sendUserResetPasswordLink(user);
    }
    return res.render('users/resetPasswordLink-send', { layout: 'onepage' })
  })
};

User.resetPassword = (req, res, next) => {
  const errors = validationResult(req);
  let { password } = req.body;
  let { key } = req.params;

  if (!errors.isEmpty()) {
    return res.render('users/reset_password', { layout: 'onepage', body: req.body, errors: errors.array() });
  }

  Models.User.findOne({
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

User.changePassword = (req, res, next) => {
  let oldpass = req.body.oldPassword;
  let newpass = req.body.newPassword;
  let newpasscheck = req.body.newPasswordVerification;

  Models.User.findOne({ where: { id: req.user.id } }).then( user => {
    User.comparePassword(oldpass, user.password, function (err, match) {
      if (match) {
        if (newpass === newpasscheck) {
          if (oldpass === newpass) {
            return res.status(200).json({ status: 'new password cannot be your old password' })
          }
          bcrypt.hash(newpass, 10).then(hash => {
            user.password = hash;
            user.save();
          });
          return res.status(200).json({ status: 'ok' });
        }
        else {
          res.status(200).json({ status: 'password verification is incorrect' });
        }
      }
      else {
        res.status(200).json({ status: 'invalid password' });
      }
    });
  })
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
  Models.User.findOne({
    where: { email: req.params.email },
    attributes: [ 'id' ]
  }).then(user => {
    return res.status(201).json({ available: !user });
  });
};

module.exports = User;