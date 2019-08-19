const __ = process.cwd();
const { validationResult } = require('express-validator');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const sequelize = require(`${__}/bin/sequelize`);
const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);

const Establishment_Reference = {};

Establishment_Reference.findByGeo = (req, res, next) => {
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
};

Establishment_Reference.findByCity = (req, res, next) => {
  return Models.EstablishmentReference.findAll({
    where: {
      [Op.or]: [
        { address_town: { [Op.like]: `%${req.params.city}%` } },
        { name: { [Op.like]: `%${req.params.city}%` } }
      ]
    }
  }).then( es => {
    return res.status(200).json(es);
  }).catch(error => next(new Error(error)));
};

module.exports = Establishment_Reference;