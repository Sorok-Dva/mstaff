const __ = process.cwd();
const { BackError } = require(`${__}/helpers/back.error`);
const { Op, Sequelize } = require('sequelize');

const Models = require(`${__}/orm/models/index`);

const Establishment_Website = {};

Establishment_Website.ViewIndex = (req, res, next) => {
  Models.Establishment.findOne({
    where: {
      finess: req.es.finess
    },
    include: [
      {
        model: Models.EstablishmentGroups,
        include: [
          {
            model: Models.Groups,
            as: 'Group',
            on: {
              '$EstablishmentGroups.id_group$': { [ Op.col ]: 'EstablishmentGroups->Group.id' }
            }
          }
        ]
      }
    ]
  }).then(ref => {
    let hasGroup = ref.EstablishmentGroups && ref.EstablishmentGroups.length == 1;
    return res.render('subdomain/establishment', {
      ref,
      hasGroup: hasGroup,
      layout: 'subdomain',
      pageName: 'subdomain-establishment',
      layoutName: 'subdomain'
    })
  }).catch(err => {
    console.log(err);
  })
};

Establishment_Website.ViewATS = (req, res, next) => {
  return res.render('establishments/site/ats/index', { es: req.es.finess, layout: 'onepage' })
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