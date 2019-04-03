const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require('../helpers/back.error');
const httpStatus = require('http-status');

const mailer = require('../bin/mailer');
const Models = require('../orm/models/index');

const Establishment = require('../components/establishment');

module.exports = {
  Establishment,

  /**
   * Create User Method
   * @param req
   * @param res
   * @description Method triggered on new user form submit.
   *              Verify form consistency, generate password hash and execute query.
   */
  create: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/registerDemo', { body: req.body, errors: errors.array() });
    }

    Models.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      type: 'es'
    }).then(user => res.render('users/login', { user }))
      .catch(error => res.render('users/register', { body: req.body, sequelizeError: error }));
  },
  addApplication: (body, wish) => {
    for (let i = 0; i < body.es.length; i++) {
      Models.Application.create({
        name: body.name || 'Candidature sans nom',
        wish_id: wish.id,
        candidate_id: body.user.id,
        finess: body.es[i],
        new: true
      });
    }
  },
  //NEED.CANDIDATE
  apiNeedCandidate: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }

    Models.NeedCandidate.findOne({
      where: { need_id: req.params.id, candidate_id: req.params.candidateId },
      include: [{
        model: Models.Need,
        required: true,
        on: {
          'id': {
            [Op.col]: 'NeedCandidate.need_id'
          }
        },
        include: {
          model: Models.Establishment,
          required: true
        }
      }, {
        model: Models.Candidate,
        required: true,
        include: {
          model: Models.User,
          required: true,
          on: {
            '$Candidate.user_id$': {
              [Op.col]: 'Candidate->User.id'
            }
          },
          attributes: ['id', 'email']
        }
      }]
    }).then(needCandidate => {
      if (_.isNil(needCandidate))
        return next(new BackError(`Candidate ${req.params.candidateId} or Need ${req.params.id} not found`, httpStatus.NOT_FOUND));
      else {
        switch (req.params.action) {
          case 'notify':
            Models.Notification.create({
              fromUser: req.user.id,
              fromEs: needCandidate.Need.Establishment.id,
              to: needCandidate.Candidate.User.id,
              title: 'Un établissement est intéressé par votre profil !',
              message: req.body.message
            }).then(notification => {
              needCandidate.status = 'notified';
              needCandidate.notified = true;
              needCandidate.save().then(result => {
                mailer.sendEmail({
                  to: needCandidate.Candidate.User.email,
                  subject: 'Un établissement est intéressé par votre profil !',
                  template: 'candidate/es_notified',
                  context: {
                    notification,
                    needCandidate
                  }
                });
                res.status(201).send(result);
              })
            });
            break;
          case 'select':
            needCandidate.status = 'selected';
            needCandidate.notified = true;
            needCandidate.save().then(result => {
              res.status(201).send(result);
            });
            break;
          case 'cancel':
            needCandidate.status = 'canceled';
            needCandidate.save().then(result => {
              res.status(201).send(result);
            });
            break;
          case 'delete':
            needCandidate.status = 'deleted';
            needCandidate.notified = false;
            needCandidate.save().then(result => {
              res.status(201).send(result);
            });
            break;
          default:
            return res.status(400).send('no action provided');
        }
      }
    })
  },
  //CANDIDATE
  apiFavCandidate: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }

    let where = {
      es_id: req.params.esId,
      candidate_id: req.params.candidateId,
      added_by: req.user.id
    };

    switch (req.params.action) {
      case 'fav':
        Models.FavoriteCandidate.findOrCreate({ where }).spread((fav, created) => {
          if (created) {
            res.status(201).send({ status: 'Created', fav });
          } else {
            res.status(200).send({ status: 'Already exists', fav });
          }
        });
        break;
      case 'unfav':
        Models.FavoriteCandidate.findOne({ where }).then(fav => {
          fav.destroy().then(result => {
            res.status(200).send({ status: 'deleted', result })
          })
        });
        break;
      case 'archive':
        Models.ArchivedCandidate.findOrCreate({ where }).spread((archive, created) => {
          if (created) {
            res.status(201).send({ status: 'Created', archive });
          } else {
            res.status(200).send({ status: 'Already exists', archive });
          }
        });
        break;
      case 'unarchive':
        Models.ArchivedCandidate.findOne({ where }).then(archive => {
          archive.destroy().then(result => {
            res.status(200).send({ status: 'deleted', result })
          })
        });
        break;
    }
  },
};
