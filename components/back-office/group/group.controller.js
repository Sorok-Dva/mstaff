const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');
const crypto = require('crypto');
const { Op } = require('sequelize');
const mailer = require(`${__}/bin/mailer`);

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Group = {};

BackOffice_Group.GetLinkES = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(model)) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  let query = {};
  switch (model) {
    case 'group' : query.id_group = req.params.id; break;
    case 'supergroup' : query.id_super_group = req.params.id; break;
    default:
      return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
  }
  if (model === 'group') {
    Models.EstablishmentGroups.findAll({
      where: query,
      attributes: ['id_es'],
      include: [{
        model: Models.Establishment, as: 'es',
        attributes: ['name', 'finess'],
        required: true,
      }]
    }).then(esGroup => {
      return res.status(200).send(esGroup);
    }).catch(error => next(new BackError(error)));
  } else {
    Models.GroupsSuperGroups.findAll({
      where: query,
      attributes: ['id'],
      include: [{
        model: Models.Groups,
        attributes: ['id', 'name'],
        include: [{
          model: Models.EstablishmentGroups,
          attributes: ['id_es'],
          include: [{
            model: Models.Establishment, as: 'es',
            attributes: ['name', 'finess'],
            required: true,
          }]
        }]
      }]
    }).then(esGroupSuperGroup => {
      return res.status(200).send(esGroupSuperGroup);
    }).catch(error => next(new BackError(error)));
  }
};

