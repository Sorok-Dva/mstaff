const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const sequelize = require(`${__}/bin/sequelize`);
const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment_Need = {};

Establishment_Need.ViewAll = (req, res, next) => {
  Models.Need.findAll({
    where: { es_id: req.session.currentEs },
    include: {
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true
    }
  }).then(needs => {
    res.render('establishments/needs', { needs,  a: { main: 'needs' } });
  }).catch(error => next(new BackError(error)));
};

Establishment_Need.ViewCreate = (req, res, next) => {
  let render = { a: { main: 'candidates' } };
  Models.Post.findAll().then(posts => {
    render.posts = posts;
    return res.render('establishments/addNeed', render);
  }).catch(error => next(new BackError(error)));
};

Establishment_Need.View = (req, res, next) => {
  let render = { a: { main: 'needs' } };
  Models.Need.findOne({
    where: { id: req.params.id },
    include: [{
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true,
      include: {
        model: Models.Candidate,
        required: true,
        include: {
          model: Models.User,
          attributes: ['id', 'firstName', 'lastName', 'birthday'],
          on: {
            '$candidates->Candidate.user_id$': {
              [Op.col]: 'candidates->Candidate->User.id'
            }
          },
          required: true
        }
      }
    }, {
      model: Models.Establishment,
      required: true
    }]
  }).then(need => {
    if (_.isNil(need)) return next(new BackError(`Need ${req.params.id} not found`, httpStatus.NOT_FOUND))
    render.need = need;
    return res.render('establishments/showNeed', render);
  }).catch(error => next(new BackError(error)));
};

Establishment_Need.Create = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  Models.Need.create({
    name: req.body.name || 'Besoin sans nom',
    es_id: req.params.esId,
    contract_type: req.body.contractType,
    post: req.body.post,
    start: req.body.timeType.dateStart,
    end: req.body.timeType.dateEnd,
    createdBy: req.user.id
  }).then(need => {
    req.flash('success_msg', `Besoin ajouté avec succès.`);
    if (!_.isNil(req.body.selectedCandidates)) {
      req.body.selectedCandidates = JSON.parse(`[${req.body.selectedCandidates}]`);

      for (let i = 0; i < req.body.selectedCandidates.length; i++) {
        Models.NeedCandidate.create({
          need_id: need.id,
          candidate_id: req.body.selectedCandidates[i],
          notified: req.body.notifyCandidates
        });
      }
    }
    res.status(201).send(need);
  });
};


module.exports = Establishment_Need;