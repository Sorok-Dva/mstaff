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

BackOffice_Pool.createPool = (req, res, next) => {
  Models.Pool.create({
    name: req.body.name,
    referent: req.body.referent,
    owner: req.body.owner
  }).then(pool => {
    res.status(200).json({ result: pool, message: 'pool created' });
  }).catch(error => next(new Error(error)));
};

BackOffice_Pool.linkDependencies = (req, res, next) => {
  Models.UserPool.findAll({
    include: [{
      model: Models.User,
      where: { role: 'User' },
      attributes: {
        exclude: ['password', 'photo', 'birthday', 'postal_code', 'town', 'country', 'key',
          'validated', 'opts', 'createdAt', 'updatedAt']
      }
    },
    {
      model: Models.Pool,
    },
    {
      model: Models.Establishment,
      attributes: { exclude: ['oldId', 'category', 'finess', 'finesse_ej', 'siret', 'phone', 'sector',
        'address', 'town', 'status', 'url', 'description', 'logo', 'banner', 'domain_name', 'domain_enable',
        'salaries_count', 'contact_identity', 'contact_post', 'contact_email', 'contact_phone',
        'createdAt', 'updatedAt'] }
    }]
  }).then(dependencies => res.status(200).send(dependencies));
};

BackOffice_Pool.viewLinks = (req, res, next) => {
  Models.UserPool.findAll().then(poollinks => {
    console.log(poollinks);
    res.render('back-office/pool/pool-links', {
      layout,
      poollinks,
      title: `Liste des liaisons de pool`,
      a: { main: 'pools', sub: 'pool-links' },
    });
  });
};

module.exports = BackOffice_Pool;