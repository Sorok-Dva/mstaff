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
  return Models.EstablishmentGroups.findAll({
    where: { id_group: id },
    include: {
      model: Models.Establishment,
      as: 'es',
      on: {
        'id': {
          [Op.col]: 'id_es'
        }
      }
      /*include: {
        model: Models.EstablishmentReference,
        as: 'ref',
        on: {
          'finess_et': {
            [Op.col]: 'es.finess'
          }
        },
        attributes: ['lat', 'lon', 'finess_et']
      }*/
    }
  }).then( group => {
    group.es = [];
    group.forEach( item => {
      group.es.push(item.es);
    });
    if (_.isNil(group)) return new BackError('Groupe introuvable', 403);
    else next(group);
  }).catch(error => next(new Error(error)));
};

Subdomain_Group.ViewATS = (req, res, next) => {
  console.log(req.group.es);
  return res.render('establishments/site/ats/index', { es: req.group.finess, layout: 'onepage' })
};

module.exports = Subdomain_Group;