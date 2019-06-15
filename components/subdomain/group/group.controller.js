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
      model: Models.EstablishmentGroups,
      include: [{
        model: Models.Establishment,
        as: 'es',
        required: true,
        include: {
          model: Models.EstablishmentReference,
          as: 'ref',
          on: {
            '$EstablishmentGroups->es.finess$': {
              [Op.col]: 'EstablishmentGroups->es->ref.finess_et'
            },
          },
          attributes: ['lat', 'lon', 'finess_et'],
          required: true
        }
      }]
    }
  }).then( group => {
    if (_.isNil(group)) return new BackError('Groupe introuvable', 403);
    else next(group);
  }).catch(error => next(new Error(error)));
};

Subdomain_Group.ViewATS = (req, res, next) => {
  let esList = [];
  let esInfos = [];
  req.group.EstablishmentGroups.forEach( item => {
    esInfos.push({ name: item.es.name, finess: item.es.finess });
    esList.push(item.es.finess);
  });
  return res.render('establishments/site/ats/index', { es: esList, esInfos: JSON.stringify(esInfos), layout: 'onepage' })
};

module.exports = Subdomain_Group;