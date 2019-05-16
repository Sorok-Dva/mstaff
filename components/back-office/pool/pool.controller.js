const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Pool = {};

BackOffice_Pool.viewList = (req, res, next) => {
  Models.Pool.findAll().then(pools => {
    res.render('back-office/pool/pool-list', {
      layout,
      pools,
      title: `Liste des pools`,
      a: { main: 'pools', sub: 'pool-list' },
    });
  });
};

BackOffice_Pool.viewLinks = (req, res, next) => {
  res.render('back-office/pool/pool-links', {
    layout,
    title: `Liste des liaisons de pool`,
    a: { main: 'pools', sub: 'pool-links' },
  });
};

module.exports = BackOffice_Pool;