const __ = process.cwd();
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const { mkdirIfNotExists } = require(`${__}/helpers/helpers`);
const httpStatus = require('http-status');
const fs = require('fs');

const Models = require(`${__}/orm/models/index`);

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
    return res.render('establishments/job_board/showOffer', render);
  }).catch(error => next(new BackError(error)));
};

Establishment_Offer.Edit = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  Models.Offer.update({
    name: req.body.name || 'Offre sans nom',
    nature_section: req.body.nature_section,
    context_section: req.body.context_section,
    details_section: req.body.details_section,
    postDescription_section: req.body.postDescription_section,
    prerequisites_section: req.body.prerequisites_section,
    terms_sections: req.body.terms_sections,
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
    include: [{
      model: Models.Establishment,
      attributes: ['name', 'town', 'address', 'url', 'logo'],
      required: true
    }, {
      model: Models.JobSheet,
      on: {
        '$Need.post$': {
          [Op.col]: 'JobSheet.name'
        }
      }
    }]
  }).then(need => {
    if (_.isNil(need)) return next(new BackError(`Besoin ${req.params.needId} introuvable.`, httpStatus.NOT_FOUND));
    if (_.isNil(need.JobSheet)) need.JobSheet = {};
    Models.Offer.create({
      name: need.name,
      need_id: need.id,
      es_id: need.es_id,
      nature_section: {
        post: _.isNil(need.post) ? '' : need.post,
        contract_type: _.isNil(need.contract_type) ? '' : need.contract_type,
        start: _.isNil(need.start) ? '' : need.start,
        end: _.isNil(need.end) ? '' : need.end,
        jobSheet: _.isNil(need.JobSheet.description) ? '' : need.JobSheet.description,
        contractDuration: '',
        grade: '',
        category: ''
      },
      context_section: {
        place: _.isNil(need.Establishment.name) ? '' : need.Establishment.name,
        address: _.isNil(need.Establishment.town) ? '' : need.Establishment.address + ' ' + need.Establishment.town,
        website: _.isNil(need.Establishment.url) ? '' : need.Establishment.url,
        logo: _.isNil(need.Establishment.logo) ? '' : need.Establishment.logo,
        attach: '',
        pole: '',
        presentation: ''
      },
      details_section: {
        schedule: '',
        roll: '',
        quota: '',
        strain: '',
        access: '',
        housing: '',
        remuneration: '',
        risk: ''
      },
      postDescription_section: {
        presentation: '',
        team: '',
        uphill: '',
        backing: '',
        external: '',
        internal: '',
        internService: ''
      },
      prerequisites_section: {
        diploma: '',
        skill: '',
        knowledge: ''
      },
      terms_sections: {
        recruit: '',
        mail: '',
        contractual: '',
        military: ''
      },
      status: 'draft',
      createdBy: req.user.id
    }).then(offer => {
      req.flash('success_msg', `Offre ajoutée avec succès.`);
      res.status(201).send({ status: 'created', offer });
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
};

Establishment_Offer.UploadLogo = (req, res, next) => {
  if (!['add', 'delete'].includes(req.params.action)) return res.status(400).send('Wrong method.');
  let logo = { filename: null };
  if (req.params.action === 'add') {
    if (Object.keys(req.file).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    if (!['jpeg', 'jpg', 'png'].includes(req.file.mimetype.split('/')[1])) {
      return res.status(400).send('Mauvais format, seul les formats jpeg, jpg et png sont autorisés.');
    }
    logo = req.file;
  }

  Models.Offer.findOne({ where: { id: req.params.id } }).then(offer => {
    if (_.isNil(offer)) return next(new BackError('Offre introuvable', 404));
    if (!_.isNil(offer.context_section.logo)) {
      mkdirIfNotExists(`${__}/public/uploads/es/offers`);
      if (fs.existsSync(`${__}/public${offer.context_section.logo}`)) {
        fs.unlinkSync(`${__}/public${offer.context_section.logo}`)
      }
    }
    let { context_section } = offer;
    context_section.logo = '/uploads/es/offers/' + logo.filename;
    offer.context_section = context_section;
    offer.save().then(() => {
      if (req.xhr) {
        return res.status(200).send({ result: 'saved', logo: context_section.logo });
      } else {
        return res.redirect(`/job_board/offer/${offer.id}`);
      }
    })
  });
};


module.exports = Establishment_Offer;
