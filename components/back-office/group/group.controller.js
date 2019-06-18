const __ = process.cwd();
const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');
const crypto = require('crypto');

const Models = require(`${__}/orm/models/index`);
const layout = 'admin';

const BackOffice_Group = {};

BackOffice_Group.EditLinkES = (req, res, next) => {
  if (!req.body.selectInput || !req.params.id) {
    return res.status(400).json({ status: 'invalid input' })
  }
  return Models.EstablishmentGroups.findAll({ where: { id_group: req.params.id } }).then(esGroup => {
    if (esGroup.length !== 0) {
      Models.EstablishmentGroups.destroy({ where: { id_group: req.params.id } });
    }
    for (let i = 0; i < req.body.selectInput.length; i++) {
      Models.EstablishmentGroups.create({
        id_es: req.body.selectInput[i],
        id_group: req.params.id
      }).then(res.status(200))
    }
    return res.status(200).json({ status: 'ok' });
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

BackOffice_Group.EditGroup = (req, res, next) => {
  return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
    let error = null;
    Models.Subdomain.findOne({ where: { group_id: group.id } }).then(groupSubdomain => {
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
              Models.Subdomain.create({
                name: savedGroup.domain_name,
                enable: savedGroup.domain_enable,
                group_id: savedGroup.id
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

BackOffice_Group.AddGroup = (req, res, next) => {
  return Models.Groups.findOrCreate({
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

BackOffice_Group.RemoveGroup = (req, res, next) => {
  return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
    if (!group) return res.status(400).send({ body: req.body, error: 'This group does not exist' });
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

BackOffice_Group.addUserGroup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

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
      Models.UsersGroups.findOrCreate({
        where: {
          user_id: user.id,
          id_group: req.params.id
        },
        defaults: {
          role: req.body.role,
        }
      }).spread((group, groupCreated) => {
        if (created) {
          /*mailer.sendEmail({
            to: user.email,
            subject: 'Bienvenue sur Mstaff !',
            template: 'es/new_user',
            context: { user }
          });*/
          return res.status(201).json({ status: 'Created and added to group', user, group });
        } else {
          if (groupCreated) return res.status(201).json({ status: 'Added to group', user, group });
          return res.status(200).json({ status: 'Already exists', user, group });
        }
      });
    });
  } catch (errors) {
    return next(new BackError(errors));
  }
};

BackOffice_Group.getUsersFromGroup = (req, res, next) => {
  Models.UsersGroups.findAll({
    where: { id_group: req.params.id },
    attributes: ['role'],
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

BackOffice_Group.removeUserGroup = (req, res, next) => {
  return Models.UsersGroups.findOne({ where: { id_group: req.params.id, user_id: req.params.userId } }).then(groupUser => {
    if (!groupUser) return res.status(400).send({ body: req.body, error: 'User is not in this group.' });
    return groupUser.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.editUserGroup = (req, res, next) => {
  return Models.UsersGroups.findOne({ where: { id_group: req.params.id, user_id: req.params.userId } }).then(groupUser => {
    groupUser.update({ role: req.body.role }).then(savedUserGroup => {
      return res.status(201).json({ status: 'Modified user group role' });
    }).catch(error => next(new BackError(error)));
  })
};

BackOffice_Group.ViewSuperGroups = (req, res) => {
  return Models.SuperGroups.findAll().then(superGroup => {
    res.render('back-office/users/list_supergroups', {
      layout, superGroup, a: { main: 'users', sub: 'superGroups' }
    })
  });
};

BackOffice_Group.EditSuperGroup = (req, res, next) => {
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

BackOffice_Group.AddSuperGroup = (req, res, next) => {
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

BackOffice_Group.RemoveSuperGroup = (req, res, next) => {
  return Models.SuperGroups.findOne({ where: { id: req.params.id } }).then(superGroup => {
    if (!superGroup) return res.status(400).send({ body: req.body, error: 'This super group does not exist' });
    return superGroup.destroy().then(data => res.status(201).send({ deleted: true, data }));
  }).catch(error => next(new BackError(error)));
};

BackOffice_Group.getGroupLinksList = (req, res, next) => {
  Models.GroupsSuperGroups.findAll({ where: { id_super_group: req.params.id } }).then(linkgroup => {
    res.status(200).send({ linkgroup });
  }).catch(error => next(new BackError(error)));
};

module.exports = BackOffice_Group;