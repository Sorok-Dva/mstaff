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
    res.render('establishments/selectEs', { esAccounts, a: { main: 'selectEs' } });
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
    Models.User.findOne({ where: { id: req.user.id }, attributes: ['id', 'opts'] }).then(user => {
      let { opts } = user;
      if (_.isNil(opts)) opts = {};
      if (!('currentEs' in opts)) opts.currentEs = esAccount.es_id;
      else opts.currentEs = esAccount.es_id;
      user.opts = opts;
      user.save().then(result => {
        return res.redirect('/candidates');
      });
    });
  }).catch(error => next(new BackError(error)));
};

Establishment.find = (id, next) => {
  Models.Establishment.findOne({
    where: { id },
    include: {
      model: Models.Offer,
      as: 'offers'
    }
  }).then(es => {
    if (_.isNil(es)) return new BackError('Établissement introuvable', 403);
    else next(es);
  })
};

module.exports = Establishment;