BackOffice_Group.EditLinkES = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(model)) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  let query = { user_id: req.params.userId };
  let arrayBulk = [];

  if (model === 'group') {
    query.group_id = req.params.id; query.supergroup_id = null;
    req.body.es.forEach(element => {
      arrayBulk.push({ user_id: query.user_id, group_id: req.params.id, es_id: element });
    });
  } else if (model === 'supergroup') {
    query.supergroup_id = req.params.id;
    req.body.es.forEach(element => {
      let data = JSON.parse(element);
      arrayBulk.push({ user_id: query.user_id, group_id: data.group_id, supergroup_id: req.params.id, es_id: data.es_id });
    });
  } else {
    return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
  }

  Models.UsersGroups.destroy({ where: query }).then(() => {
    Models.UsersGroups.bulkCreate(arrayBulk).spread((group) => {
      return res.status(200).json({ status: 'Modified', group });
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.EditLinkGroup = (req, res, next) => {
  if (!req.body.selectInput || !req.params.id) {
    return res.status(400).json({ status: 'invalid input' })
  }
  return Models.GroupsSuperGroups.findAll({ where: { id_super_group: req.params.id } }).then(GroupSuperGroup => {
    if (GroupSuperGroup.length !== 0) {
      Models.GroupsSuperGroups.destroy({ where: { id_super_group: req.params.id } });
    }
    for (let i = 0; i < req.body.selectInput.length; i++) {
      Models.GroupsSuperGroups.create({
        id_group: req.body.selectInput[i],
        id_super_group: req.params.id
      })
    }
    return res.status(200).json({ status: 'ok' });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.ViewGroups = (req, res) => {
  return Models.Groups.findAll().then(group => {
    res.render('back-office/users/list_groups', {
      layout, group, a: { main: 'users', sub: 'Groups' }
    })
  });
};

BackOffice_Group.Edit = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  let query = {};

  return Models[model].findOne({ where: { id: req.params.id } }).then(group => {
    let error = null;
    switch (model) {
      case 'Groups' : query.group_id = group.id; break;
      case 'SuperGroups' : query.super_group_id = group.id; break;
      default:
        return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
    }
    Models.Subdomain.findOne({ where: query }).then(groupSubdomain => {
      Models.Subdomain.findOne({ where: { name: req.body.domain_name } }).then(subCheck => {
        let subGroupExist = !_.isNil(groupSubdomain);
        let subCheckOk = false;
        if (!_.isNil(subCheck) && subGroupExist) {
          if (groupSubdomain.es_id !== subCheck.es_id) {
            error = 'Ce sous domaine est déjà utilisé.';
            req.body.domaine_name = groupSubdomain.domain_name;
          } else subCheckOk = true
        } else subCheckOk = true;

        group.update({
          name: req.body.name,
          logo: req.body.logo,
          banner: req.body.banner,
          domain_enable: parseInt(req.body.domain_enable),
          domain_name: req.body.domain_name,
        }).then(savedGroup => {
          if (subCheckOk) {
            if (subGroupExist) {
              groupSubdomain.update({
                name: savedGroup.domain_name,
                enable: savedGroup.domain_enable,
              }).catch(error => next(new BackError(error)));
            } else {
              let query = { name: savedGroup.domain_name, enable: savedGroup.domain_enable };
              switch (model) {
                case 'Groups' : query.group_id = savedGroup.id; break;
                case 'SuperGroups' : query.super_group_id = savedGroup.id; break;
                default:
                  return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
              }
              Models.Subdomain.create(query);
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

BackOffice_Group.Add = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  if (model !== 'Groups' && model !== 'SuperGroups') return next(new BackError(`Modèle "${model}" non autorisé.`, httpStatus.NOT_FOUND));
  return Models[model].findOrCreate({
    where: {
      name: req.body.promptInput
    }
  }).spread((group, created) => {
    if (created) {
      return res.status(200).json({ status: 'Created', group });
    } else {
      return res.status(200).json({ status: 'Already exists', group });
    }
  })
};

BackOffice_Group.Remove = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(Models[model])) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  if (model !== 'Groups' && model !== 'SuperGroups') return next(new BackError(`Modèle "${model}" non autorisé.`, httpStatus.NOT_FOUND));
  return Models[model].findOne({ where: { id: req.params.id } }).then(group => {
    if (!group) return res.status(400).send({ body: req.body, error: 'This group/supergroup does not exist' });
    return group.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.ViewSuperGroups = (req, res) => {
  return Models.SuperGroups.findAll().then(superGroup => {
    res.render('back-office/users/list_supergroups', {
      layout, superGroup, a: { main: 'users', sub: 'superGroups' }
    })
  });
};

BackOffice_Group.addUser = (req, res, next) => {
  const errors = validationResult(req);
  let model = req.params.type;
  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });
  if (_.isNil(model)) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));

  try {
    Models.User.findOrCreate({
      where: { email: req.body.email },
      attributes: ['firstName', 'lastName', 'type', 'id'],
      defaults: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        password: 'TODEFINE',
        birthday: '1900-01-01 23:00:00',
        postal_code: '-',
        town: '-',
        type: 'es',
        key: crypto.randomBytes(20).toString('hex')
      }
    }).spread((user, created) => {
      if (!created && user.type !== 'es') return res.status(200).json({ status: 'Not an ES account', user });

      let arrayBulk = [];
      let query = { user_id: user.id };
      if (model === 'group') {
        query.group_id = req.params.id;
        query.supergroup_id = null;
        req.body.es.forEach(element => {
          arrayBulk.push({ user_id: user.id, group_id: req.params.id, supergroup_id: null, es_id: element, role: req.body.role });
        });
      } else if (model === 'supergroup') {
        query.supergroup_id = req.params.id;
        req.body.es.forEach(element => {
          let data = JSON.parse(element);
          arrayBulk.push({ user_id: user.id, group_id: data.group_id, supergroup_id: req.params.id, es_id: data.es_id, role: req.body.role });
        });
      }
      Models.UsersGroups.findOne({ where: query }).then( userInGroup => {
        if (userInGroup) return res.status(200).json({ status: 'Already exists', userInGroup });

        Models.UsersGroups.bulkCreate(arrayBulk).spread((group) => {
          if (created) {
            mailer.sendEmail({
              to: user.email,
              subject: 'Bienvenue sur Mstaff !',
              template: 'es/new_user',
              context: { user }
            });
            return res.status(201).json({ status: 'Created and added to group/supergroup', user, group });
          } else {
            if (group) return res.status(201).json({ status: 'Added to group/supergroup', user, group });
          }
        }).catch(error => next(new BackError(error)));
      }).catch(error => next(new BackError(error)));
    });
  } catch (errors) {
    return next(new BackError(errors));
  }
};

BackOffice_Group.getUsers = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(model)) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  let query = {};
  switch (model) {
    case 'group' : query.group_id = req.params.id; query.supergroup_id = null; break;
    case 'supergroup' : query.supergroup_id = req.params.id; break;
    default:
      return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
  }
  Models.UsersGroups.findAll({
    where: query,
    attributes: ['role'],
    group: ['user_id'],
    include: [{
      model: Models.User,
      attributes: ['id', 'firstName', 'lastName', 'email'],
      required: true,
    }]
  }).then(usersGroup => {
    if (_.isNil(usersGroup)) return next(new BackError(`Users in Group ${req.params.id} not found`, httpStatus.NOT_FOUND));
    return res.status(200).send(usersGroup);
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.getEsFromUser = (req, res, next) => {
  let model = req.params.type;
  if (_.isNil(model)) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  let query = {};
  switch (model) {
    case 'group' : query.group_id = req.params.id; query.user_id = req.params.user_id; query.supergroup_id = null; break;
    case 'supergroup' : query.supergroup_id = req.params.id; query.user_id = req.params.user_id; break;
    default:
      return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
  }
  Models.UsersGroups.findAll({
    where: query,
    attributes: ['es_id', 'supergroup_id', 'group_id']
  }).then( esUserGroup => {
    if (!esUserGroup) return res.status(400).send({ body: req.body, error: 'User no have linked ES in this group.' });
    return res.status(200).send(esUserGroup);
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.removeUser = (req, res, next) => {
  let query = { user_id: req.params.userId };
  let model = req.params.type;
  if (_.isNil(model)) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  switch (model) {
    case 'group' : query.group_id = req.params.id; query.supergroup_id = null; break;
    case 'supergroup' : query.supergroup_id = req.params.id; break;
    default:
      return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
  }
  return Models.UsersGroups.destroy({ where: query }).then(data => {
    res.status(201).send({ deleted: true, data });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.editUser = (req, res, next) => {
  let query = { user_id: req.params.userId };
  let model = req.params.type;
  if (_.isNil(model)) return next(new BackError(`Modèle "${model}" introuvable.`, httpStatus.NOT_FOUND));
  switch (model) {
    case 'group' : query.group_id = req.params.id; query.supergroup_id = null; break;
    case 'supergroup' : query.supergroup_id = req.params.id; break;
    default:
      return next(new BackError(`Modèle "${model}" non autorisé pour cette requête.`, httpStatus.NOT_FOUND));
  }
  return Models.UsersGroups.update(
    { role: req.body.role },
    { where: query }
  ).then(() => {
    return res.status(201).json({ status: 'Modified user group role' });
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.getGroupLinksList = (req, res, next) => {
  Models.GroupsSuperGroups.findAll({ where: { id_super_group: req.params.id } }).then(linkgroup => {
    res.status(200).send({ linkgroup });
  }).catch(error => next(new BackError(error)));
};

module.exports = BackOffice_Group;