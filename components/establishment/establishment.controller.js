const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const sequelize = require(`${__}/bin/sequelize`);
const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment = {};

Establishment.ViewAccounts = (req, res, next) => {
  Models.ESAccount.findAll({
    where: { user_id: req.user.id },
    include: {
      model: Models.Establishment,
      required: true
    }
  }).then(esAccounts => {
    res.render('establishments/selectEs', { esAccounts });
  }).catch(error => next(new BackError(error)));
};

Establishment.Select = (req, res, next) => {
  Models.ESAccount.findOne({
    where: { user_id: req.user.id, es_id: req.params.currentEsId },
    include: {
      model: Models.Establishment,
      required: true
    }
  }).then(esAccount => {
    if (_.isNil(esAccount)) return next(new BackError('Compte établissement introuvable.', httpStatus.NOT_FOUND));
    req.session.currentEs = esAccount.es_id;
    return res.redirect('/needs');
  }).catch(error => next(new BackError(error)));
};

Establishment.findBySubdomain = (req, res, next) => {
  let term;
  if (req.get('host') === 'postuler.croix-rouge.fr') term = 'postuler.crf';
  else term = req.subdomains[0];
  Models.Establishment.findOne({
    where: {
      domain_name: term,
      domain_enable: true
    }
  }).then(es => {
    if (_.isNil(es)) return res.redirect('https://mstaff.co');
    else next(es);
  })
};

module.exports = Establishment;