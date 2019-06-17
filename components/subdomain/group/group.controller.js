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
  let render = {};
  return Models.Groups.findOne({
    where: { id },
  }).then(group => {
    if (_.isNil(group)) return new BackError('Groupe introuvable', 403);
    render.group = group;
    return Models.EstablishmentGroups.findAll({
      where: { id_group: group.id },
      include: {
        model: Models.Establishment,
        as: 'es',
        on: {
          '$EstablishmentGroups.id_es$': {
            [Op.col]: 'es.id'
          },
        },
        required: true,
        include: {
          model: Models.EstablishmentReference,
          as: 'ref',
          on: {
            '$es.finess$': {
              [Op.col]: 'es->ref.finess_et'
            },
          },
          attributes: ['lat', 'lon', 'finess_et'],
          required: true
        }
      }
    });
  }).then(links => {
    render.es = links;
    next(render)
  }).catch(error => next(new BackError(error)));
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