const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');
const crypto = require('crypto');

const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Configuration = {};

BackOffice_Configuration.ViewSkills = (req, res, next) => {
  return Models.ConfigSkills.findAll().then(skillslinks => {
    res.render('back-office/configuration/skill', {
      layout,
      title: 'Configuration des compétences utilisateur',
      skillslinks,
      a: { main: 'configuration', sub: 'skillconfig' },
    })
  });
};

BackOffice_Configuration.ViewEquipments = (req, res, next) => {
  return Models.ConfigEquipments.findAll().then(equipmentslinks => {
    res.render('back-office/configuration/equipment', {
      layout,
      title: 'Configuration des compétences utilisateur',
      equipmentslinks,
      a: { main: 'configuration', sub: 'equipmentconfig' },
    })
  });
};

BackOffice_Configuration.AddSkill = (req, res, next) => {
  return Models.ConfigSkills.findOrCreate({
    where: {
      id_skill: req.body.skillID,
      id_post: req.body.postID,
      id_service: req.body.serviceID
    }
  }).spread((configskill, created) => {
    if (created) {
      return res.status(200).json({ status: 'Created', configskill });
    } else {
      return res.status(200).json({ status: 'Already exists', configskill });
    }
  })
};

BackOffice_Configuration.AddEquipment = (req, res, next) => {
  return Models.ConfigEquipments.findOrCreate({
    where: {
      id_equipment: req.body.equipmentID,
      id_post: req.body.postID,
      id_service: req.body.serviceID
    }
  }).spread((configequipment, created) => {
    if (created) {
      return res.status(200).json({ status: 'Created', configequipment });
    } else {
      return res.status(200).json({ status: 'Already exists', configequipment });
    }
  })
};

BackOffice_Configuration.RemoveSkill = (req, res, next) => {
  return Models.ConfigSkills.findOne({ where: { id: req.params.id } }).then(configskill => {
    if (!configskill) return res.status(400).send({ body: req.body, error: 'This configuration does not exist' });
    return configskill.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Configuration.RemoveEquipment = (req, res, next) => {
  return Models.ConfigEquipments.findOne({ where: { id: req.params.id } }).then(configequipment => {
    if (!configequipment) return res.status(400).send({ body: req.body, error: 'This configuration does not exist' });
    return configequipment.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

module.exports = BackOffice_Configuration;
