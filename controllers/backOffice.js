const { check, validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const _ = require('lodash');
const moment = require('moment');
const Models = require('../models/index');
const layout = 'admin';

const UserController = require('./user');
const discord = require('../bin/discord-bot');

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {

  },
  index: (req, res) => {
    let render = { layout, title: 'Tableau de bord', a: { main: 'dashboard', sub: 'overview' } };
    Models.User.count().then(count => {
      render.usersCount = count;
      return Models.Candidate.count();
    }).then(count => {
      render.candidatesCount = count;
      return Models.Wish.count();
    }).then(count => {
      render.wishesCount = count;
      return Models.Establishment.count();
    }).then(count => {
      render.esCount = count;
      return Models.Establishment.findAll({
        attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
        where: {
          createdAt: {
            [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
          }
        },
        group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
      });
    }).then(data => {
      render.esWeekRegistration = data;
      return Models.User.findAll({
        attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
        where: {
          createdAt: {
            [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
          }
        },
        group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
      });
    }).then(data => {
      render.usersWeekRegistration = data;
      return Models.Wish.findAll({
        attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
        where: {
          createdAt: {
            [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
          }
        },
        group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
      });
    }).then(data => {
      render.wishesWeek = data;
      render.usersWeekCount = 0; render.ESWeekCount = 0; render.wishesWeekCount = 0;
      render.esWeekRegistration.map((data) => render.ESWeekCount += parseInt(data.dataValues.count));
      render.usersWeekRegistration.map((data) => render.usersWeekCount += parseInt(data.dataValues.count));
      render.wishesWeek.map((data) => render.wishesWeekCount += parseInt(data.dataValues.count));
      res.render('back-office/index', render);
    });
  },
  stats: (req, res) => res.render('back-office/stats', { layout, title: 'Statistiques', a: { main: 'dashboard', sub: 'stats' } }),
  getUsers: (req, res) => {
    Models.User.findAll({
      attributes: {
        exclude: ['password']
      }
    }).then(users => {
      res.render('back-office/users/list', {
        layout,
        title: 'Liste des utilisateurs (tout type confondu)',
        a: { main: 'users', sub: 'users_all' },
        users })
    });
  },
  getCandidates: (req, res) => {
    Models.User.findAll({
      where: {
        type: 'candidate'
      },
      include: [{
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
  getESUsers: (req, res, next) => {
    Models.User.findAll({
      where: { type: 'es' },
      attributes: { exclude: ['password'] },
      include: [{
        model: Models.ESAccount,
        required: true,
        include: {
          model: Models.Establishment,
          required: true
        }
      }]
    }).then(users => {
      res.render('back-office/es/users/list', {
        layout,
        title: 'Liste des utilisateurs ES',
        a: { main: 'users', sub: 'es' },
        users })
    }).catch(error => next(new Error(error)));
  },
  getESList: (req, res, next) => {
    Models.Establishment.findAll().then(data => {
      res.render('back-office/es/list', {
        layout,
        title: 'Liste des Établissements Mstaff',
        a: { main: 'es', sub: 'es_all' },
        data
      })
    }).catch(error => next(new Error(error)));
  },
  getES: (req, res, next) => {
    Models.Establishment.findOne({ where: { id: req.params.id } }).then(data => {
      if (_.isNil(data)) {
        req.flash('error', 'Cet établissement n\'existe pas.');
        return res.redirect('/back-office/es');
      }
      Models.Candidate.findAll({
        include: [{
          model: Models.Application,
          as: 'applications',
          required: true,
          where: {
            finess: data.dataValues.finess
          },
        }]
      }).then(candidates => {
        res.render('back-office/es/show', {
          layout,
          candidates,
          title: `Établissement ${data.dataValues.name}`,
          a: { main: 'es', sub: 'es_one' },
          data
        })
      });
    }).catch(error => next(new Error(error)));
  },
  getUser: (req, res) => {
    Models.User.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Models.Candidate,
        as: 'candidate'
      }],
      attributes: {
        exclude: ['password']
      }
    }).then(user => {
      if (_.isNil(user)) {
        req.flash('error', 'Cet utilisateur n\'existe pas.');
        return res.redirect('/back-office/users');
      }
      res.render('back-office/users/show', {
        layout,
        title: `Profil de ${user.dataValues.firstName} ${user.dataValues.lastName}`,
        a: { main: 'users', sub: 'profile' },
        user
      })
    });
  },
  getFormations: (req, res) => {
    return Models.Formation.findAll().then( formation => {
      res.render('back-office/references/formations', {
        layout, formation, a: { main: 'references', sub: 'formations' } })
    }
    );
  },
  editFormation: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Formation.findOne({ where: { id: req.params.id } }).then(formation => {
      if (req.body.promptInput) {
        formation.name = req.body.promptInput;
      }
      formation.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  editCandidate: (req, res, next) => {
    const errors = validationResult(req.body);

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
  removeUserImpersonation: (req, res) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: { exclude: ['password'] }
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      discord(`**${user.dataValues.email}** vient de se déconnecter du compte de **${req.user.fullName}**.`, 'infos');
      delete req.session.originalUser;
      delete req.session.role;
      delete req.session.readOnly;
      req.logIn(user, (err) => new Error(err));
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
