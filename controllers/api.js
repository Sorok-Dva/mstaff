const { validationResult } = require('express-validator/check');
const { BackError } = require('../helpers/back.error');
const Models = require('../orm/models/index');

module.exports = {
  getSkillsList: (req, res, next) => {
    Models.Skill.findAll().then(skills => {
      res.status(200).send({ skills });
    }).catch(error => next(new BackError(error)));
  },
  getPostsList: (req, res, next) => {
    Models.Post.findAll().then(posts => {
      res.status(200).send({ posts });
    }).catch(error => next(new BackError(error)));
  },
  getServicesList: (req, res, next) => {
    Models.Service.findAll().then(services => {
      res.status(200).send({ services });
    }).catch(error => next(new BackError(error)));
  },
  getFormationList: (req, res, next) => {
    Models.Formation.findAll().then(formations => {
      res.status(200).send({ formations });
    }).catch( error => next(new BackError(error)));
  },
  getQualificationList: (req, res, next) => {
    Models.Qualification .findAll().then(qualifications => {
      res.status(200).send({ qualifications });
    }).catch( error => next(new BackError(error)));
  },
  getGroupsList: (req, res, next) => {
    Models.Groups.findAll().then(groups => {
      res.status(200).send({ groups });
    }).catch(error => next(new BackError(error)));
  },
  getEquipmentsList: (req, res, next) => {
    Models.Equipment.findAll().then(equipments => {
      res.status(200).send({ equipments });
    }).catch(error => next(new BackError(error)));
  },
  getSoftwaresList: (req, res, next) => {
    Models.Software.findAll().then(softwares => {
      res.status(200).send({ softwares });
    }).catch(error => next(new BackError(error)));
  },
  getCategoriesList: (req, res, next) => {
    Models.CategoriesPostsServices.findAll().then(categories => {
      res.status(200).send({ categories });
    }).catch(error => next(new BackError(error)));
  },
};