const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator');
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

BackOffice_Job_Board.ViewJobSheet = (req, res, next) => {
  Models.JobSheet.findOne({
    where: {
      id: req.params.id
    }
  }).then(jobSheet => {
    return res.render('back-office/job_board/jobSheet', {
      layout,
      title: 'Fiches métier : ' + jobSheet.name,
      jobSheet,
      a: { main: 'job_board', sub: 'jobSheet' },
    })
  });
};

BackOffice_Job_Board.EditJobSheet = (req, res, next) => {
  Models.JobSheet.findOne({
    where: {
      id: req.params.id
    }
  }).then(jobSheet => {
    if (_.isNil(jobSheet)) return next(new BackError('Fiche métier introuvable.', 404));
    jobSheet.name = req.body.name;
    jobSheet.description = req.body.description;
    jobSheet.activities = req.body.activities;
    jobSheet.knowHow = req.body.knowHow;
    jobSheet.knowledge = req.body.knowledge;
    jobSheet.infos = req.body.infos;

    jobSheet.save().then(newJobSheet => {
      req.flash('success_msg', 'Fiche métier sauvegardée avec succès.');
      return res.redirect('/back-office/jobBoard/sheet/' + req.params.id);
    });
  });
};

module.exports = BackOffice_Job_Board;