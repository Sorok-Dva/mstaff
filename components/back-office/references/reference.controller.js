const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');
const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_References = {};

let allowedModels = ['categories', 'equipments', 'formations', 'posts', 'services', 'skills', 'softwares', 'qualifications'];

BackOffice_References.View = (req, res, next) => {
  if (!allowedModels.includes(req.params.type)) return next(new BackError(`Modèle non autorisé pour cette route.`, httpStatus.FORBIDDEN));
  let model = req.params.type === 'categories' ? 'MstaffCategories' : req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
  let datas = {};
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  switch (model) {
    case 'Post':
      Models[model].findAll().then(references => {
        datas.references = references;
        return Models.CategoriesPostsServices.findAll().then( categories => {
          datas.categories = categories;
          res.render(`back-office/references/${req.params.type}`, {
            layout, datas, a: { main: 'references', sub: req.params.type } })
        })
      });
      break;
    default:
      return Models[model].findAll().then(references => {
        res.render(`back-office/references/${req.params.type}`, {
          layout, references, a: { main: 'references', sub: req.params.type } })
      });
  }
};

BackOffice_References.Add = (req, res, next) => {
  if (!allowedModels.includes(req.params.type)) return next(new BackError(`Modèle non autorisé pour cette route.`, httpStatus.FORBIDDEN));
  let model = req.params.type === 'categories' ? 'MstaffCategories' : req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
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

BackOffice_References.Edit = (req, res, next) => {
  let model = req.params.type === 'categories' ? 'MstaffCategories' : req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));

  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models[model].findOne({ where: { id: req.params.id } }).then(reference => {
    if (req.body.promptInput)
      reference.name = req.body.promptInput;
    if (req.body.category)
      reference.categoriesPS_id = req.body.category;
    reference.save();
    return res.status(200).json({ status: 'Modified' });
  })
};

BackOffice_References.Delete = (req, res, next) => {
  if (!allowedModels.includes(req.params.type)) return next(new BackError(`Modèle non autorisé pour cette route.`, httpStatus.FORBIDDEN));
  let model = req.params.type === 'categories' ? 'MstaffCategories' : req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1, -1);
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

  return Models[model].findOne({ where: { id: req.params.id } }).then(reference => {
    if (!reference) return res.status(400).send({ body: req.body, error: 'This reference does not exist' });
    return reference.destroy().then(data => {
      req.flash('success_msg', 'Référence supprimée aves succès.');
      res.status(201).send({ deleted: true, data })
    });
  }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
};

BackOffice_References.EditMulTipleCategory = (req, res, next) => {
  let category = parseInt(req.body.category);
  return Models.Post.update({ categoriesPS_id: category }, { where: { id: req.body.ids } }).then( res.status(200).json({ status: 'Modified' }) );
};

module.exports = BackOffice_References;