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

Establishment_Website.getIndex = (req, res, next) => {
  return res.render('establishments/site/index', { layout: 'establishment' })
};

Establishment_Website.getRegister = (req, res, next) => {
  return res.render('users/register', { layout: 'onepage' })
};

module.exports = Establishment_Website;