const __ = process.cwd();
const _ = require('lodash');
const { Sequelize, Op } = require('sequelize');
const Models = require(`${__}/models/index`);
const layout = 'admin';

const BackOffice_Users = {};

BackOffice_Users.findOne = (req, res, next) => {
  let query = {
    where: {
      id: req.params.id
    },
    include: _getInclude(),
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
    res.render(`back-office/${_getView(req.params.type).term}/list`, {
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
        as: 'candidate'
      };
      break;
    case 'es':
      include = {
        model: Models.ESAccount,
        required: true,
        include: {
          model: Models.Establishment,
          required: true
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
        title: 'des candidats',
        where: 'candidate'
      };
      break;
    case 'es':
      view = {
        term: 'candidates',
        title: 'des candidats',
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