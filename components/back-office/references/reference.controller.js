const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_References = {};

BackOffice_References.View = (req, res, next) => {
  let model = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  return Models[model].findAll().then(references => {
    res.render(`back-office/references/${req.params.type}`, {
      layout, references, a: { main: 'references', sub: req.params.type } })
  });
};

BackOffice_References.ViewCategories = (req, res, next) => {
  return Models.MstaffCategories.findAll().then(categories => {
    res.render('back-office/references/categories', {
      layout,
      title: 'Catégories mstaff',
      categories,
      a: { main: 'references', sub: 'categories' },
    })
  });
};


BackOffice_References.Add = (req, res, next) => {
  let model = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models[model].findOrCreate({
    where: {
      name: req.body.promptInput
    }
  }).spread((reference, created) => {
    if (created) {
      return res.status(200).json({ status: 'Created', reference });
    } else {
      return res.status(200).json({ status: 'Already exists', reference });
    }
  })
};

BackOffice_References.AddCategory = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models.MstaffCategories.findOrCreate({
    where: {
      name: req.body.promptInput
    }
  }).spread((category, created) => {
    if (created) {
      return res.status(200).json({ status: 'Created', category });
    } else {
      return res.status(200).json({ status: 'Already exists', category });
    }
  })
};

BackOffice_References.Edit = (req, res, next) => {
  let model = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));

  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models[model].findOne({ where: { id: req.params.id } }).then(reference => {
    if (req.body.promptInput) {
      reference.name = req.body.promptInput;
    }
    reference.save();
    return res.status(200).json({ status: 'Modified' });
  })
};

BackOffice_References.EditCategory = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models.MstaffCategories.findOne({ where: { id: req.params.id } }).then ( category => {
    if (req.body.promptInput) {
      category.name = req.body.promptInput;
    }
    category.save();
    return res.status(200).json({ status: 'Modified' });
  })
};

BackOffice_References.Delete = (req, res, next) => {
  let model = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models[model].findOne({ where: { id: req.params.id } }).then(reference => {
    if (!reference) return res.status(400).send({ body: req.body, error: 'This reference does not exist' });
    return reference.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
};

BackOffice_References.DeleteCategory = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models.MstaffCategories.findOne({ where: { id: req.params.id } }).then ( category => {
    if (!category) return res.status(400).send({ body: req.body, error: 'This category does not exist' });
    return category.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
};
module.exports = BackOffice_References;