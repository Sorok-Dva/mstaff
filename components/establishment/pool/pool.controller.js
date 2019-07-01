const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');
const moment = require('moment');
const crypto = require('crypto');

const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment_Pool = {};

Establishment_Pool.View = (req, res, next) => {
  let a = { main: 'pools' };
  return res.render('establishments/pool', { a } );
};

Establishment_Pool.ViewAll = (req, res, next) => {
  let a = { main: 'pools' };
  Models.Pool.findAll({ where: { owner: req.user.id } }).then(pools => {
    Models.ESAccount.findAll({ where: { user_id: req.user.id } } ).then(group => {
      return res.render('establishments/my-pool', { a, pools, group } );
    }).catch(error => next(new Error(error)));
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Add = (req, res, next) => {
  let { selectedEs } = req.body;
  let token;

  Models.Pool.create({
    name: req.body.pool,
    referent: req.body.referent,
    owner: req.user.id
  }).then(pool => {
    let pool_id = pool.id;
    if (typeof selectedEs === 'object')
    {
      selectedEs.forEach(function (es_id) {
        Models.EsPool.create({ pool_id: pool.id, es_id: es_id }).catch(error => next(new Error(error)));
      });
    } else {
      Models.EsPool.create({ pool_id: pool.id, es_id: selectedEs }).catch(error => next(new Error(error)));
    }
    token = crypto.randomBytes(10).toString('hex');
    //Establishment_Pool.sendMail(JSON.parse(req.body.mails), token);
    res.status(200).send({ pool });
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Edit = (req, res, next) => {
  Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
    pool.name = req.body.name;
    pool.referent = req.body.referent;
    pool.save();
    res.status(200).json('Modifications done')
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Invite = (req, res, next) => {
  let token;
  token = crypto.randomBytes(10).toString('hex');
  Establishment_Pool.sendMail(JSON.parse(req.body.mails), token);
  res.status(200).json('Invitations sent');
};

Establishment_Pool.Delete = (req, res, next) => {
  Models.UserPool.destroy({ where: { pool_id: req.body.pool } }).then( () => {
    Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
      pool.destroy().then(res.status(200).json('Pool removed')).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Enable = (req, res, next) => {
  Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
    pool.active = true;
    pool.save();
    res.status(200).json('pool unabled');
  })
};

Establishment_Pool.Disable = (req, res, next) => {
  Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
    pool.active = false;
    pool.save();
    res.status(200).json('pool disabled');
  })
};

Establishment_Pool.sendMail = (mails, token) => {
  mails = mails.join();
  mailer.sendEmail({
    to: mails,
    subject: 'Vous avez été invité à rejoindre un pool.',
    template: 'candidate/poolInvite',
    context: {
      token
    }
  });
};

module.exports = Establishment_Pool;