const { validationResult } = require('express-validator/check');

const Models = require('../orm/models/index');

module.exports = {
  getSkillsList: (req, res, next) => {
    Models.Skill.findAll().then(skills => {
      res.status(200).send({ skills });
    }).catch(error => next(error));
  },
  getEquipmentsList: (req, res, next) => {
    Models.Equipment.findAll().then(equipments => {
      res.status(200).send({ equipments });
    }).catch(error => next(error));
  },
  getSoftwaresList: (req, res, next) => {
    Models.Software.findAll().then(softwares => {
      res.status(200).send({ softwares });
    }).catch(error => next(error));
  },
  getEstablishmentList: (req, res, next) => {
    Models.Establishment.findAll().then(establishments => {
      res.status(200).send({ establishments });
    }).catch(error => next(error));
  },
  getCategoriesList: (req, res, next) => {
    Models.CategoriesPostsServices.findAll().then(categories => {
      res.status(200).send({ categories });
    }).catch(error => next(new Error(error)));
  },
};