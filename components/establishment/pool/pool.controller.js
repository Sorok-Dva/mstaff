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
  Models.Pool.count({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs } }).then(poolsCount => {
    if (poolsCount > 0) {
      Models.Pool.findAll({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs } }).then(pools => {
        return res.render('establishments/my-pool', { a, pools } );
      }).catch(error => next(new Error(error)));
    } else {
      return res.render('establishments/pool', { a });
    }
  });
};

Establishment_Pool.ViewAll = (req, res, next) => {
  let a = { main: 'pools' };
  Models.Pool.findAll({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs } }).then(pools => {
    return res.render('establishments/my-pool', { a, pools } );
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Add = (req, res, next) => {
  let mails = JSON.parse(req.body.mails);
  let full_name = req.user.fullName;
  Models.Pool.create({
    name: req.body.pool,
    referent: req.body.referent,
    user_id: req.user.id,
    es_id: req.user.opts.currentEs
  }).then(pool => {
    mails.forEach(mail => {
      let token = crypto.randomBytes(10).toString('hex');

      Models.InvitationPools.create({
        email: mail,
        token: token,
        pool_id: pool.id
      }).then(() => {
        Models.Establishment.findOne({ where: { id: req.user.opts.currentEs }, attributes: ['name'] }).then((es) => {
          Establishment_Pool.sendMail([ mail ], token, full_name, es.name);
        }).catch(error => next(new Error(error)));
      }).catch(error => next(new Error(error)));
    });

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

Establishment_Pool.ViewInvitations = (req, res, next) => {
  Models.InvitationPools.findAll({
    attributes: ['email'],
    where: { pool_id: req.params.id },
  }).then(emails => {
    return res.status(200).send({ emails });
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.DeleteInvite = (req, res, next) => {
  Models.InvitationPools.destroy({ where: { pool_id: req.params.id, email: req.body.email } }).then( () => {
    res.status(200).json('Invitation removed from pool');
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.Invite = (req, res, next) => {
  let mails = JSON.parse(req.body.mails);
  let full_name = req.user.fullName;
  mails.forEach(mail => {
    let token = crypto.randomBytes(10).toString('hex');
    Models.InvitationPools.create({
      email: mail,
      token: token,
      pool_id: req.params.id,
    }).then(() => {
      Models.Establishment.findOne({ where: { id: req.user.opts.currentEs }, attributes: ['name'] }).then((es) => {
        Establishment_Pool.sendMail([ mail ], token, full_name, es.name);
      }).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  });
  res.status(200).json('Invitations sent');
};

Establishment_Pool.Delete = (req, res, next) => {
  Models.UserPool.destroy({ where: { pool_id: req.body.pool } }).then( () => {
    Models.Pool.findOne({ where: { id: req.body.pool } }).then(pool => {
      pool.destroy().then(res.status(200).json('Pool removed')).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  }).catch(error => next(new Error(error)));
};

Establishment_Pool.sendMail = (mails, token, name, es_name) => {
  mails = mails.join();
  mailer.sendEmail({
    to: mails,
    subject: 'Vous avez été invité à rejoindre un pool.',
    template: 'candidate/poolInvite',
    context: {
      token,
      name,
      es_name,
    }
  });
};

module.exports = Establishment_Pool;