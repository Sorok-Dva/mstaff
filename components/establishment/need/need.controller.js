const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const moment = require('moment');
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

Establishment_Need.ViewHistory = (req, res, next) => {
  let render = { a: { main: 'history' } };
  Models.Need.findOne({
    where: { id: req.params.id, closed: true },
    include: [{
      model: Models.NeedCandidate,
      as: 'candidates',
      required: true,
      include: {
        model: Models.Candidate,
        required: false,
        include: [{
          model: Models.User,
          attributes: ['id', 'firstName', 'lastName', 'birthday'],
          on: {
            '$candidates->Candidate.user_id$': {
              [Op.col]: 'candidates->Candidate->User.id'
            }
          },
          required: false
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
    return res.render('establishments/showNeedClosed', render);
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
        }).then(needCandidate => {
          if (req.body.notifyCandidates === 'true') {
            Establishment_Need.notify(req, i, needCandidate, need);
          }
        });
      }
    }
    res.status(201).send(need);
  });
};

Establishment_Need.notify = (req, i, needCandidate, need) => {
  Models.Notification.create({
    fromUser: req.user.id,
    fromEs: req.params.esId,
    to: req.body.selectedCandidates[i],
    subject: 'Un établissement est intéressé par votre profil !',
    title: `Bonne nouvelle !\n L'établissement ${req.es.name} est intéressé par votre profil !`,
    image: '/static/assets/images/happy.jpg',
    opts: {
      type: 'NeedNotifyCandidate',
      details: {
        contract: need.contract_type,
        post: need.post,
        service: need.service,
        start: need.start,
        end: need.end
      },
      message: req.body.message,
      actions: [{
        'type': 'success',
        'text': 'Disponible',
        'dataAttr': `data-ncid="${needCandidate.id}" data-action="nc/availability" data-availability="available"`
      }, {
        'type': 'danger',
        'text': 'Indisponible',
        'dataAttr': `data-ncid="${needCandidate.id}" data-action="nc/availability" data-availability="unavailable"`
      }],
      needCandidateId: needCandidate.id
    }
  }).then(notification => {
    needCandidate.status = 'notified';
    needCandidate.availability = 'pending';
    needCandidate.notified = true;
    needCandidate.save().then(result => {
      moment.locale('fr');
      let needObj = {
        start: _.isNil(need.start) ? null : moment(need.start).format('dddd Do MMMM YYYY'),
        end: _.isNil(need.end) ? null : moment(need.end).format('dddd Do MMMM YYYY'),
      };
      Models.User.findOne({ where: { id: req.body.selectedCandidates[i] } }).then(user => {
        mailer.sendEmail({
          to: user.email,
          subject: 'Un établissement a consulté votre profil.',
          template: 'candidate/needNotification',
          context: {
            needCandidate,
            needObj: needObj,
            need,
            es: req.es
          }
        });
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
      Establishment_Need.Close(need, req);
      return res.status(201).send(need);
    });
  });
};

Establishment_Need.Close = (need, req) => {
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
        let notifObject = {
          fromUser: req.user.id,
          fromEs: req.es.id,
          to: need.Candidate.user_id,
          opts: {
            details: {
              post: result.post,
              contract: result.contract_type,
              start: result.start,
              end: result.end,
            }
          }
        };

        if (need.status === 'notified' || need.status === 'canceled') {
          notifObject.subject = 'Un établissement a clôturé une offre pour laquelle vous étiez disponible.';
          notifObject.title = `L'établissement ${req.es.name} a clôturé une offre pour laquelle vous étiez disponible.`;
          notifObject.image = '/static/assets/images/sad.jpg';
          notifObject.opts.type = 'NeedNotifyClosedCandidate';
          Mailer.Main.notifyCandidatesNeedClosed(need.Candidate.User.email, need);
        }
        if (need.status === 'selected') {
          notifObject.subject = 'Vous avez été sélectionné pour l\'offre suivante...';
          notifObject.title = `L'établissement ${req.es.name} vous a sélectionné pour cette offre dont vous trouverez les détails 
          ci-dessous et va prendre rapidement contact avec vous.`;
          notifObject.image = '/static/assets/images/wink.jpg';
          notifObject.opts.type = 'NeedNotifySelectedCandidate';
          Mailer.Main.notifyCandidatesNeedSelect(need.Candidate.User.email, need);
        }

        Models.Notification.create(notifObject);
      })
    })
  });
};

Establishment_Need.candidateAnswer = (req, res, next) => {
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next();
    Models.NeedCandidate.findOne({
      where: {
        id: parseInt(req.params.id),
        candidate_id: candidate.id
      },
      include: {
        model: Models.Need,
        on: {
          '$NeedCandidate.need_id$': {
            [Op.col]: 'Need.id'
          }
        },
        required: true,
        include: {
          model: Models.User,
          attributes: { exclude: ['password'] },
          required: true
        }
      }
    }).then(needCandidate => {
      if (_.isNil(needCandidate)) return next();
      needCandidate.availability = req.body.availability;
      needCandidate.save();
      return res.status(200).send('done');
    })
  })
};

module.exports = Establishment_Need;