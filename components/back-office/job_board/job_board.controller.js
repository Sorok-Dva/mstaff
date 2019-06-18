const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Job_Board = {};

BackOffice_Job_Board.ViewJobSheets = (req, res, next) => {
  Models.JobSheet.findAll({
    attributes: ['id', 'name']
  }).then(jobSheets => {
    return res.render('back-office/references/jobSheets', {
      layout,
      title: 'Fiches métiers',
      jobSheets,
      a: { main: 'job_board', sub: 'jobSheets' },
    })
  });
};

BackOffice_Job_Board.AddJobSheet = (req, res, next) => {
  return Models.ConfigSkills.findOrCreate({
    where: {
      id_skill: req.body.skillID,
      id_post: req.body.postID,
      id_service: req.body.serviceID
    }
  }).spread((configskill, created) => {
    if (created) {
      return res.status(200).json({ status: 'Created', configskill });
    } else {
      return res.status(200).json({ status: 'Already exists', configskill });
    }
  })
};

module.exports = BackOffice_Job_Board;