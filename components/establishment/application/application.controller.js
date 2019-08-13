const __ = process.cwd();
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const fs = require('fs');
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);

const Establishment_Application = {};

Establishment_Application.getEstablishments = (req, res, next) => {
  let query = {
    where: { user_id: req.user.id },
    include: [{
      model: Models.Establishment,
      on: {
        '$ESAccount.es_id$': {
          [Op.col]: 'Establishment.id'
        }
      }
    }]
  };
  Models.ESAccount.findAll(query).then(eslist => {
    return res.status(200).send(eslist);
  })
};

Establishment_Application.getCVs = (req, res, next) => {
  let query = {
    where: { es_id: req.user.opts.currentEs },
    attributes: ['id'],
    group: ['Wish.candidate_id'],
    include: {
      model: Models.Wish,
      required: true,
      on: {
        '$Application.wish_id$': {
          [Op.col]: 'Wish.id'
        }
      }
    }
  };
  let render = { a: { main: 'candidates' } };
  Models.Post.findAll().then(posts => {
    render.posts = posts;
    return Models.Service.findAll();
  }).then(services => {
    render.services = services;
    return Models.Formation.findAll();
  }).then(formations => {
    render.formations = formations;
    Models.User.findOne({
      where: { id: req.user.id },
      attributes: ['id'],
      include: {
        model: Models.ESAccount,
        required: true,
        include: {
          model: Models.Establishment,
          required: true,
          attributes: ['id', 'name']
        }
      }
    }).then(rh => {
      render.esList = rh.ESAccounts;
      Models.Application.findAndCountAll(query).then(applications => {
        render.candidatesCount = applications.count;
        if (req.params.editNeedId) {
          Models.Need.findOne({
            where: { id: req.params.editNeedId, es_id: req.user.opts.currentEs, closed: false },
            include: {
              model: Models.NeedCandidate,
              attributes: ['id', 'candidate_id'],
              as: 'candidates',
              required: true
            }
          }).then(need => {
            render.need = need;
            return res.render('establishments/addNeed', render);
          });
        } else {
          return res.render('establishments/addNeed', render);
        }
      }).catch(error => next(new BackError(error)));
    });
  }).catch(error => next(new BackError(error)));
};

Establishment_Application.viewCandidateDocument = (req, res, next) => {
  let query = {
    where: { es_id: req.user.opts.currentEs, candidate_id: req.params.candidateId },
    attributes: ['id', 'es_id', 'candidate_id'],
    include: {
      model: Models.Candidate,
      attributes: ['id'],
      on: {
        '$Application.candidate_id$': {
          [Op.col]: 'Candidate.id'
        }
      },
      required: true,
    }
  };
  Models.Application.findOne(query).then(application => {
    if (_.isNil(application)) return next();
    Models.CandidateDocument.findOne({ where: { id: req.params.id, candidate_id: req.params.candidateId } }).then(document => {
      if (_.isNil(document)) {
        return next(new BackError('Document introuvable', 404));
      } else {
        if (fs.existsSync(`./public/uploads/candidates/documents/${document.filename}`)) {
          return res.sendFile(`${__}/public/uploads/candidates/documents/${document.filename}`);
        } else {
          return next(new BackError('Document introuvable sur ce serveur', 404));
        }
      }
    });
  }).catch(error => next(new BackError(error)));
};

