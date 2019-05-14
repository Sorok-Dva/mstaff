const __ = process.cwd();
const { _ } = require('lodash');
const { Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);

const Subdomain_Group = {};

Subdomain_Group.ViewIndex = (req, res, next) => {
  return res.render('subdomain/group', { layout: 'subdomain' })
};

Subdomain_Group.find = (id, next) => {
  return Models.Groups.findOne({
    where: { id },
    include: {
      model: Models.Establishment,
      as: 'es',
      include: {
        model: Models.EstablishmentReference,
        as: 'ref',
        on: {
          'finess_et': {
            [Op.col]: 'es.finess'
          }
        },
        attributes: ['lat', 'lon', 'finess_et']
      }
    }
  }).then( group => {
    if (_.isNil(group)) return new BackError('Groupe introuvable', 403);
    else next(group);
  }).catch(error => next(new Error(error)));
};

module.exports = Subdomain_Group;