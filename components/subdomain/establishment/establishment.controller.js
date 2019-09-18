const __ = process.cwd();
const { _ } = require('lodash');
const { Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);

const Models = require(`${__}/orm/models/index`);

const Establishment_Website = {};

Establishment_Website.ViewIndex = (req, res, next) => {
  Models.Need.findAll({
    where: {
      es_id: res.locals.es.id
    },
    include: [
      {
        model: Models.Offer,
        on: {
          need_id: '$Need.id$',
          es_id: res.locals.es.id
        },
        require: false
      }
    ]
  })
    .then(needs => {
      console.log(needs);
      return res.render('subdomain/establishment', {
        needs: needs,
        hasGroup: res.locals.es.EstablishmentGroups && res.locals.es.EstablishmentGroups.length == 1,
        layout: 'subdomain',
        pageName: 'subdomain-establishment',
        layoutName: 'subdomain'
      });
    }).catch( error => next(new BackError(error)));
};

Establishment_Website.find = (id, next) => {
  Models.Establishment.findOne({
    where: { id },
    include: [
      {
        model: Models.Offer,
        as: 'offers',
        on: {
          '$Establishment.id$': {
            [Op.col]: 'offers.es_id'
          },
        }
      },
      {
        model: Models.EstablishmentReference,
        as: 'ref',
        on: {
          '$Establishment.finess$': {
            [Op.col]: 'ref.finess_et'
          },
        }
      }
    ]
  }).then(es => {
    if (_.isNil(es)) return new BackError('Établissement introuvable', 403);
    next(es);
  }).catch( error => next(new BackError(error)));
};

Establishment_Website.ShowOffer = (req, res, next) => {
  return res.render('subdomain/offer', {
    layout: 'subdomain',
    pageName: 'subdomain-establishment-offer',
    layoutName: 'subdomain'
  });
  /*Models.Offer.findOne({
    where: { id: req.params.id }
  })
    .then((offer) => {
      return res.render('subdomain/offer', { offer: offer });
    }).catch(error => next(new Error(error)));*/
};

Establishment_Website.ViewATS = (req, res, next) => {
  return res.render('establishments/site/ats/index', { es: req.session.es.finess, layout: 'onepage' })
};

Establishment_Website.ViewRegister = (req, res, next) => {
  return res.render('users/register', { layout: 'onepage' })
};

Establishment_Website.GetPosts = (req, res, next) => {
  Models.Post.findAll().then( posts => {
    res.status(200).send(posts);
  }).catch(error => next(new Error(error)));
};

Establishment_Website.GetServices = (req, res, next) => {
  Models.Service.findAll().then( services => {
    res.status(200).send(services);
  }).catch(error => next(new Error(error)));
};

Establishment_Website.GetAtsDatas = (req, res, next) => {
  let datas = {};
  Models.Post.findAll().then(posts => {
    datas.posts = posts;
    return Models.Service.findAll();
  }).then(services => {
    datas.services = services;
    return Models.Formation.findAll();
  }).then(formations => {
    datas.diplomas = formations;
    return Models.Qualification.findAll();
  }).then(qualifications => {
    datas.qualifications = qualifications;
    return Models.Skill.findAll();
  }).then( skills => {
    datas.skills = skills;
    res.status(200).send(datas);
  }).catch(error => next(new BackError(error)));
};

module.exports = Establishment_Website;