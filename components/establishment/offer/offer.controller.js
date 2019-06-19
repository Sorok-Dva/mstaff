const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { Op, Sequelize } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const Notification = require(`${__}/components/notification`);
const moment = require('moment');
const httpStatus = require('http-status');

const mailer = require(`${__}/bin/mailer`);
const Models = require(`${__}/orm/models/index`);
const Mailer = require(`${__}/components/mailer`);

const Establishment_Offer = {};

Establishment_Offer.ViewAll = (req, res, next) => {
  Models.Offer.findAll({
    where: { es_id: req.user.opts.currentEs },
    order: [['createdAt', 'DESC']],
  }).then(offers => {
    res.render('establishments/offers', { offers, a: { main: 'offers' } });
  }).catch(error => next(new BackError(error)));
};

Establishment_Offer.View = (req, res, next) => {
  let render = { a: { main: 'offers' } };
  Models.Offer.findOne({
    where: { id: req.params.id, es_id: req.user.opts.currentEs },
    include: {
      model: Models.Establishment,
      required: true
    }
  }).then(offer => {
    if (_.isNil(offer)) return next(new BackError(`Offre ${req.params.id} introuvable.`, httpStatus.NOT_FOUND));
    render.offer = offer;
    return res.render('establishments/showOffer', render);
  }).catch(error => next(new BackError(error)));
};

Establishment_Offer.Edit = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  Models.Offer.update({
    name: req.body.name || 'Offre sans nom',
  }, {
    where: { id: req.body.id }
  }).then(offer => {
    req.flash('success_msg', `Offre modifiée avec succès.`);
    res.status(201).send({ offer, status: 'updated' });
  });
};

Establishment_Offer.Delete = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  Models.Offer.findOne({
    where: { id: req.params.id, createdBy: req.user.id }
  }).then(offer => {
    if (_.isNil(offer)) return next(new BackError('Offre introuvable.', 404));
    return offer.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => new BackError(error));
};

Establishment_Offer.Create = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  Models.Need.findOne({
    where: { id: req.params.needId, es_id: req.user.opts.currentEs },
    include: {
      model: Models.Establishment,
      required: true
    }
  }).then(need => {
    if (_.isNil(need)) return next(new BackError(`Besoin ${req.params.needId} introuvable.`, httpStatus.NOT_FOUND));
    Models.Offer.create({
      name: need.name,
      need_id: need.id,
      es_id: need.es_id,
      nature_section: {
        contract_type: _.isNil(need.contract_type) ? '' : need.contract_type,
        start: _.isNil(need.start) ? '' : need.start,
        end: _.isNil(need.end) ? '' : need.end,
      },
      context_section: {
        place: _.isNil(need.Establishment.name) ? '' : need.Establishment.name,
        address: _.isNil(need.Establishment.town) ? '' : need.Establishment.address + ' ' + need.Establishment.town,
        website: _.isNil(need.Establishment.url) ? '' : need.Establishment.url,
        logo: _.isNil(need.Establishment.logo) ? '' : need.Establishment.logo,
      },
      status: 'draft',
      createdBy: req.user.id
    }).then(offer => {
      req.flash('success_msg', `Offre ajoutée avec succès.`);
      res.status(201).send({ status: 'created', offer });
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));

};


module.exports = Establishment_Offer;