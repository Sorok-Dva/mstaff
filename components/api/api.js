const __ = process.cwd();
const { BackError } = require(`${__}/helpers/back.error`);
const { Op } = require('sequelize');
const _ = require('lodash');
const fs = require('fs');
const Models = require(`${__}/orm/models/index`);

const Api = {};

Api.getSkillsList = (req, res, next) => {
  Models.Skill.findAll().then(skills => {
    res.status(200).send({ skills });
  }).catch(error => next(new BackError(error)));
};

Api.getPostsList = (req, res, next) => {
  Models.Post.findAll().then(posts => {
    res.status(200).send({ posts });
  }).catch(error => next(new BackError(error)));
};

Api.getServicesList = (req, res, next) => {
  Models.Service.findAll().then(services => {
    res.status(200).send({ services });
  }).catch(error => next(new BackError(error)));
};

Api.getFormationList = (req, res, next) => {
  Models.Formation.findAll().then(formations => {
    res.status(200).send({ formations });
  }).catch(error => next(new BackError(error)));
};

Api.getQualificationList = (req, res, next) => {
  Models.Qualification.findAll().then(qualifications => {
    res.status(200).send({ qualifications });
  }).catch(error => next(new BackError(error)));
};

Api.getGroupsList = (req, res, next) => {
  Models.Groups.findAll().then(groups => {
    res.status(200).send({ groups });
  }).catch(error => next(new BackError(error)));
};

Api.getEquipmentsList = (req, res, next) => {
  Models.Equipment.findAll().then(equipments => {
    res.status(200).send({ equipments });
  }).catch(error => next(new BackError(error)));
};

Api.getSoftwaresList = (req, res, next) => {
  Models.Software.findAll().then(softwares => {
    res.status(200).send({ softwares });
  }).catch(error => next(new BackError(error)));
};

Api.getCategoriesList = (req, res, next) => {
  Models.CategoriesPostsServices.findAll().then(categories => {
    res.status(200).send({ categories });
  }).catch(error => next(new BackError(error)));
};

Api.getUserAvatar = (req, res, next) => {
  if (fs.existsSync(`./public/uploads/avatars/${req.params.name}`)) {
    return res.sendFile(`${__}/public/uploads/avatars/${req.params.name}`);
  } else {
    return res.sendFile(`${__}/public/assets/images/face-0.jpg`);
  }
};

Api.getPoolDatas = (req, res, next) => {
  let datas = {};
  Models.Post.findAll().then(posts => {
    datas.posts = posts;
    return Models.Service.findAll();
  }).then(services => {
    datas.services = services;
    res.status(200).send(datas);
  }).catch(error => next(new BackError(error)));
};

module.exports = Api;