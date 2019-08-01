const __ = process.cwd();
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);

const Notification_Candidate = {};

Notification_Candidate.candidateIsAvailableForNeed = (req, res, next) => {

};

module.exports = Notification_Candidate;