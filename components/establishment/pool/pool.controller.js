const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');
const moment = require('moment');

const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment_Pool = {};

Establishment_Pool.viewPools = (req, res, next) => {
  let a = { main: 'pools' };
  return res.render('establishments/pool', { a } );
};

Establishment_Pool.viewMyPools = (req, res, next) => {
  let a = { main: 'pools' };
  return res.render('establishments/my-pool', { a } );
};

module.exports = Establishment_Pool;