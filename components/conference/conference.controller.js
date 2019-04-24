const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const moment = require('moment');
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);
const Mailer = require(`${__}/components/mailer`);

const Conference = {};

Conference.viewConferences_ES = (req, res, next) => {
  Models.Conference.findAll({ where: { user_id: req.user.id, es_id: req.session.currentEs } }).then(conferences => {
    let a = { main: 'conferences' };
    return res.render('establishments/calendar', { a, conferences });
  })
};

Conference.viewConference_ES = (req, res, next) => {
  Models.Conference.findOne({
    where: {
      user_id: req.user.id,
      es_id: req.session.currentEs,
      id: req.params.id
    },
    include: {
      model: Models.Candidate,
      attributes: ['id', 'user_id'],
      required: true,
      on: {
        '$Conference.candidate_id$': {
          [Op.col]: 'Candidate.id'
        }
      },
      include: {
        model: Models.User,
        required: true,
        attributes: ['id', 'firstName', 'lastName']
      }
    }
  }).then(conference => {
    return res.status(httpStatus.OK).send(conference);
  })
};

Conference.viewConference_Candidate = (req, res, next) => {
  Models.Conference.findOne({
    where: {
      candidate_id: req.user.id,
      id: req.params.id,
    },
    include: [{
      model: Models.User,
      attributes: ['id', 'firstName', 'lastName'],
      required: true,
      on: {
        '$Conference.user_id$': {
          [Op.col]: 'User.id'
        }
      }
    }, {
      model: Models.Establishment,
      required: true,
      on: {
        '$Conference.es_id$': {
          [Op.col]: 'Establishment.id'
        }
      }
    }]
  }).then(conference => {
    return res.status(httpStatus.OK).send(conference);
  })
};

Conference.changeDate = (req, res, next) => {
  Models.Conference.findOne({ where: { user_id: req.user.id, es_id: req.session.currentEs, id: req.params.id } }).then(conference => {
    if (_.isNil(conference)) return next(new BackError(`Conférence ${req.params.id} introuvable.`, httpStatus.NOT_FOUND));
    conference.date = req.body.newDate;
    conference.status = req.body.status || 'waiting';
    conference.save().then(result => {
      return res.status(httpStatus.OK).send(result);
    });
  });
};

Conference.edit = (req, res, next) => {
  Models.Conference.findOne({ where: { user_id: req.user.id, es_id: req.session.currentEs, id: req.params.id } }).then(conference => {
    conference.date = req.body.date;
    conference.type = req.body.type;
    conference.status = req.body.status || 'waiting';
    conference.save().then(result => {
      return res.status(httpStatus.OK).send(result);
    });
  })
};

Conference.create = (req, res, next) => {
  try {
    Models.Conference.findOrCreate({
      where: {
        es_id: req.session.currentEs,
        user_id: req.user.id,
        need_id: req.params.id,
        candidate_id: req.params.candidateId,
        status: 'waiting',
        type: req.body.type,
      },
      defaults: {
        date: req.body.date,
        time: req.body.time,
        key: Math.random().toString(36).substring(7)
      }
    }).spread((conference, created) => {
      if (created) {
        Conference.sendInvitationNotification(conference, req);
        return res.status(httpStatus.OK).send(conference);
      } else {
        return res.status(200).json({ status: 'Already exists', conference });
      }
    })
  } catch (errors) {
    return next(new BackError(errors));
  }
};

Conference.sendInvitationNotification = (conference, req) => {
  Models.Need.findOne({ where: { id: conference.need_id } }).then(need => {
    Models.Notification.create({
      fromUser: conference.user_id,
      fromEs: conference.es_id,
      to: conference.candidate_id,
      subject: 'Un entretien vous a été proposé !',
      title: `Bravo !\n L'établissement ${req.es.name} vous propose un entretien d'embauche.`,
      image: '/static/assets/images/wink.jpg',
      opts: {
        type: 'ConferenceNotifyCandidate',
        details: {
          conference,
          need,
          es: conference.type === 'physical' ? { name: req.es.name, address: req.es.address, town: req.es.town } : null
        },
        message: req.body.message,
        actions: [{
          'type': 'success',
          'text': 'Disponible',
          'dataAttr': `data-confid="${conference.id}" data-action="conf/availability" data-availability="accepted"`
        }, {
          'type': 'danger',
          'text': 'Indisponible',
          'dataAttr': `data-confid="${conference.id}" data-action="conf/availability" data-availability="refused"`
        }],
        needCandidateId: conference.candidate_id
      }
    }).then(notification => {
      Models.Candidate.findOne({
        attributes: ['user_id'],
        where: { id: conference.candidate_id },
        include: {
          model: Models.User,
          attributes: ['email', 'firstName'],
          required: true
        }
      }).then(candidate => {
        Mailer.Main.notifyCandidatesNeedConference(candidate.User.email, { user: candidate.User, conference })
      });
    });
  });
};

Conference.candidateAnswer = (req, res, next) => {
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next();
    Models.Conference.findOne({
      where: {
        id: parseInt(req.params.id),
        candidate_id: candidate.id
      }
    }).then(conference => {
      if (_.isNil(conference)) return next();
      conference.status = req.body.availability;
      conference.save();
      return res.status(200).send('done');
    })
  })
};

module.exports = Conference;