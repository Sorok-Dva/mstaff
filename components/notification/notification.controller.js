const __ = process.cwd();
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);

const Notification = {};

Notification.getAndCount = (req, res, next) => {
  Models.Notification.findAndCountAll({ where: { to: req.user.id, read: false }, order: [['createdAt', 'DESC']] }).then(result => {
    return res.status(httpStatus.OK).send(result);
  }).catch(error => next(new BackError(error)));
};

Notification.view = (req, res, next) => {
  Models.Notification.findOne({ where: { id: req.params.id, to: req.user.id } }).then(notification => {
    if (_.isNil(notification)) return next(new BackError(`Notification ${req.body.id} introuvable.`, httpStatus.NOT_FOUND));
    return res.status(httpStatus.OK).send(notification);
  }).catch(error => next(new BackError(error)));
};

Notification.read = (req, res, next) => {
  Models.Notification.findOne({ where: { id: req.body.id, to: req.user.id } }).then(notification => {
    if (_.isNil(notification)) return next(new BackError(`Notification ${req.body.id} introuvable.`, httpStatus.NOT_FOUND));
    notification.read = true;
    notification.save().then(result => {
      return res.status(httpStatus.OK).send(result);
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
};

module.exports = Notification;