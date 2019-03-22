const { validationResult } = require('express-validator/check');
const Models = require('../orm/models/index');
const layout = 'admin';

module.exports = {


  removeGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
      if (!group) return res.status(400).send({ body: req.body, error: 'This group does not exist' });
      return group.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getSuperGroups: (req, res) => {
    return Models.SuperGroups.findAll().then( superGroup => {
      res.render('back-office/users/list_supergroups', {
        layout, superGroup, a: { main: 'users', sub: 'superGroups' } })
    });
  },
  editSuperGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
      if (req.body.promptInput) {
        superGroup.name = req.body.promptInput;
      }
      superGroup.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addSuperGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.SuperGroups.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((superGroup, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', superGroup });
      } else {
        return res.status(200).json({ status: 'Already exists', superGroup });
      }
    })
  },
  removeSuperGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
      if (!superGroup) return res.status(400).send({ body: req.body, error: 'This super group does not exist' });
      return superGroup.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },

};