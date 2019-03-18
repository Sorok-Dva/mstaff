const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const Models = require(`${__}/models/index`);
const layout = 'admin';

const BackOffice_Establishment = {};

BackOffice_Establishment.create = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  try {
    Models.Establishment.findOrCreate({
      where: { finess: req.body.finess_et },
      defaults: {
        name: req.body.name,
        finess_ej: req.body.finess_ej,
        siret: req.body.siret,
        phone: req.body.phone,
        address: req.body.address,
        town: req.body.addr_town,
        sector: req.body.sector,
        salaries_count: req.body.salaries_count,
        contact_identity: req.body.contactIdentity,
        contact_post: req.body.contactPost,
        contact_email: req.body.contactEmail,
        contact_phone: req.body.contactPhone,
        domain_enable: parseInt(req.body.domain_enable),
        domain_name: req.body.domain_name,
        logo: req.body.logo,
        banner: req.body.banner
      }
    }).spread((es, created) => {
      if (created) {
        Models.EstablishmentReference.findOne({
          where: { finess_et: es.finess }
        }).then(ref => {
          ref.es_id = es.id;
          ref.save();
          return res.status(200).json({ status: 'Created', es });
        }).catch(errors => next(new BackError(errors)));
      } else {
        return res.status(200).json({ status: 'Already exists', es });
      }
    })
  } catch (errors) {
    return next(new BackError(errors));
  }
};

BackOffice_Establishment.getRefList = (req, res, next) => {
  let where = _.isNil(req.query.search) ? null : {
    [Op.or]: [{
      name: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {
        [Op.like]: `%${req.query.search.toLowerCase()}%`
      })
    }, {
      finess_et: Sequelize.where(Sequelize.fn('lower', Sequelize.col('finess_et')), {
        [Op.like]: `%${req.query.search.toLowerCase()}%`
      })
    }, {
      address_town: Sequelize.where(Sequelize.fn('lower', Sequelize.col('address_town')), {
        [Op.like]: `%${req.query.search.toLowerCase()}%`
      })
    }],
  };
  Models.EstablishmentReference.findAll({ attributes: ['id'], where }).then(allEs => {
    Models.EstablishmentReference.findAll({
      where,
      attributes: [
        'id', 'name', 'finess_et', 'address_dpt_name', 'address_town',
        [Sequelize.literal(
          '(SELECT COUNT(*) FROM Applications WHERE `EstablishmentReference`.`finess_et` = `Applications`.`ref_es_id`)'
        ), 'applications']
      ],
      offset: _.isNaN(req.query.offset) ? 0 : parseInt(req.query.offset),
      limit: _.isNaN(req.query.limit) ? 100 : parseInt(req.query.limit),
      order: [[
        _.isNil(req.query.sort) ? 'id' : req.query.sort === 'applications' ? Sequelize.literal('applications') : req.query.sort,
        req.query.order
      ]]
    }).then(data => {
      res.status(200).send({ total: allEs.length, rows: data });
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.getRefInfo = (req, res, next) => {
  Models.EstablishmentReference.findOne({
    where: { id: req.params.id },
    include: {
      model: Models.Application,
      include: [{
        model: Models.Wish,
        required: true,
        on: {
          '$Applications.wish_id$': {
            [Op.col]: 'Applications->Wish.id'
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
              '$Applications->Wish->Candidate.user_id$': {
                [Op.col]: 'Applications->Wish->Candidate->User.id'
              }
            },
            required: true
          }]
        }
      }]
    }
  }).then(es => {
    if (_.isNil(es)) return next(new BackError(`Establishment ${req.params.id} not found`, httpStatus.NOT_FOUND));
    return res.status(200).send(es);
  }).catch(error => next(new BackError(error)));
};

BackOffice_Establishment.getRefInfoToCreate = (req, res, next) => {
  let transporter;
  Models.EstablishmentReference.findOne({
    where: { id: req.params.id },
  }).then(es => {
    if (_.isNil(es)) return next(new BackError(`Establishment ${req.params.id} not found`, httpStatus.NOT_FOUND));
    transporter = es;
    return Models.Establishment.findOne({ where: { finess: es.finess_et } });
  }).then(mstaffEs => {
    if (!_.isNil(mstaffEs))
      return next(new BackError(`Establishment with finess ${transporter.finess_et} already added in Mstaff.`, httpStatus.CONFLICT));
    return res.status(200).send(transporter);
  }).catch(error => next(new BackError(error)));
};

module.exports = BackOffice_Establishment;