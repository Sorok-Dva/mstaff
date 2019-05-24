const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Group = {};

BackOffice_Group.EditLinkES = (req, res, next) => {
  if (!req.body.selectInput || !req.params.id) {
    return res.status(400).json({ status: 'invalid input' })
  }
  return Models.EstablishmentGroups.findAll({ where: { id_group: req.params.id } }).then(esGroup => {
    if (esGroup.length !== 0) {
      Models.EstablishmentGroups.destroy({ where: { id_group: req.params.id } });
    }
    for (let i = 0; i < req.body.selectInput.length; i++) {
      Models.EstablishmentGroups.create({
        id_es: req.body.selectInput[i],
        id_group: req.params.id
      }).then(res.status(200))
    }
    return res.status(200).json({ status: 'ok' });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.EditLinkGroup = (req, res, next) => {
  return Models.GroupsSuperGroups.findAll({ where: { id_super_group: req.params.id } }).then(GroupSuperGroup => {
    if (GroupSuperGroup.length !== 0) {
      Models.GroupsSuperGroups.destroy({ where: { id_super_group: req.params.id } });
    }
    for (let i = 0; i < req.body.selectInput.length; i++) {
      Models.GroupsSuperGroups.create({
        id_group: req.body.selectInput[i],
        id_super_group: req.params.id
      })
    }
    return res.status(200).json({ status: 'ok' });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.ViewGroups = (req, res) => {
  return Models.Groups.findAll().then( group => {
    res.render('back-office/users/list_groups', {
      layout, group, a: { main: 'users', sub: 'Groups' } })
  });
};

BackOffice_Group.EditGroup = (req, res, next) => {
  return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
    if (req.body.promptInput) {
      group.name = req.body.promptInput;
    }
    group.save();
    return res.status(200).json({ status: 'Modified' });
  })
};

BackOffice_Group.AddGroup = (req, res, next) => {
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
};

BackOffice_Group.RemoveGroup = (req, res, next) => {
  return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
    if (!group) return res.status(400).send({ body: req.body, error: 'This group does not exist' });
    return group.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.ViewSuperGroups = (req, res) => {
  return Models.SuperGroups.findAll().then( superGroup => {
    res.render('back-office/users/list_supergroups', {
      layout, superGroup, a: { main: 'users', sub: 'superGroups' } })
  });
};

BackOffice_Group.EditSuperGroup = (req, res, next) => {
  return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
    if (req.body.promptInput) {
      superGroup.name = req.body.promptInput;
    }
    superGroup.save();
    return res.status(200).json({ status: 'Modified' });
  })
};

BackOffice_Group.AddSuperGroup = (req, res, next) => {
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
};

BackOffice_Group.RemoveSuperGroup = (req, res, next) => {
  return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
    if (!superGroup) return res.status(400).send({ body: req.body, error: 'This super group does not exist' });
    return superGroup.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.getGroupLinksList = (req, res, next) => {
  Models.GroupsSuperGroups.findAll({ where: { id_super_group: req.params.id } }).then(linkgroup => {
    res.status(200).send({ linkgroup });
  }).catch(error => next(new BackError(error)));
};

module.exports = BackOffice_Group;