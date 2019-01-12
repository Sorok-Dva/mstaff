const { check, validationResult } = require('express-validator/check');
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
    switch (method) {

    }
  },
  index:  (req, res) => res.render('back-office/index', { layout, title: 'Tableau de bord', a: { main: 'dashboard', sub: 'overview' } }),
  stats:  (req, res) => res.render('back-office/stats', { layout, title: 'Statistiques', a: { main: 'dashboard', sub: 'stats' } }),
  getUsers:(req, res) => {
    Models.User.findAll({
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
  },
  getCandidates:(req, res) => {
    Models.User.findAll({
      where: {
        type: 'candidate'
      },
      include:[{
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
  getUser:(req, res) => {
    Models.User.findOne({
      where: {
        id: req.params.id
      },
      include:[{
        model: Models.Candidate,
        as: 'candidate'
      }],
      attributes: {
        exclude: ['password']
      }
    }).then(user => {
      res.render('back-office/users/show', {
        layout,
        title: `Profil de ${user.dataValues.firstName} ${user.dataValues.lastName}`,
        a: { main: 'users', sub: 'profile' },
        user
      })
    });
  },
  impersonateUser:(req, res) => {
    Models.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password'] }
    }).then(user => {
      discord(`**${req.user.fullName}** vient de se connecter en tant que **${user.dataValues.email}** sur Mstaff.`, 'infos');
      let originalUser = req.user.id;
      let originalRole = req.user.role;
      req.logIn(user, (err) => console.log(err));
      req.session.originalUser = originalUser;
      req.session.role = originalRole;
      req.session.readOnly = true;
      res.redirect('/');
    });
  },
  removeUserImpersonation:(req, res) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: { exclude: ['password'] }
    }).then(user => {
      discord(`**${user.dataValues.email}** vient de se déconnecter du compte de **${req.user.fullName}**.`, 'infos');
      delete req.session.originalUser;
      delete req.session.role;
      delete req.session.readOnly;
      req.logIn(user, (err) => console.log(err));
      res.redirect('/');
    });
  },
  impersonateRemoveReadOnly:(req, res) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: ['password']
    }).then(user => {
      UserController.comparePassword(req.body.password, user.dataValues.password, (err, isMatch) => {
        if (err) return res.status(200).json({ error: err });
        if (isMatch) {
          let pinCode = Math.floor(Math.random() * 90000) + 10000;
          req.session.pinCode = pinCode;
          discord(`***Admin Mstaff** vient de demander une suppression de la lecture seule sur le compte de ${req.user.fullName}. Code PIN : **${pinCode}***`, 'infos');
          return res.status(200).json({ status: 'send' });
        } else {
          return res.status(200).json({ error: 'invalid password' });
        }
      });
    });
  },
  impersonatePutReadOnly:(req, res) => {
    req.session.readOnly = true;
    discord(`*Lecture seule ré-activée sur le compte de ${req.user.fullName}.*`, 'infos');
    return res.status(200).json({ status: 'ok' });
  },
  impersonateRemoveReadOnlyValidation:(req, res) => {
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
