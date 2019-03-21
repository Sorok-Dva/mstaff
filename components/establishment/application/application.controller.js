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
    group: ['Wish->Candidate.id'],
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
        },
      }]
    }]
  };

  Models.Post.findAll().then(posts => {
    let render = { a: { main: 'candidates' } };
    render.posts = posts;
    Models.Application.findAll(query).then(applications => {
      render.candidates = applications;
      return res.render('establishments/addNeed', render);
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
}
;

Establishment_Application.getCandidates = (req, res, next) => {
  let query = {
    where: { ref_es_id: req.es.finess },
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
        },
      }]
    }]
  };

  Models.Application.findAll(query).then(applications => {
    return res.status(200).send(applications);
  }).catch(error => next(new BackError(error)));
};

module.exports = Establishment_Application;