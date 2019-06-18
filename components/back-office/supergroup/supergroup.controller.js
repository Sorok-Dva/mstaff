const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_SuperGroup = {};

BackOffice_SuperGroup.View = (req, res) => {
  return Models.SuperGroups.findAll().then(superGroup => {
    res.render('back-office/users/list_supergroups', {
      layout, superGroup, a: { main: 'users', sub: 'superGroups' }
    })
  });
};

BackOffice_SuperGroup.Edit = (req, res, next) => {
  return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
    let error = null;
    Models.Subdomain.findOne({ where: { super_group_id: superGroup.id } }).then(SGSubdomain => {
      Models.Subdomain.findOne({ where: { name: req.body.domain_name } }).then(subCheck => {
        let subSGExist = !_.isNil(SGSubdomain);
        let subCheckOk = false;
        if (!_.isNil(subCheck) && subSGExist) {
          if (SGSubdomain.es_id !== subCheck.es_id) {
            error = 'Ce sous domaine est déjà utilisé.';
            req.body.domaine_name = SGSubdomain.domain_name;
          } else subCheckOk = true
        } else subCheckOk = true;

        superGroup.update({
          name: req.body.name,
          domain_enable: parseInt(req.body.domain_enable),
          domain_name: req.body.domain_name,
          logo: req.body.logo,
          banner: req.body.banner,
        }).then(savedSG => {
          if (subCheckOk) {
            if (subSGExist) {
              SGSubdomain.update({
                name: savedSG.domain_name,
                enable: savedSG.domain_enable
              }).catch(error => next(new BackError(error)));
            } else {
              Models.Subdomain.create({
                name: savedSG.domain_name,
                enable: savedSG.domain_enable,
                super_group_id: savedSG.id
              })
            }
            return res.status(200).json({ status: 'Modified', error });
          } else {
            return res.status(200).json({ status: 'Modified', error });
          }
        });
      })
    })
  })
};

BackOffice_SuperGroup.Add = (req, res, next) => {
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
};

BackOffice_SuperGroup.Remove = (req, res, next) => {
  return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
    if (!superGroup) return res.status(400).send({ body: req.body, error: 'This super group does not exist' });
    return superGroup.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

module.exports = BackOffice_SuperGroup;