const { validationResult } = require('express-validator/check');
const { Sequelize, Op } = require('sequelize');
const { BackError } = require('../helpers/back.error');
const httpStatus = require('http-status');
const _ = require('lodash');
const moment = require('moment');
const crypto = require('crypto');
const Models = require('../models/index');
const layout = 'admin';

const UserController = require('./user');
const discord = require('../bin/discord-bot');
const mailer = require('../bin/mailer');

module.exports = {
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
      /* eslint-disable no-return-assign */
      render.esWeekRegistration.map((data) => render.ESWeekCount += parseInt(data.dataValues.count));
      render.usersWeekRegistration.map((data) => render.usersWeekCount += parseInt(data.dataValues.count));
      render.wishesWeek.map((data) => render.wishesWeekCount += parseInt(data.dataValues.count));
      /* eslint-enable no-return-assign */
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
    }).catch(error => next(new BackError(error)));
  },
  getEstablishmentsRefList: (req, res, next) => {
    res.render('back-office/es/list_ref', {
      layout,
      title: 'Liste des Établissements dans le référentiel',
      a: { main: 'references', sub: 'establishments' }
    });
  },
  APIgetEstablishmentsRefList: (req, res, next) => {
    let where = _.isNil(req.query.search) ? null : {
      [Op.or]: [{
        name: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {
          [Op.like]: `%${req.query.search.toLowerCase()}%`
        })
      }, {
        finess_et: Sequelize.where(Sequelize.fn('lower', Sequelize.col('finess_et')), {
          [Op.like]: `%${req.query.search.toLowerCase()}%`
        })
      }, {
        address_town: Sequelize.where(Sequelize.fn('lower', Sequelize.col('address_town')), {
          [Op.like]: `%${req.query.search.toLowerCase()}%`
        })
      }],
    };
    Models.EstablishmentReference.findAll({ attributes: ['id'], where }).then(allEs => {
      Models.EstablishmentReference.findAll({
        where,
        attributes: [
          'id', 'name', 'finess_et', 'address_dpt_name', 'address_town',
          [Sequelize.literal(
            '(SELECT COUNT(*) FROM Applications WHERE `EstablishmentReference`.`finess_et` = `Applications`.`ref_es_id`)'
          ), 'applications']
        ],
        offset: _.isNaN(req.query.offset) ? 0 : parseInt(req.query.offset),
        limit: _.isNaN(req.query.limit) ? 100 : parseInt(req.query.limit),
        order: [[
          _.isNil(req.query.sort) ? 'id' : req.query.sort === 'applications' ? Sequelize.literal('applications') : req.query.sort,
          req.query.order
        ]]
      }).then(data => {
        res.status(200).send({ total: allEs.length, rows: data });
      }).catch(error => next(new BackError(error)));
    }).catch(error => next(new BackError(error)));
  },
  APIgetEstablishmentRefInfo: (req, res, next) => {
    Models.EstablishmentReference.findOne({
      where: { id: req.params.id },
      include: {
        model: Models.Application,
        include: [{
          model: Models.Wish,
          required: true,
          on: {
            '$Applications.wish_id$': {
              [Op.col]: 'Applications->Wish.id'
            }
          },
          include: {
            model: Models.Candidate,
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            required: true,
            include: [{
              model: Models.User,
              attributes: { exclude: ['password', 'type', 'role', 'email', 'phone', 'updatedAt', 'createdAt'] },
              on: {
                '$Applications->Wish->Candidate.user_id$': {
                  [Op.col]: 'Applications->Wish->Candidate->User.id'
                }
              },
              required: true
            }]
          }
        }]
      }
    }).then(es => {
      if (_.isNil(es)) return next(new BackError(`Establishment ${req.params.id} not found`, httpStatus.NOT_FOUND));
      return res.status(200).send(es);
    }).catch(error => next(new BackError(error)));
  },
  APIgetEstablishmentRefInfoToCreate: (req, res, next) => {
    let transporter;
    Models.EstablishmentReference.findOne({
      where: { id: req.params.id },
    }).then(es => {
      if (_.isNil(es)) return next(new BackError(`Establishment ${req.params.id} not found`, httpStatus.NOT_FOUND));
      transporter = es;
      return Models.Establishment.findOne({ where: { finess: es.finess_et } });
    }).then(mstaffEs => {
      if (!_.isNil(mstaffEs))
        return next(new BackError(`Establishment with finess ${transporter.finess_et} already added in Mstaff.`, httpStatus.CONFLICT));
      return res.status(200).send(transporter);
    }).catch(error => next(new BackError(error)));
  },
  APICreateEstablishment: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });

    Models.Establishment.findOrCreate({
      where: { finess: req.body.finess_et },
      defaults: {
        name: req.body.name,
        finess_ej: req.body.finess_ej,
        siret: req.body.siret,
        phone: req.body.phone,
        address: req.body.address,
        town: req.body.addr_town,
        sector: req.body.sector,
        salaries_count: req.body.salaries_count,
        contact_identity: req.body.contactIdentity,
        contact_post: req.body.contactPost,
        contact_email: req.body.contactEmail,
        contact_phone: req.body.contactPhone,
        domain_enable: parseInt(req.body.domain_enable),
        domain_name: req.body.domain_name,
        logo: req.body.logo,
        banner: req.body.banner
      }
    }).spread((es, created) => {
      if (created) {
        Models.EstablishmentReference.findOne({
          where: { finess_et: es.finess }
        }).then(ref => {
          ref.es_id = es.id;
          ref.save();
          return res.status(200).json({ status: 'Created', es });
        }).catch(errors => next(new BackError(errors)));
      } else {
        return res.status(200).json({ status: 'Already exists', es });
      }
    }).catch(errors => next(new BackError(errors)));
  },
  APIAddUserInEstablishment: (req, res, next) => {
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
        Models.ESAccount.findOrCreate({
          where: {
            user_id: user.id,
            es_id: req.params.id
          },
          defaults: {
            role: req.body.role,
          }
        }).spread((esaccount, esCreated) => {
          if (created) {
            return res.status(201).json({ status: 'Created and added to es', user, esaccount });
          } else {
            if (esCreated) return res.status(201).json({ status: 'Added to es', user, esaccount });
            return res.status(200).json({ status: 'Already exists', user, esaccount });
          }
        });
      });
    } catch (errors) {
      return next(new BackError(errors));
    }
  },
  getESList: (req, res, next) => {
    Models.Establishment.findAll().then(data => {
      res.render('back-office/es/list', {
        layout,
        title: 'Liste des Établissements Mstaff',
        a: { main: 'es', sub: 'es_all' },
        data
      })
    }).catch(error => next(new BackError(error)));
  },
  getES: (req, res, next) => {
    Models.Establishment.findOne({ where: { id: req.params.id } }).then(data => {
      if (_.isNil(data)) {
        req.flash('error_msg', 'Cet établissement n\'existe pas.');
        return res.redirect('/back-office/es');
      }
      Models.Candidate.findAll({
        include: [{
          model: Models.Application,
          as: 'applications',
          required: true,
          where: {
            ref_es_id: data.dataValues.finess
          },
        }]
      }).then(candidates => {
        res.render('back-office/es/show', {
          layout,
          candidates,
          title: `Établissement ${data.dataValues.name}`,
          a: { main: 'es', sub: 'es_one' },
          es: data
        })
      });
    }).catch(error => next(new BackError(error)));
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
        req.flash('error_msg', 'Cet utilisateur n\'existe pas.');
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
  getFormations: (req, res) => {
    return Models.Formation.findAll().then( formation => {
      res.render('back-office/references/formations', {
        layout, formation, a: { main: 'references', sub: 'formations' } })
    });
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
  getEquipments: (req, res) => {
    return Models.Equipment.findAll().then( equipment => {
      res.render('back-office/references/equipments', {
        layout, equipment, a: { main: 'references', sub: 'equipments' } })
    });
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
  getSoftwares: (req, res) => {
    return Models.Software.findAll().then( software => {
      res.render('back-office/references/softwares', {
        layout, software, a: { main: 'references', sub: 'softwares' } })
    });
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
  getServices: (req, res) => {
    return Models.Service.findAll().then( service => {
      res.render('back-office/references/services', {
        layout, service, a: { main: 'references', sub: 'services' } })
    });
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
  getPosts: (req, res) => {
    let render = { a: { main: 'references', sub: 'posts' } };
    return Models.Post.findAll().then( post => {
      render.post = post;
      return Models.CategoriesPostsServices.findAll()
    }).then( categories => {
      render.categories = categories;
      return res.render('back-office/references/posts', {
        layout, render })
    });
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
  getQualifications: (req, res) => {
    return Models.Qualification.findAll().then( qualification => {
      res.render('back-office/references/qualifications', {
        layout, qualification, a: { main: 'references', sub: 'qualifications' } })
    });
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
        template: 'candidate/emailValidation',
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