Establishment_Application.CVsPaginationQuery = (req, res, next) => {
  if (isNaN(parseInt(req.params.page)) || isNaN(parseInt(req.params.size))) return next();
  let offset = parseInt(req.params.page - 1) * parseInt(req.params.size);
  let limit = parseInt(req.params.size);
  let query = {
    offset,
    limit,
    attributes: { exclude: ['updatedAt', 'createdAt'] },
    order: Sequelize.literal('`User.createdAt` DESC'),
    include: [{
      model: Models.Experience,
      as: 'experiences',
      include: [{
        model: Models.Service,
        as: 'service',
        attributes: ['id', 'name']
      }, {
        model: Models.Post,
        as: 'poste',
        attributes: ['id', 'name']
      }]
    }, {
      model: Models.User,
      attributes: { exclude: ['password', 'type', 'role', 'email'] },
      on: {
        '$Candidate.user_id$': {
          [Op.col]: 'User.id'
        }
      },
      required: true
    }, {
      model: Models.Application,
      as: 'applications',
      attributes: { exclude: ['lat', 'lon'] },
      where: { es_id: req.user.opts.currentEs },
      required: true,
      on: {
        '$Candidate.id$': {
          [Op.col]: 'applications.candidate_id'
        }
      },
      include: [{
        model: Models.Establishment,
        attributes: ['id'],
        on: {
          '$applications.es_id$': {
            [Op.col]: 'applications->Establishment.id'
          }
        },
        include: [{
          model: Models.FavoriteCandidate,
          attributes: ['added_by', 'candidate_id'],
          on: {
            '$applications->Establishment.id$': {
              [Op.col]: 'applications->Establishment->FavoriteCandidates.es_id'
            },
            '$Candidate.id$': {
              [Op.col]: 'applications->Establishment->FavoriteCandidates.candidate_id'
            }
          },
          include: {
            model: Models.User,
            attributes: ['firstName', 'lastName'],
            on: {
              '$applications->Establishment->FavoriteCandidates.added_by$': {
                [Op.col]: 'applications->Establishment->FavoriteCandidates->User.id'
              }
            }
          }
        }, {
          model: Models.ArchivedCandidate,
          attributes: ['added_by', 'candidate_id'],
          on: {
            '$applications->Establishment.id$': {
              [Op.col]: 'applications->Establishment->ArchivedCandidates.es_id'
            },
            '$Candidate.id$': {
              [Op.col]: 'applications->Establishment->ArchivedCandidates.candidate_id'
            },
            '$applications->Establishment->ArchivedCandidates.added_by$': req.user.id
          },
        }]
      }]
    }]
  };

  Models.Candidate.findAll(query).then(candidates => {
    return res.status(httpStatus.OK).send(candidates);
  }).catch(error => next(new BackError(error)));
};

Establishment_Application.CVsMyCandidatesQuery = (req, res, next) => {
  let model;
  let query = {
    where: { added_by: req.user.id, es_id: req.user.opts.currentEs },
    include: {
      model: Models.Candidate,
      include: [{
        model: Models.Experience,
        as: 'experiences',
        include: [{
          model: Models.Service,
          as: 'service',
          attributes: ['id', 'name']
        }, {
          model: Models.Post,
          as: 'poste',
          attributes: ['id', 'name']
        }]
      }, {
        model: Models.User,
        attributes: { exclude: ['password', 'type', 'role', 'email'] },
        on: {
          '$Candidate.user_id$': {
            [Op.col]: 'Candidate->User.id'
          }
        },
        required: true
      }, {
        model: Models.Application,
        as: 'applications',
        attributes: { exclude: ['lat', 'lon'] },
        where: { es_id: req.user.opts.currentEs },
        required: true,
        on: {
          '$Candidate.id$': {
            [Op.col]: 'Candidate->applications.candidate_id'
          }
        },
        include: {
          model: Models.Establishment,
          attributes: ['id'],
          on: {
            '$Candidate->applications.es_id$': {
              [Op.col]: 'Candidate->applications->Establishment.id'
            }
          }
        }
      }]
    }
  };

  if (req.params.type === 'favorites') {
    model = Models.FavoriteCandidate;
  } else if (req.params.type === 'archived') {
    model = Models.ArchivedCandidate;
  } else {
    return next(new BackError('Wrong url parameter', 403));
  }
  model.findAll(query).then(candidates => {
    return res.status(httpStatus.OK).send({ candidates, type: req.params.type });
  }).catch(error => next(new BackError(error)));
};

