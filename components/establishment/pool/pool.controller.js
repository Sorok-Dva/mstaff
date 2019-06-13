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

Establishment_Pool.viewPools = (req, res, next) => {
  let a = { main: 'pools' };
  return res.render('establishments/pool', { a } );
};

Establishment_Pool.viewMyPools = (req, res, next) => {
  let a = { main: 'pools' };
  Models.Pool.findAll({ where: { owner: req.user.id } }).then(pools => {
    Models.ESAccount.findAll({ where: { user_id: req.user.id } } ).then(group => {
      return res.render('establishments/my-pool', { a, pools, group } );
    }).catch(error => next(new Error(error)));
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.newPool = (req, res, next) => {
  let token;
  if (req.body.allEs === 'false') {
    Models.Pool.create({
      name: req.body.pool,
      referent: req.body.referent,
      owner: req.user.id
    }).then(pool => {
      /*      Models.InvitationAts.create({
        //rominou here
      });    */
      token = crypto.randomBytes(10).toString('hex');
      Establishment_Pool.sendMail(JSON.parse(req.body.mails), token);
      res.status(200).send({ pool });
    }).catch(error => next(new Error(error)));
  }
  else if (req.body.allEs === 'true') {
    Models.Pool.create({
      name: req.body.pool,
      referent: req.body.referent,
      owner: req.user.id
    }).then(pool => {
      /*      Models.InvitationAts.create({
        //rominou here
      });    */
      token = crypto.randomBytes(10).toString('hex');
      Establishment_Pool.sendMail(JSON.parse(req.body.mails), token);
      res.status(200).send({ pool });
    }).catch(error => next(new Error(error)));
  }
};

Establishment_Pool.editPool = (req, res, next) => {
  Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
    pool.name = req.body.name;
    pool.references = req.body.references;
    pool.save();
    res.status(200).json('Modifications done')
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.inviteInPool = (req, res, next) => {
  let token;
  token = crypto.randomBytes(10).toString('hex');
  Establishment_Pool.sendMail(JSON.parse(req.body.mails), token);
  res.status(200).json('Invitations sent');
};

Establishment_Pool.deletePool = (req, res, next) => {
  Models.UserPool.destroy({ where: { pool_id: req.body.pool } }).then( () => {
    Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
      pool.destroy().then(res.status(200).json('Pool removed')).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.enablePool = (req, res, next) => {
  Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
    pool.active = true;
    pool.save();
    res.status(200).json('pool unabled');
  })
};

Establishment_Pool.disablePool = (req, res, next) => {
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