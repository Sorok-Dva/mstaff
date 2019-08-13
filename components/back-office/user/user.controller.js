const __ = process.cwd();
const _ = require('lodash');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { BackError } = require(`${__}/helpers/back.error`);
let User = require(`${__}/components/user`);
const Models = require(`${__}/orm/models/index`);
const Mailer = require(`${__}/components/mailer`);

const layout = 'admin';

const BackOffice_Users = {};

BackOffice_Users.findOne = (req, res, next) => {
  let query = {
    where: {
      id: req.params.id
    },
    include: {
      model: Models.Candidate,
      as: 'candidate',
      include: [{
        model: Models.CandidateFormation,
        attributes: ['name'],
        as: 'formations',
      }, {
        model: Models.Experience,
        attributes: ['poste_id', 'service_id'],
        as: 'experiences',
        include: [{
          model: Models.Service,
          as: 'service'
        }, {
          model: Models.Post,
          as: 'poste'
        }]
      }]
    },
    attributes: {
      exclude: ['password']
    }
  };

  Models.User.findOne(query).then(user => {
    if (_.isNil(user)) {
      req.flash('error_msg', 'Cet utilisateur n\'existe pas.');
      return res.redirect('/back-office/users');
    }
    res.render('back-office/users/show', {
      layout,
      title: `Profil de ${user.dataValues.firstName} ${user.dataValues.lastName}`,
      a: { main: 'users', sub: 'profile' },
      user
    })
  });
};

BackOffice_Users.edit = (req, res, next) => {
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
};

BackOffice_Users.delete = (req, res, next) => {
  Models.User.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => {
    if (_.isNil(user)) {
      req.flash('error_msg', 'Cet utilisateur n\'existe pas.');
      return res.redirect('/back-office/users');
    }
    user.destroy().then((deletedUser, result) => {
      return res.status(201).send({ deleted: true, result });
    }).catch(error => next(new BackError(error)))
  });
};

BackOffice_Users.sendVerificationEmail = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  Models.User.findOne({
    where: { email: req.body.email },
    attributes: [ 'id', 'firstName', 'lastName', 'key', 'type', 'email' ]
  }).then(user => {
    if (_.isNil(user)) return res.status(400).send('Utilisateur introuvable.');
    Mailer.Main.sendUserVerificationEmail(user);
    return res.status(200).send('Send');
  });
};

BackOffice_Users.resetProfilePercentage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  Models.User.findOne({
    where: { id: req.body.id },
    attributes: [ 'id', 'type' ]
  }).then(user => {
    if (_.isNil(user)) return res.status(400).send('Utilisateur introuvable.');
    if (user.type !== 'candidate') return res.status(400).send('Cet utilisateur n\'est pas un candidat.');
    User.Candidate.updateWholePercentage(user, (percentage) => {
      return res.status(200).send({ status: 'ok', percentage });
    });
  });
};

BackOffice_Users.getAll = (req, res, next) => {
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
};

BackOffice_Users.getList = (req, res, next) => {
  let query = {
    where: { type: _getView(req.params.type).where },
    attributes: {
      exclude: ['password']
    },
    include: _getInclude(req.params.type)
  };

  Models.User.findAll(query).then(users => {
    res.render(`back-office/${_getView(req.params.type).render}/list`, {
      layout,
      title: `Liste ${_getView(req.params.type).title}`,
      a: { main: 'users', sub: _getView(req.params.type).term },
      users
    })
  });
};

let _getInclude = (type) => {
  let include;
  switch (type) {
    case 'candidates':
      include = {
        model: Models.Candidate,
        as: 'candidate',
        include: [{
          model: Models.CandidateFormation,
          attributes: ['name'],
          as: 'formations',
        }, {
          model: Models.Experience,
          attributes: ['poste_id', 'service_id'],
          as: 'experiences',
          include: [{
            model: Models.Service,
            as: 'service'
          }, {
            model: Models.Post,
            as: 'poste'
          }]
        }]
      };
      break;
    case 'es':
      include = {
        model: Models.ESAccount,
        include: {
          model: Models.Establishment,
        }
      };
      break;
    case 'demo':
      include = null;
      break;
    default: include = null;
  }
  return include;
};

let _getView = (type) => {
  let view;
  switch (type) {
    case 'candidates':
      view = {
        term: 'candidates',
        render: 'candidates',
        title: 'des candidats',
        where: 'candidate'
      };
      break;
    case 'es':
      view = {
        term: 'es',
        render: 'es/users',
        title: 'des comptes établissement',
        where: 'es'
      };
      break;
    case 'demo':
      view = null;
      break;
    default: view = null;
  }
  return view;
};

module.exports = BackOffice_Users;