Establishment_Application.getCandidates = (req, res, next) => {
  let { filterQuery } = req.body;
  let query = {
    attributes: { exclude: ['updatedAt', 'createdAt'] },
    order: Sequelize.literal('`User.createdAt` DESC'),
    include: [{
      model: Models.Experience,
      as: 'experiences',
      include: [{
        model: Models.Service,
        as: 'service',
        attributes: ['id', 'name']
      }, {
        model: Models.Post,
        as: 'poste',
        attributes: ['id', 'name']
      }]
    }, {
      model: Models.CandidateFormation,
      as: 'formations',
    }, {
      model: Models.User,
      attributes: { exclude: ['password', 'type', 'role', 'email'] },
      on: {
        '$Candidate.user_id$': {
          [Op.col]: 'User.id'
        }
      },
      required: true
    }, {
      model: Models.Application,
      as: 'applications',
      attributes: { exclude: ['lat', 'lon'] },
      where: { es_id: req.user.opts.currentEs },
      required: true,
      on: {
        '$Candidate.id$': {
          [Op.col]: 'applications.candidate_id'
        }
      },
      include: [{
        model: Models.Wish,
        required: true,
        on: {
          '$applications.wish_id$': {
            [Op.col]: 'applications->Wish.id'
          }
        },
        where: {
          [Op.col]: Sequelize.where(Sequelize.fn('lower', Sequelize.col('posts')), {
            [Op.like]: `%${req.body.post.toLowerCase()}%`
          }),
        }
      }, {
        model: Models.Establishment,
        attributes: ['id'],
        on: {
          '$applications.es_id$': {
            [Op.col]: 'applications->Establishment.id'
          }
        },
        include: [{
          model: Models.FavoriteCandidate,
          attributes: ['added_by', 'candidate_id'],
          on: {
            '$applications->Establishment.id$': {
              [Op.col]: 'applications->Establishment->FavoriteCandidates.es_id'
            },
            '$Candidate.id$': {
              [Op.col]: 'applications->Establishment->FavoriteCandidates.candidate_id'
            }
          },
          include: {
            model: Models.User,
            attributes: ['firstName', 'lastName'],
            on: {
              '$applications->Establishment->FavoriteCandidates.added_by$': {
                [Op.col]: 'applications->Establishment->FavoriteCandidates->User.id'
              }
            }
          }
        }, {
          model: Models.ArchivedCandidate,
          attributes: ['added_by', 'candidate_id'],
          on: {
            '$applications->Establishment.id$': {
              [Op.col]: 'applications->Establishment->ArchivedCandidates.es_id'
            },
            '$Candidate.id$': {
              [Op.col]: 'applications->Establishment->ArchivedCandidates.candidate_id'
            },
            '$applications->Establishment->ArchivedCandidates.added_by$': req.user.id
          },
        }]
      }]
    }]
  };

  if (!_.isNil(filterQuery.contractType)) query.include[3].include[0].where.contract_type = filterQuery.contractType;
  if (!_.isNil(filterQuery.is_available)) {
    query.where = {
      [Op.and]: [
        Sequelize.literal('`Candidate`.`is_available` = ' + `${filterQuery.is_available === 'true' ? '1' : '0'}`)
      ]
    };
  }
  if (!_.isNil(filterQuery.lastName)) {
    query.where[1] = {
      [Op.and]: [
        Sequelize.literal('`Candidate->User`.`lastName` REGEXP\'(' + filterQuery.lastName + ')\'')
      ]
    };
  }
  if (!_.isNil(filterQuery.serviceId)) {
    query.include[0].required = true;
    query.include[0].where = { service_id: filterQuery.serviceId };
  }
  if (!_.isNil(filterQuery.diploma)) {
    query.include[1].required = true;
    query.include[1].where = {
      name: { [Op.regexp]: filterQuery.diploma }
    };
  }
  if (!_.isNil(filterQuery.postal_code)) {
    query.include[1].where = {
      postal_code: { [Op.startsWith]: filterQuery.postal_code }
    };
  }

  Models.Candidate.findAll(query).then(candidates => {
    return res.status(200).send(candidates);
  }).catch(error => next(new BackError(error)));
};

module.exports = Establishment_Application;