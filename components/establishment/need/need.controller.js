const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const sequelize = require(`${__}/bin/sequelize`);
const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);
const Mailer = require(`${__}/components/mailer`);

const Establishment_Need = {};

Establishment_Need.ViewAll = (req, res, next) => {
  Models.Need.findAll({
    where: { es_id: req.session.currentEs, closed: false },
    include: [{
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true
    }, {
      model: Models.User,
    }]
  }).then(needs => {
    res.render('establishments/needs', { needs,  a: { main: 'needs' } });
  }).catch(error => next(new BackError(error)));
};

Establishment_Need.ViewClosed = (req, res, next) => {
  Models.Need.findAll({
    where: { es_id: req.session.currentEs, closed: true },
    include: [{
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true
    }, {
      model: Models.User,
    }]
  }).then(needs => {
    res.render('establishments/needs_closed', { needs,  a: { main: 'history' } });
  }).catch(error => next(new BackError(error)));
};

Establishment_Need.View = (req, res, next) => {
  let render = { a: { main: 'needs' } };
  Models.Need.findOne({
    where: { id: req.params.id, closed: false },
    include: [{
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true,
      include: {
        model: Models.Candidate,
        required: true,
        include: [{
          model: Models.User,
          attributes: ['id', 'firstName', 'lastName', 'birthday'],
          on: {
            '$candidates->Candidate.user_id$': {
              [Op.col]: 'candidates->Candidate->User.id'
            }
          },
          required: true
        }, {
          model: Models.Application,
          attributes: ['id', 'wish_id', 'candidate_id'],
          as: 'applications',
          on: {
            '$candidates->Candidate.id$': {
              [Op.col]: 'candidates->Candidate->applications.candidate_id'
            }
          },
          include: {
            model: Models.Wish,
            on: {
              '$candidates->Candidate.id$': {
                [Op.col]: 'candidates->Candidate->applications->Wish.candidate_id'
              }
            },
          },
          required: true
        }]
      }
    }, {
      model: Models.Establishment,
      required: true
    }]
  }).then(need => {
    if (_.isNil(need)) return next(new BackError(`Besoin ${req.params.id} introuvable.`, httpStatus.NOT_FOUND));
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
    contract_type: !_.isNil(req.body.filterQuery.contractType) ? req.body.filterQuery.contractType : null,
    post: !_.isNil(req.body.post) ? req.body.post : null,
    service: !_.isNil(req.body.filterQuery.service) ? req.body.filterQuery.service : null,
    start: !_.isNil(req.body.filterQuery.timeType) ? req.body.filterQuery.timeType.dateStart : null,
    end: !_.isNil(req.body.filterQuery.timeType) ? req.body.filterQuery.timeType.dateEnd : null,
    createdBy: req.user.id
  }).then(need => {
    req.flash('success_msg', `Besoin ajouté avec succès.`);
    if (!_.isNil(req.body.selectedCandidates)) {
      req.body.selectedCandidates = JSON.parse(`[${req.body.selectedCandidates}]`);

      for (let i = 0; i < req.body.selectedCandidates.length; i++) {
        Models.NeedCandidate.create({
          need_id: need.id,
          candidate_id: req.body.selectedCandidates[i],
          notified: req.body.notifyCandidates,
          status: req.body.notifyCandidates === 'true' ? 'notified' : 'pre-selected'
        });
        if (req.body.notifyCandidates === 'true') {
          Establishment_Need.notify(req, i);
        }
      }
    }
    res.status(201).send(need);
  });
};

Establishment_Need.notify = (req, i) => {
  Models.Notification.create({
    fromUser: req.user.id,
    fromEs: req.params.esId,
    to: req.body.selectedCandidates[i],
    title: 'Un établissement est intéressé par votre profil !',
    message: req.body.message
  }).then(notification => {
    Models.User.findOne({ where: { id: req.body.selectedCandidates[i] } }).then(user => {
      mailer.sendEmail({
        to: user.email,
        subject: 'Un établissement est intéressé par votre profil !',
        template: 'candidate/es_notified',
        context: {
          notification,
        }
      });
    })
  });
};

Establishment_Need.Feedback = (req, res, next) => {
  Models.Need.findOne({ where: { id: req.body.needId, es_id: req.params.esId } }).then(need => {
    if (_.isNil(need)) return next(new BackError(`Besoin ${req.body.needId} introuvable.`, 404));
    Models.NeedFeedback.create({
      es_id: req.params.esId,
      user_id: req.user.id,
      need_id: need.id,
      how: req.body.how,
      stars: req.body.stars || null,
      feedback: req.body.feedback
    }).then(feedback => {
      Establishment_Need.Close(need);
      return res.status(201).send(need);
    });
  });
};

Establishment_Need.Close = (need) => {
  need.closed = true;
  need.save().then(result => {
    Models.NeedCandidate.findAll({
      where: {
        need_id: need.id,
        status: ['notified', 'canceled', 'selected']
      },
      include: {
        model: Models.Candidate,
        attributes: ['user_id'],
        required: true,
        include: {
          model: Models.User,
          attributes: { exclude: ['password'] },
          required: true
        }
      }
    }).then(needs => {
      needs.forEach(need => {
        if (need.status === 'notified' || need.status === 'canceled') Mailer.Main.notifyCandidatesNeedClosed(need.Candidate.User.email, need);
        if (need.status === 'selected') Mailer.Main.notifyCandidatesNeedClosed(need.Candidate.User.email, need);
      })
    })
  });
};

module.exports = Establishment_Need;