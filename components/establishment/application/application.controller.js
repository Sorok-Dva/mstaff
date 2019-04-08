const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment_Application = {};

Establishment_Application.getCVs = (req, res, next) => {
  let query = {
    where: { es_id: req.session.currentEs },
    attributes: { exclude: ['lat', 'lon'] },
    group: ['Wish.candidate_id'],
    include: [{
      model: Models.Wish,
      required: true,
      on: {
        '$Application.wish_id$': {
          [Op.col]: 'Wish.id'
        }
      },
      include: {
        model: Models.Candidate,
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        required: true,
        include: [{
          model: Models.User,
          attributes: { exclude: ['password', 'type', 'role', 'email', 'updatedAt', 'createdAt'] },
          on: {
            '$Wish->Candidate.user_id$': {
              [Op.col]: 'Wish->Candidate->User.id'
            }
          },
          required: true
        }]
      }
    }, {
      model: Models.Establishment,
      attributes: ['id'],
      on: {
        '$Application.es_id$': {
          [Op.col]: 'Establishment.id'
        }
      },
      include: [{
        model: Models.FavoriteCandidate,
        attributes: ['added_by', 'candidate_id'],
        on: {
          '$Establishment.id$': {
            [Op.col]: 'Establishment->FavoriteCandidates.es_id'
          },
          '$Wish->Candidate.id$': {
            [Op.col]: 'Establishment->FavoriteCandidates.candidate_id'
          }
        },
        include: {
          model: Models.User,
          attributes: ['firstName', 'lastName'],
          on: {
            '$Establishment->FavoriteCandidates.added_by$': {
              [Op.col]: 'Establishment->FavoriteCandidates->User.id'
            }
          }
        }
      }, {
        model: Models.ArchivedCandidate,
        attributes: ['added_by', 'candidate_id'],
        on: {
          '$Establishment.id$': {
            [Op.col]: 'Establishment->ArchivedCandidates.es_id'
          },
          '$Wish->Candidate.id$': {
            [Op.col]: 'Establishment->ArchivedCandidates.candidate_id'
          },
        },
        where: {
          'added_by': req.user.id
        }
      }]
    }]
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
    Models.Application.findAll(query).then(applications => {
      render.candidates = applications;
      return res.render('establishments/addNeed', render);
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
};

Establishment_Application.getCandidates = (req, res, next) => {
  let { filterQuery } = req.body;
  let query = {
    where: { es_id: filterQuery.establishments },
    attributes: { exclude: ['lat', 'lon'] },
    group: ['Wish->Candidate.id'],
    include: [{
      model: Models.Wish,
      required: true,
      on: {
        '$Application.wish_id$': {
          [Op.col]: 'Wish.id'
        }
      },
      where: {
        [Op.col]: Sequelize.where(Sequelize.fn('lower', Sequelize.col('posts')), {
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
          model: Models.CandidateFormation,
          as: 'formations',
        }]
      }
    }, {
      model: Models.Establishment,
      attributes: ['id'],
      on: {
        '$Application.es_id$': {
          [Op.col]: 'Establishment.id'
        }
      },
      include: [{
        model: Models.FavoriteCandidate,
        attributes: ['added_by', 'candidate_id'],
        on: {
          '$Establishment.id$': {
            [Op.col]: 'Establishment->FavoriteCandidates.es_id'
          },
          '$Wish->Candidate.id$': {
            [Op.col]: 'Establishment->FavoriteCandidates.candidate_id'
          }
        },
        include: {
          model: Models.User,
          attributes: ['firstName', 'lastName'],
          on: {
            '$Establishment->FavoriteCandidates.added_by$': {
              [Op.col]: 'Establishment->FavoriteCandidates->User.id'
            }
          }
        }
      }, {
        model: Models.ArchivedCandidate,
        attributes: ['added_by', 'candidate_id'],
        on: {
          '$Establishment.id$': {
            [Op.col]: 'Establishment->ArchivedCandidates.es_id'
          },
          '$Wish->Candidate.id$': {
            [Op.col]: 'Establishment->ArchivedCandidates.candidate_id'
          }
        }, where: {
          'added_by': req.user.id
        }
      }]
    }]
  };

  if (!_.isNil(filterQuery.contractType)) query.include[0].where.contract_type = filterQuery.contractType;
  if (!_.isNil(filterQuery.service)) {
    query.include[0].where.services = {
      [Op.regexp]: Sequelize.literal(`'(${filterQuery.service})'`),
    };
  }
  if (!_.isNil(filterQuery.diploma)) {
    query.include[0].include.include[1].required = true;
    query.include[0].include.include[1].where = {
      name: { [Op.regexp]: filterQuery.diploma }
    };
  }

  Models.Application.findAll(query).then(applications => {
    return res.status(200).send(applications);
  }).catch(error => next(new BackError(error)));
};

module.exports = Establishment_Application;