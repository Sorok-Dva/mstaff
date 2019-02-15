const { check, validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const _ = require('lodash');
const moment = require('moment');
const Models = require('../models/index');
const layout = 'admin';

const UserController = require('./user');
const discord = require('../bin/discord-bot');

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {

  },
  index: (req, res) => {
    let render = { layout, title: 'Tableau de bord', a: { main: 'dashboard', sub: 'overview' } };
    Models.User.count().then(count => {
      render.usersCount = count;
      return Models.Candidate.count();
    }).then(count => {
      render.candidatesCount = count;
      return Models.Wish.count();
    }).then(count => {
      render.wishesCount = count;
      return Models.Establishment.count();
    }).then(count => {
      render.esCount = count;
      return Models.Establishment.findAll({
        attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
        where: {
          createdAt: {
            [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
          }
        },
        group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
      });
    }).then(data => {
      render.esWeekRegistration = data;
      return Models.User.findAll({
        attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
        where: {
          createdAt: {
            [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
          }
        },
        group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
      });
    }).then(data => {
      render.usersWeekRegistration = data;
      return Models.Wish.findAll({
        attributes: ['id', 'createdAt',  [Sequelize.fn('COUNT', 'id'), 'count']],
        where: {
          createdAt: {
            [Op.between]: [ moment().subtract(6, 'days')._d, new Date()]
          }
        },
        group: [Sequelize.fn('DAY', Sequelize.col('createdAt'))]
      });
    }).then(data => {
      render.wishesWeek = data;
      render.usersWeekCount = 0; render.ESWeekCount = 0; render.wishesWeekCount = 0;
      render.esWeekRegistration.map((data) => render.ESWeekCount += parseInt(data.dataValues.count));
      render.usersWeekRegistration.map((data) => render.usersWeekCount += parseInt(data.dataValues.count));
      render.wishesWeek.map((data) => render.wishesWeekCount += parseInt(data.dataValues.count));
      res.render('back-office/index', render);
    });
  },
  stats: (req, res) => res.render('back-office/stats', { layout, title: 'Statistiques', a: { main: 'dashboard', sub: 'stats' } }),
  getUsers: (req, res) => {
    Models.User.findAll({
      attributes: {
        exclude: ['password']
      }
    }).then(users => {
      res.render('back-office/users/list', {
        layout,
        title: 'Liste des utilisateurs (tout type confondu)',
        a: { main: 'users', sub: 'users_all' },
        users })
    });
  },
  getCandidates: (req, res) => {
    Models.User.findAll({
      where: {
        type: 'candidate'
      },
      include: [{
        model: Models.Candidate,
        as: 'candidate'
      }],
      attributes: {
        exclude: ['password']
      }
    }).then(users => {
      res.render('back-office/candidates/list', {
        layout,
        title: 'Liste des candidats',
        a: { main: 'users', sub: 'candidates' },
        users })
    });
  },
  getESUsers: (req, res, next) => {
    Models.User.findAll({
      where: { type: 'es' },
      attributes: { exclude: ['password'] },
      include: [{
        model: Models.ESAccount,
        required: true,
        include: {
          model: Models.Establishment,
          required: true
        }
      }]
    }).then(users => {
      res.render('back-office/es/users/list', {
        layout,
        title: 'Liste des utilisateurs ES',
        a: { main: 'users', sub: 'es' },
        users })
    }).catch(error => next(new Error(error)));
  },
  getESList: (req, res, next) => {
    Models.Establishment.findAll().then(data => {
      res.render('back-office/es/list', {
        layout,
        title: 'Liste des Établissements Mstaff',
        a: { main: 'es', sub: 'es_all' },
        data
      })
    }).catch(error => next(new Error(error)));
  },
  getES: (req, res, next) => {
    Models.Establishment.findOne({ where: { id: req.params.id } }).then(data => {
      if (_.isNil(data)) {
        req.flash('error', 'Cet établissement n\'existe pas.');
        return res.redirect('/back-office/es');
      }
      Models.Candidate.findAll({
        include: [{
          model: Models.Application,
          as: 'applications',
          required: true,
          where: {
            finess: data.dataValues.finess
          },
        }]
      }).then(candidates => {
        res.render('back-office/es/show', {
          layout,
          candidates,
          title: `Établissement ${data.dataValues.name}`,
          a: { main: 'es', sub: 'es_one' },
          data
        })
      });
    }).catch(error => next(new Error(error)));
  },
  getUser: (req, res) => {
    Models.User.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Models.Candidate,
        as: 'candidate'
      }],
      attributes: {
        exclude: ['password']
      }
    }).then(user => {
      if (_.isNil(user)) {
        req.flash('error', 'Cet utilisateur n\'existe pas.');
        return res.redirect('/back-office/users');
      }
      res.render('back-office/users/show', {
        layout,
        title: `Profil de ${user.dataValues.firstName} ${user.dataValues.lastName}`,
        a: { main: 'users', sub: 'profile' },
        user
      })
    });
  },
  getSkills: (req, res) => {
    return Models.Skill.findAll().then(skill => {
      res.render('back-office/references/skills', {
        layout, skill, a: { main: 'references', sub: 'skills' } })
    });
  },
  editSkill: (req, res, next) => {
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Skill.findOne({ where: { id: req.params.id } }).then(skill => {
      if (!skill) return res.status(400).send({ body: req.body, error: 'This skill does not exist' });
      return skill.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getFormations: (req, res) => {
    return Models.Formation.findAll().then( formation => {
      res.render('back-office/references/formations', {
        layout, formation, a: { main: 'references', sub: 'formations' } })
    });
  },
  editFormation: (req, res, next) => {
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Formation.findOne({ where: { id: req.params.id } }).then(formation => {
      if (!formation) return res.status(400).send({ body: req.body, error: 'This formation does not exist' });
      return formation.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getEquipments: (req, res) => {
    return Models.Equipment.findAll().then( equipment => {
      res.render('back-office/references/equipments', {
        layout, equipment, a: { main: 'references', sub: 'equipments' } })
    });
  },
  editEquipment: (req, res, next) => {
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Equipment.findOne({ where: { id: req.params.id } }).then(equipment => {
      if (!equipment) return res.status(400).send({ body: req.body, error: 'This equipment does not exist' });
      return equipment.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getSoftwares: (req, res) => {
    return Models.Software.findAll().then( software => {
      res.render('back-office/references/softwares', {
        layout, software, a: { main: 'references', sub: 'softwares' } })
    });
  },
  editSoftware: (req, res, next) => {
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Software.findOne({ where: { id: req.params.id } }).then(software => {
      if (!software) return res.status(400).send({ body: req.body, error: 'This software does not exist' });
      return software.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getServices: (req, res) => {
    return Models.Service.findAll().then( service => {
      res.render('back-office/references/services', {
        layout, service, a: { main: 'references', sub: 'services' } })
    });
  },
  editService: (req, res, next) => {
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Service.findOne({ where: { id: req.params.id } }).then(service => {
      if (!service) return res.status(400).send({ body: req.body, error: 'This service does not exist' });
      return service.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getPosts: (req, res) => {
    return Models.Post.findAll().then( post => {
      res.render('back-office/references/posts', {
        layout, post, a: { main: 'references', sub: 'posts' } })
    });
  },
  editPost: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Post.findOne({ where: { id: req.params.id } }).then(post => {
      if (req.body.promptInput) {
        post.name = req.body.promptInput;
      }
      post.save();
      return res.status(200).json({ status: 'Modified' });
    })
  },
  addPost: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Post.findOrCreate({
      where: {
        name: req.body.promptInput
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
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Post.findOne({ where: { id: req.params.id } }).then(post => {
      if (!post) return res.status(400).send({ body: req.body, error: 'This post does not exist' });
      return post.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  getQualifications: (req, res) => {
    return Models.Qualification.findAll().then( qualification => {
      res.render('back-office/references/qualifications', {
        layout, qualification, a: { main: 'references', sub: 'qualifications' } })
    });
  },
  editQualification: (req, res, next) => {
    const errors = validationResult(req.body);

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
    const errors = validationResult(req.body);

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
  removeQualification: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    return Models.Qualification.findOne({ where: { id: req.params.id } }).then(qualification => {
      if (!qualification) return res.status(400).send({ body: req.body, error: 'This qualification does not exist' });
      return qualification.destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  editCandidate: (req, res, next) => {
    const errors = validationResult(req.body);

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
  removeUserImpersonation: (req, res) => {
    Models.User.findOne({
      where: { id: req.session.originalUser },
      attributes: { exclude: ['password'] }
    }).then(user => {
      if (_.isNil(user)) return res.status(400).send('User not found.');
      discord(`**${user.dataValues.email}** vient de se déconnecter du compte de **${req.user.fullName}**.`, 'infos');
      delete req.session.originalUser;
      delete req.session.role;
      delete req.session.readOnly;
      req.logIn(user, (err) => new Error(err));
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
