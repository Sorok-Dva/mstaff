const __ = process.cwd();
const { Op } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);
const Notification = require(`${__}/components/notification`);
const Mailer = require(`${__}/components/mailer`);

const Conference = {};

Conference.viewConferences_ES = (req, res, next) => {
  Models.Conference.findAll({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs } }).then(conferences => {
    let a = { main: 'conferences' };
    return res.render('establishments/calendar', { a, conferences });
  })
};

Conference.viewConference_ES = (req, res, next) => {
  Models.Conference.findOne({
    where: {
      user_id: req.user.id,
      es_id: req.user.opts.currentEs,
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
        attributes: ['id', 'firstName', 'lastName'],
        on: {
          '$Candidate.user_id$': {
            [Op.col]: 'Candidate->User.id'
          }
        },
      }
    }
  }).then(conference => {
    return res.status(httpStatus.OK).send(conference);
  })
};

Conference.viewConference_Candidate = (req, res, next) => {
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.Conference.findOne({
      where: {
        candidate_id: candidate.id,
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
        attributes: ['id', 'name', 'address', 'town'],
        required: true,
        on: {
          '$Conference.es_id$': {
            [Op.col]: 'Establishment.id'
          }
        }
      }]
    }).then(conference => {
      if (_.isNil(conference)) return next(new BackError('Conference introuvable', 404));
      return res.status(httpStatus.OK).send(conference);
    })
  });
};

Conference.changeDate = (req, res, next) => {
  Models.Conference.findOne({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs, id: req.params.id } }).then(conference => {
    if (_.isNil(conference)) return next(new BackError(`Conférence ${req.params.id} introuvable.`, httpStatus.NOT_FOUND));
    conference.date = req.body.newDate;
    conference.status = req.body.status || 'waiting';
    conference.save().then(result => {
      return res.status(httpStatus.OK).send(result);
    });
  });
};

Conference.edit = (req, res, next) => {
  Models.Conference.findOne({ where: { user_id: req.user.id, es_id: req.user.opts.currentEs, id: req.params.id } }).then(conference => {
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
        es_id: req.user.opts.currentEs,
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
    Models.Candidate.findOne({
      where: { id: conference.candidate_id },
      include: {
        model: Models.User,
        attributes: ['id', 'firstName', 'lastName', 'email'],
        on: {
          '$Candidate.user_id$': {
            [Op.col]: 'User.id'
          }
        },
        required: true
      }
    }).then(candidate => {
      Models.Notification.create({
        fromUser: conference.user_id,
        fromEs: conference.es_id,
        to: candidate.User.id,
        subject: 'Un entretien vous a été proposé !',
        title: `Bravo !\n L'établissement ${req.es.name} vous propose un entretien d'embauche.`,
        image: '/assets/images/wink.jpg',
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
        Mailer.Main.notifyCandidatesNeedConference(candidate.User.email, { user: candidate.User, conference })
      });
    });
  });
};

Conference.sendDeleteNotification = (conference, req) => {
  Models.Need.findOne({ where: { id: conference.need_id } }).then(need => {
    Models.Candidate.findOne({
      where: { id: conference.candidate_id },
      include: {
        model: Models.User,
        attributes: ['id', 'firstName', 'lastName', 'email'],
        on: {
          '$Candidate.user_id$': {
            [Op.col]: 'User.id'
          }
        },
        required: true
      }
    }).then(candidate => {
      Models.Notification.create({
        fromUser: conference.user_id,
        fromEs: conference.es_id,
        to: conference.candidate_id,
        subject: 'Un entretien a été annulé.',
        title: `L'établissement ${req.es.name} a annulé un entretien d'embauche.`,
        image: '/assets/images/sad.jpg',
        opts: {
          type: 'ConferenceNotifyCandidate',
          template: 'delete',
          details: {
            conference,
            need,
            es: conference.type === 'physical' ? { name: req.es.name, address: req.es.address, town: req.es.town } : null
          },
          message: req.body.message,
          needCandidateId: conference.candidate_id
        }
      }).then(notification => {
        Mailer.Main.notifyCandidatesNeedConferenceDeleted(candidate.User.email, { user: candidate.User })
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
      },
      include: [{
        model: Models.User,
        attributes: { exclude: ['password'] },
        on: {
          '$Conference.user_id$': {
            [Op.col]: 'User.id'
          }
        }
      }, {
        model: Models.Establishment
      }]
    }).then(conference => {
      if (_.isNil(conference)) return next();
      conference.status = req.body.availability;
      conference.save();
      Mailer.Main.notifyESCandidateAnswerConference(conference.User.email, { Conference: conference, es: conference.Establishment });
      Notification.ES.candidateAnswerForConference(conference.User, req.user, conference.Establishment);
      return res.status(200).send('done');
    })
  })
};

Conference.askNewDate = (req, res, next) => {
  Models.Conference.findOne({
    where: {
      candidate_id: req.user.id,
      id: req.params.id,
    },
    include: [{
      model: Models.User,
      attributes: ['id', 'firstName', 'lastName', 'email'],
      required: true,
      on: {
        '$Conference.user_id$': {
          [Op.col]: 'User.id'
        }
      }
    }, {
      model: Models.Establishment,
      attributes: ['id', 'name', 'address', 'town'],
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

Conference.delete = (req, res, next) => {
  return Models.Conference.findOne({ where: { id: req.params.id } }).then(conference => {
    if (!conference) return res.status(400).send({ body: req.body, error: 'Conference introuvable' });
    return conference.destroy().then(data => {
      Conference.sendDeleteNotification(conference, req);
      return res.status(201).send({ deleted: true, data })
    });
  }).catch(error => next(new BackError(error)));
};


module.exports = Conference;