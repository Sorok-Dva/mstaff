const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require('../helpers/back.error');
const httpStatus = require('http-status');
const _ = require('lodash');
const Models = require('../models/index');
const layout = 'admin';

const UserController = require('./user');
const discord = require('../bin/discord-bot');
const mailer = require('../bin/mailer');

const BackOffice = require('../components/back-office');

module.exports = {
  BackOffice,
  getGroups: (req, res) => {
    return Models.Groups.findAll().then( group => {
      res.render('back-office/users/list_groups', {
        layout, group, a: { main: 'users', sub: 'Groups' } })
    });
  },
  editGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
      if (req.body.promptInput) {
        group.name = req.body.promptInput;
      }
      group.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Groups.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((group, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', group });
      } else {
        return res.status(200).json({ status: 'Already exists', group });
      }
    })
  },
  removeGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
      if (!group) return res.status(400).send({ body: req.body, error: 'This group does not exist' });
      return group.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getSuperGroups: (req, res) => {
    return Models.SuperGroups.findAll().then( superGroup => {
      res.render('back-office/users/list_supergroups', {
        layout, superGroup, a: { main: 'users', sub: 'superGroups' } })
    });
  },
  editSuperGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
      if (req.body.promptInput) {
        superGroup.name = req.body.promptInput;
      }
      superGroup.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addSuperGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.SuperGroups.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((superGroup, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', superGroup });
      } else {
        return res.status(200).json({ status: 'Already exists', superGroup });
      }
    })
  },
  removeSuperGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
      if (!superGroup) return res.status(400).send({ body: req.body, error: 'This group does not exist' });
      return superGroup.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editCandidate: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.User.findOne({ where: { id: req.params.id } }).then(user => {
      if (req.body.candidateId) {
        Models.Candidate.findOne({ where: { user_id: req.params.id } }).then(candidate => {
          candidate.description = req.body.description;
          candidate.save();
        });
      }
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.birthday = req.body.birthday;
      user.postal_code = req.body.postal_code;
      user.town = req.body.town;
      user.role = req.body.role;
      user.type = req.body.type;
      // user.phone = req.body.phone;
      user.save().then(() => {
        req.flash('success_msg', 'Informations sauvegardées.');
        return res.redirect('/back-office/users');
      });
    }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
  },
  sendCandidateVerifEmail: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    Models.User.findOne({
      where: { email: req.body.email },
      attributes: [ 'id', 'firstName', 'lastName', 'key' ]
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      mailer.sendEmail({
        to: req.body.email,
        subject: 'Création de votre compte sur Mstaff.',
        template: 'user/emailValidation',
        context: { user }
      });
      return res.status(200).send('Send')
    });
  },
  impersonateUser: (req, res) => {
    Models.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password'] }
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      discord(`**${req.user.fullName}** vient de se connecter en tant que **${user.dataValues.email}** sur Mstaff.`, 'infos');
      let originalUser = req.user.id;
      let originalRole = req.user.role;
      req.logIn(user, (err) => new Error(err));
      req.session.originalUser = originalUser;
      req.session.role = originalRole;
      req.session.readOnly = true;
      res.redirect('/');
    });
  },
  removeUserImpersonation: (req, res, next) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: { exclude: ['password'] }
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      delete req.session.originalUser;
      delete req.session.role;
      delete req.session.readOnly;
      discord(`**${user.dataValues.email}** vient de se déconnecter du compte de **${req.user.fullName}**.`, 'infos');
      req.logIn(user, (err) => next(new BackError(err)));
      res.redirect('/');
    });
  },
  impersonateRemoveReadOnly: (req, res) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: ['password']
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      UserController.comparePassword(req.body.password, user.dataValues.password, (err, isMatch) => {
        if (err) return res.status(200).json({ error: err });
        if (isMatch) {
          let pinCode = Math.floor(Math.random() * 90000) + 10000;
          req.session.pinCode = pinCode;
          discord(`***Admin Mstaff** vient de demander une suppression de la lecture seule sur le compte de ${req.user.fullName}.
           Code PIN : **${pinCode}***`, 'infos');
          return res.status(200).json({ status: 'send' });
        } else {
          return res.status(200).json({ error: 'invalid password' });
        }
      });
    });
  },
  impersonatePutReadOnly: (req, res) => {
    req.session.readOnly = true;
    discord(`*Lecture seule ré-activée sur le compte de ${req.user.fullName}.*`, 'infos');
    return res.status(200).json({ status: 'ok' });
  },
  impersonateRemoveReadOnlyValidation: (req, res) => {
    let authorized = false;
    if (req.session.pinCode === parseInt(req.body.pinCode)) {
      discord(`*Lecture seule désactivée sur le compte de ${req.user.fullName}.*`, 'infos');
      req.session.readOnly = false;
      delete req.session.pinCode;
      authorized = true;
    } else {
      discord(`*Désactivation de la lecture seule échouée : mauvais code pin.*`, 'infos');
    }
    return res.status(200).json({ authorized });
  }
};