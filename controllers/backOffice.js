const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require('../helpers/back.error');
const httpStatus = require('http-status');
const _ = require('lodash');
const Models = require('../models/index');
const layout = 'admin';

const UserController = require('./user');
const discord = require('../bin/discord-bot');
const mailer = require('../bin/mailer');

const BackOffice = require('../components/back-office');

module.exports = {
  BackOffice,
  editSkill: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Skill.findOne({ where: { id: req.params.id } }).then(skill => {
      if (req.body.promptInput) {
        skill.name = req.body.promptInput;
      }
      skill.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addSkill: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Skill.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((skill, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', skill });
      } else {
        return res.status(200).json({ status: 'Already exists', skill });
      }
    })
  },
  removeSkill: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Skill.findOne({ where: { id: req.params.id } }).then(skill => {
      if (!skill) return res.status(400).send({ body: req.body, error: 'This skill does not exist' });
      return skill.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editFormation: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Formation.findOne({ where: { id: req.params.id } }).then(formation => {
      if (req.body.promptInput) {
        formation.name = req.body.promptInput;
      }
      formation.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addFormation: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Formation.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((formation, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', formation });
      } else {
        return res.status(200).json({ status: 'Already exists', formation });
      }
    })
  },
  removeFormation: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Formation.findOne({ where: { id: req.params.id } }).then(formation => {
      if (!formation) return res.status(400).send({ body: req.body, error: 'This formation does not exist' });
      return formation.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editEquipment: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Equipment.findOne({ where: { id: req.params.id } }).then(equipment => {
      if (req.body.promptInput) {
        equipment.name = req.body.promptInput;
      }
      equipment.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addEquipment: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Equipment.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((equipment, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', equipment });
      } else {
        return res.status(200).json({ status: 'Already exists', equipment });
      }
    })
  },
  removeEquipment: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Equipment.findOne({ where: { id: req.params.id } }).then(equipment => {
      if (!equipment) return res.status(400).send({ body: req.body, error: 'This equipment does not exist' });
      return equipment.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editSoftware: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Software.findOne({ where: { id: req.params.id } }).then(software => {
      if (req.body.promptInput) {
        software.name = req.body.promptInput;
      }
      software.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addSoftware: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Software.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((software, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', software });
      } else {
        return res.status(200).json({ status: 'Already exists', software });
      }
    })
  },
  removeSoftware: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Software.findOne({ where: { id: req.params.id } }).then(software => {
      if (!software) return res.status(400).send({ body: req.body, error: 'This software does not exist' });
      return software.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editService: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Service.findOne({ where: { id: req.params.id } }).then(service => {
      if (req.body.promptInput) {
        service.name = req.body.promptInput;
      }
      service.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addService: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Service.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((service, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', service });
      } else {
        return res.status(200).json({ status: 'Already exists', service });
      }
    })
  },
  removeService: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Service.findOne({ where: { id: req.params.id } }).then(service => {
      if (!service) return res.status(400).send({ body: req.body, error: 'This service does not exist' });
      return service.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editPost: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Post.findOne({ where: { id: req.params.id } }).then(post => {
      if (req.body.promptInput && req.body.categoryInput) {
        post.name = req.body.promptInput;
        post.categoriesPS_id = req.body.categoryInput;
      }
      post.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addPost: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Post.findOrCreate({
      where: {
        name: req.body.promptInput,
        categoriesPS_id: req.body.categoryInput
      }
    }).spread((post, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', post });
      } else {
        return res.status(200).json({ status: 'Already exists', post });
      }
    })
  },
  removePost: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Post.findOne({ where: { id: req.params.id } }).then(post => {
      if (!post) return res.status(400).send({ body: req.body, error: 'This post does not exist' });
      return post.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editQualification: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Qualification.findOne({ where: { id: req.params.id } }).then(qualification => {
      if (req.body.promptInput) {
        qualification.name = req.body.promptInput;
      }
      qualification.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addQualification: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Qualification.findOrCreate({
      where: {
        name: req.body.promptInput
      }
    }).spread((qualification, created) => {
      if (created) {
        return res.status(200).json({ status: 'Created', qualification });
      } else {
        return res.status(200).json({ status: 'Already exists', qualification });
      }
    })
  },
  getGroups: (req, res) => {
    return Models.Groups.findAll().then( group => {
      res.render('back-office/users/list_groups', {
        layout, group, a: { main: 'users', sub: 'Groups' } })
    });
  },
  editGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Groups.findOne({ where: { id: req.params.id } }).then(group => {
      if (req.body.promptInput) {
        group.name = req.body.promptInput;
      }
      group.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addGroups: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

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
  },
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
      if (!superGroup) return res.status(400).send({ body: req.body, error: 'This group does not exist' });
      return superGroup.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  removeQualification: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Qualification.findOne({ where: { id: req.params.id } }).then(qualification => {
      if (!qualification) return res.status(400).send({ body: req.body, error: 'This qualification does not exist' });
      return qualification.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editCandidate: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.User.findOne({ where: { id: req.params.id } }).then(user => {
      if (req.body.candidateId) {
        Models.Candidate.findOne({ where: { user_id: req.params.id } }).then(candidate => {
          candidate.description = req.body.description;
          candidate.save();
        });
      }
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.birthday = req.body.birthday;
      user.postal_code = req.body.postal_code;
      user.town = req.body.town;
      user.role = req.body.role;
      user.type = req.body.type;
      // user.phone = req.body.phone;
      user.save().then(() => {
        req.flash('success_msg', 'Informations sauvegardées.');
        return res.redirect('/back-office/users');
      });
    }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
  },
  sendCandidateVerifEmail: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    Models.User.findOne({
      where: { email: req.body.email },
      attributes: [ 'id', 'firstName', 'lastName', 'key' ]
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      mailer.sendEmail({
        to: req.body.email,
        subject: 'Création de votre compte sur Mstaff.',
        template: 'user/emailValidation',
        context: { user }
      });
      return res.status(200).send('Send')
    });
  },
  impersonateUser: (req, res) => {
    Models.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password'] }
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      discord(`**${req.user.fullName}** vient de se connecter en tant que **${user.dataValues.email}** sur Mstaff.`, 'infos');
      let originalUser = req.user.id;
      let originalRole = req.user.role;
      req.logIn(user, (err) => new Error(err));
      req.session.originalUser = originalUser;
      req.session.role = originalRole;
      req.session.readOnly = true;
      res.redirect('/');
    });
  },
  removeUserImpersonation: (req, res, next) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: { exclude: ['password'] }
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      delete req.session.originalUser;
      delete req.session.role;
      delete req.session.readOnly;
      discord(`**${user.dataValues.email}** vient de se déconnecter du compte de **${req.user.fullName}**.`, 'infos');
      req.logIn(user, (err) => next(new BackError(err)));
      res.redirect('/');
    });
  },
  impersonateRemoveReadOnly: (req, res) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: ['password']
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      UserController.comparePassword(req.body.password, user.dataValues.password, (err, isMatch) => {
        if (err) return res.status(200).json({ error: err });
        if (isMatch) {
          let pinCode = Math.floor(Math.random() * 90000) + 10000;
          req.session.pinCode = pinCode;
          discord(`***Admin Mstaff** vient de demander une suppression de la lecture seule sur le compte de ${req.user.fullName}.
           Code PIN : **${pinCode}***`, 'infos');
          return res.status(200).json({ status: 'send' });
        } else {
          return res.status(200).json({ error: 'invalid password' });
        }
      });
    });
  },
  impersonatePutReadOnly: (req, res) => {
    req.session.readOnly = true;
    discord(`*Lecture seule ré-activée sur le compte de ${req.user.fullName}.*`, 'infos');
    return res.status(200).json({ status: 'ok' });
  },
  impersonateRemoveReadOnlyValidation: (req, res) => {
    let authorized = false;
    if (req.session.pinCode === parseInt(req.body.pinCode)) {
      discord(`*Lecture seule désactivée sur le compte de ${req.user.fullName}.*`, 'infos');
      req.session.readOnly = false;
      delete req.session.pinCode;
      authorized = true;
    } else {
      discord(`*Désactivation de la lecture seule échouée : mauvais code pin.*`, 'infos');
    }
    return res.status(200).json({ authorized });
  }
};