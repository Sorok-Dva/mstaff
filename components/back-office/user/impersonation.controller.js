const __ = process.cwd();
const _ = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const Models = require(`${__}/orm/models/index`);
const UserComponent = require(`${__}/components/user/user.controller`);
const discord = require(`${__}/bin/discord-bot`);

const BackOffice_Users_Impersonation = {};

BackOffice_Users_Impersonation.User = (req, res, next) => {
  Models.User.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['password'] }
  }).then(user => {
    if (_.isNil(user)) return res.status(400).send('Utilisateur introuvable.');
    let originalUser = req.user.id;
    let originalRole = req.user.role;
    let originalFullName = req.user.fullName;
    req.logIn(user, (err) => !_.isNil(err) ? next(new BackError(err)) : null);
    req.session.originalUser = originalUser;
    req.session.role = originalRole;
    req.session.readOnly = true;
    discord(`**${originalFullName}** vient de se connecter en tant que **${user.firstName} ${user.lastName}** (${user.email}) sur Mstaff.`, 'infos');
    return res.redirect('/');
  });
};

BackOffice_Users_Impersonation.Remove = (req, res, next) => {
  Models.User.findOne({
    where: { id: req.session.originalUser },
    attributes: { exclude: ['password'] }
  }).then(user => {
    if (_.isNil(user)) return res.status(400).send('Utilisateur introuvable.');
    delete req.session.originalUser;
    delete req.session.role;
    delete req.session.readOnly;
    let oldUser = req.user;
    req.logIn(user, (err) => !_.isNil(err) ? next(new BackError(err)) : null);
    discord(`**${user.firstName} ${user.lastName}** vient de se déconnecter du compte de **${oldUser.fullName}**.`, 'infos');
    return res.redirect('/');
  });
};

BackOffice_Users_Impersonation.removeReadOnly = (req, res, next) => {
  Models.User.findOne({
    where: { id: req.session.originalUser },
    attributes: ['password', 'firstName', 'lastName']
  }).then(user => {
    if (_.isNil(user)) return res.status(400).send('User not found.');
    UserComponent.comparePassword(req.body.password, user.dataValues.password, (err, isMatch) => {
      if (err) return res.status(200).json({ error: err });
      if (isMatch) {
        let pinCode = Math.floor(Math.random() * 90000) + 10000;
        req.session.pinCode = pinCode;
        discord(`***${user.firstName} ${user.lastName}** vient de demander une suppression de la lecture seule sur le compte de ${req.user.fullName}.
           Code PIN : **${pinCode}***`, 'infos');
        return res.status(200).json({ status: 'send' });
      } else {
        return res.status(200).json({ error: 'invalid password' });
      }
    });
  });
};

BackOffice_Users_Impersonation.PutReadOnly = (req, res) => {
  req.session.readOnly = true;
  discord(`*Lecture seule ré-activée sur le compte de ${req.user.fullName}.*`, 'infos');
  return res.status(200).json({ status: 'ok' });
};

BackOffice_Users_Impersonation.RemoveReadOnlyValidation = (req, res) => {
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
};

module.exports = BackOffice_Users_Impersonation;