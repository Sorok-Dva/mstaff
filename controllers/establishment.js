const { check, validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require('../helpers/back.error');
const httpStatus = require('http-status');

const sequelize = require('../bin/sequelize');
const mailer = require('../bin/mailer');
const Models = require('../models/index');

module.exports = {
  /**
   * Authentication middleware
   * @param req
   * @param res
   * @param next
   * @description user that the current user belongs to the establishment call in the route.
   */
  verifyEsAccess: (req, res, next) => {
    Models.Establishment.findOne({
      where: { id: req.params.esId },
      include: {
        model: Models.ESAccount,
        where: { user_id: req.user.id }
      }
    }).then(es => {
      if (!es) return res.status(403).send(`You don't have access to this establishment.`);
      req.es = es;
      next();
    });
  },
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {
      case 'create': {
        return [
          check('email').isEmail(),
          check('firstName').exists(),
          check('lastName').exists()
        ]
      }
    }
  },
  getSelectEs: (req, res, next) => {
    Models.ESAccount.findAll({
      where: { user_id: req.user.id },
      include: {
        model: Models.Establishment,
        required: true
      }
    }).then(esAccounts => {
      req.session.currentEs = esAccounts[0].es_id;
      res.render('establishments/selectEs', { esAccounts });
    }).catch(error => next(new BackError(error)));
  },
  getNeeds: (req, res, next) => {
    Models.Need.findAll({
      where: { es_id: req.session.currentEs },
      include: {
        model: Models.NeedCandidate,
        as: 'candidates',
        required: true
      }
    }).then(needs => {
      res.render('establishments/needs', { needs });
    }).catch(error => next(new BackError(error)));
  },
  getCVs: (req, res, next) => {
    let query = {
      where: { es_id: req.session.currentEs },
      group: ['candidate_id'],
      include: {
        model: Models.Candidate,
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        required: true,
        include: [{
          model: Models.User,
          attributes: { exclude: ['password', 'type', 'role', 'email', 'phone', 'updatedAt', 'createdAt'] },
          on: {
            '$Wish->Candidate.user_id$': {
              [Op.col]: 'Wish->Candidate->User.id'
            }
          },
          required: true
        }, {
          model: Models.Experience,
          as: 'experiences',
        }, {
          model: Models.CandidateDocument,
          as: 'documents',
          attributes: ['candidate_id', 'type'],
        }, {
          model: Models.CandidateFormation,
          as: 'formations',
        }]
      }
    };

    Models.Applications.findAll({

    }).then(needs => {
      res.render('establishments/needs', { needs });
    }).catch(error => next(new BackError(error)));
  },
  addNeed: (req, res, next) => {
    let render = { a: { main: 'needs' } };
    Models.Post.findAll().then(posts => {
      render.posts = posts;
      return res.render('establishments/addNeed', render);
    }).catch(error => next(new BackError(error)));
  },
  showNeed: (req, res, next) => {
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
      if (_.isNil(need)) return next (new BackError(`Need ${req.params.id} not found`, httpStatus.NOT_FOUND))
      render.need = need;
      return res.render('establishments/showNeed', render);
    }).catch(error => next(new BackError(error)));
  },
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
  findByGeo: (req, res, next) => {
    let { rayon, lat, lon, filterQuery } = req.body;
    let formule = `(6366*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lon) -radians(${lon}))+sin(radians(${lat}))*sin(radians(lat))))`;
    let sql = `SELECT * FROM EstablishmentReferences WHERE ${formule} <= ${rayon}`;
    sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then((data) => {
      let ids = [];
      for (let k in data) {
        ids.push(data[k].finess_et);
      }
      let filter = {
        where: {
          finess_et: ids
        },
        limit: 5000
      };
      if (filterQuery) filter.where.cat = filterQuery;
      Models.EstablishmentReference.findAll(filter).then((es) => {
        return res.status(200).json(es);
      }).catch(error => next(new BackError(error)));
    });
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
  apiSearchCandidates: (req, res, next) => {
    let query = {
      where: { ref_es_id: req.es.finess },
      attributes: { exclude: ['lat', 'lon'] },
      group: ['Wish->Candidate.id'],
      include: {
        model: Models.Wish,
        required: true,
        on: {
          '$Application.wish_id$': {
            [Op.col]: 'Wish.id'
          }
        },
        where: {
          contract_type: req.body.contractType,
          $and: Sequelize.where(Sequelize.fn('lower', Sequelize.col('posts')), {
            [Op.like]: `%${req.body.post.toLowerCase()}%`
          })
        },
        include: {
          model: Models.Candidate,
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          required: true,
          include: [{
            model: Models.User,
            attributes: { exclude: ['password', 'type', 'role', 'email', 'phone', 'updatedAt', 'createdAt'] },
            on: {
              '$Wish->Candidate.user_id$': {
                [Op.col]: 'Wish->Candidate->User.id'
              }
            },
            required: true
          }, {
            model: Models.Experience,
            as: 'experiences',
          }, {
            model: Models.CandidateDocument,
            as: 'documents',
            attributes: ['candidate_id', 'type'],
          }, {
            model: Models.CandidateFormation,
            as: 'formations',
          }]
        }
      }
    };

    Models.Application.findAll(query).then(applications => {
      return res.status(200).send(applications);
    }).catch(error => next(new BackError(error)));
  },
  apiGetCandidate: (req, res, next) => {
    Models.Candidate.findOne({
      where: { user_id: req.params.userId },
      include: [{
        model: Models.User,
        attributes: { exclude: ['password'] },
        on: {
          '$Candidate.user_id$': {
            [Op.col]: 'User.id'
          }
        },
        required: true
      }, {
        model: Models.Experience,
        as: 'experiences',
        include: [{
          model: Models.Service,
          as: 'service'
        }, {
          model: Models.Post,
          as: 'poste'
        }]
      }, {
        model: Models.CandidateQualification,
        as: 'qualifications'
      }, {
        model: Models.CandidateFormation,
        as: 'formations'
      }, {
        model: Models.CandidateSkill,
        as: 'skills'
      }, {
        model: Models.CandidateEquipment,
        as: 'equipments'
      }, {
        model: Models.CandidateSoftware,
        as: 'softwares'
      }, {
        model: Models.CandidateDocument,
        as: 'documents'
      }]
    }).then(candidate => {
      return res.status(200).send(candidate);
    }).catch(error => next(new BackError(error)));
  },
  apiAddNeed: (req, res, next) => {
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
  },
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
      if (_.isNil(needCandidate)) res.json(200).send('No candidate found');
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
          case 'delete':
            needCandidate.status = 'deleted';
            needCandidate.notified = false;
            needCandidate.save().then(result => {
              res.status(201).send(result);
            });
            break;
          default: return res.status(400).send('no action provided');
        }
      }
    })
  },
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
    }
  },
};
