const __ = process.cwd();
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);

const Establishment = {};

Establishment.ViewAllGroups = (req, res, next) => {
  Models.UsersGroups.findAll({
    where: { user_id: req.user.id },
    include: [
      {
        model: Models.Establishment,
        attributes: ['name', 'logo', 'id']
      },
      {
        model: Models.Groups,
        attributes: ['name']
      },
      {
        model: Models.SuperGroups,
        attributes: ['name']
      }
    ]
  }).then(groupAccounts => {
    res.status(200).send({ groups: groupAccounts });
  }).catch(error => next(new BackError(error)));
};

Establishment.ViewAccounts = (req, res, next) => {
  Models.ESAccount.findAll({
    where: { user_id: req.user.id },
    include: {
      model: Models.Establishment,
      required: true
    }
  }).then(esAccounts => {
    res.render('establishments/selectEs', { esAccounts, a: { main: 'selectEs' } });
  }).catch(error => next(new BackError(error)));
};

Establishment.Select = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(model)) return next(new BackError(`Type "${model}" introuvable.`, httpStatus.NOT_FOUND));
  if (model === 'es')
    model = 'ESAccount';
  else if (model === 'group')
    model = 'UsersGroups';
  else
    return next(new BackError(`Type "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));

  Models[model].findOne({
    where: { user_id: req.user.id, es_id: req.params.currentEsId },
    include: {
      model: Models.Establishment,
      required: true
    }
  }).then(esAccount => {
    if (_.isNil(esAccount)) return next(new BackError('Compte établissement introuvable.', httpStatus.NOT_FOUND));
    Models.User.findOne({ where: { id: req.user.id }, attributes: ['id', 'opts'] }).then(user => {
      let { opts } = user;
      if (_.isNil(opts)) opts = {};
      if (!('currentEs' in opts)) opts.currentEs = esAccount.es_id;
      else opts.currentEs = esAccount.es_id;
      user.opts = opts;
      user.save().then(result => {
        return res.redirect('/candidates');
      });
    });
  }).catch(error => next(new BackError(error)));
};

Establishment.find = (id, next) => {
  Models.Establishment.findOne({
    where: { id },
    /*include: {
      model: Models.Offer,
      as: 'offers',
      where: { status: 'published' }
    }*/
  }).then(es => {
    if (_.isNil(es)) return new BackError('Établissement introuvable', 403);
    else next(es);
  })
};

module.exports = Establishment;
