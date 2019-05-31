const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const sequelize = require(`${__}/bin/sequelize`);
const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment_Website = {};

Establishment_Website.ViewIndex = (req, res, next) => {
  Models.EstablishmentReference.findOne({ where: { finess_et: req.es.finess } }).then(ref => {
    return res.render('subdomain/establishment', { ref, layout: 'subdomain' })
  })
};

Establishment_Website.ViewATS = (req, res, next) => {
  return res.render('establishments/site/ats/index', { es: req.es.finess, layout: 'onepage' })
};

Establishment_Website.ViewATSV2 = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new BackError('Une erreur est apparue dans la construction de l\'Url', 403));
  }
  Models.Establishment.findAll({ attributes: ['finess'] }).then( allEs => {
    let esList = req.query.esList.split(' ');
    let allFiness = [];
    allEs.forEach( es => { allFiness.push(es.finess) });
    let isAbsent = element => { return allFiness.indexOf(element.toString()) === -1 };
    if (esList.some(isAbsent))
      return next(new BackError('Finess absent', 403));
  }).catch(error => next(new BackError(error)));
  //TODO verifier dans la table Establishment si les numeros finess existent
  // console.log('liste des es', req.query.es);
  return next(new BackError('OK', 403));
  // return res.render('establishments/site/ats/index', { es: req.body.esList, layout: 'onepage' })

  // return res.render('establishments/site/ats/index', { es: req.body.esList, layout: 'onepage' })
};

Establishment_Website.ViewRegister = (req, res, next) => {
  return res.render('users/register', { layout: 'onepage' })
};

Establishment_Website.GetPosts = (req, res, next) => {
  Models.Post.findAll().then( posts => {
    res.status(200).send(posts);
  }).catch(error => next(new Error(error)));
};

Establishment_Website.GetServices = (req, res, next) => {
  Models.Service.findAll().then( services => {
    res.status(200).send(services);
  }).catch(error => next(new Error(error)));
};

Establishment_Website.GetAtsDatas = (req, res, next) => {
  let datas = {};
  Models.Post.findAll().then(posts => {
    datas.posts = posts;
    return Models.Service.findAll();
  }).then(services => {
    datas.services = services;
    return Models.Formation.findAll();
  }).then(formations => {
    datas.diplomas = formations;
    return Models.Qualification.findAll();
  }).then(qualifications => {
    datas.qualifications = qualifications;
    return Models.Skill.findAll();
  }).then( skills => {
    datas.skills = skills;
    res.status(200).send(datas);
  }).catch(error => next(new BackError(error)));
};

module.exports = Establishment_Website;