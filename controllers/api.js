const { check, validationResult } = require('express-validator/check');

const Models = require('../models/index');

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {

  },
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
  getCategoriesList: (req, res, next) => {
    Models.CategoriesPostsServices.findAll().then(categories => {
      res.status(200).send({ categories });
    }).catch(error => next(new Error(error)));
  },
};