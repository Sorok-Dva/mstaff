const { check, validationResult } = require('express-validator/check');
const { Op } = require('sequelize');
const { BackError } = require('../helpers/back.error');
const httpStatus = require('http-status');
const _ = require('lodash');
const fs = require('fs');
const Models = require('../models/index');

module.exports = {

  postVideo: (req, res, next) => {
    if (!['add', 'delete'].includes(req.params.action)) return res.status(400).send('Wrong method.');
    let video = { filename: null };
    if (req.params.action === 'add') {
      if (Object.keys(req.file).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      video = req.file;
    }

    Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
      if (!_.isNil(candidate.video)) {
        if (fs.existsSync(`./public/uploads/candidates/videos/${candidate.video}`)) {
          fs.unlinkSync(`./public/uploads/candidates/videos/${candidate.video}`)
        }
      }
      candidate.video = video.filename;
      candidate.save().then(() => {
        return res.send({ result: 'done' });
      })
    });
  },
  uploadDocument: (req, res, next) => {
    if (Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    /* eslint-disable-next-line prefer-destructuring */
    let file = Object.values(req.files)[0][0];
    let candidate;
    Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(result => {
      candidate = result;
      return Models.CandidateDocument.findOne({ where: { name: file.originalname, type: file.fieldname } });
    }).then(document => {
      if (_.isNil(document)) {
        Models.CandidateDocument.create({
          candidate_id: candidate.id,
          filename: file.filename,
          name: file.originalname,
          type: file.fieldname,
          path: file.path,
        }).then(document => {
          return res.status(200).send(document);
        });
      } else {
        if (fs.existsSync(`./public/uploads/documents/${document.filename}`)) {
          fs.unlinkSync(`./public/uploads/candidates/videos/${document.filename}`)
        }
        return res.status(400).send('Document of same type with same name already exist.')
      }
    });
  },
  uploadAvatar: (req, res, next) => {
    console.log(req.file);
  },
  getProfile: (req, res, next) => {
    Models.Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Models.User,
        attributes: { exclude: ['password'] },
        on: {
          '$Candidate.user_id$': {
            [Op.col]: 'User.id'
          }
        },
        required: true
      }, {
        model: Models.Experience, // Experiences Associations (user.candidate.experiences)
        as: 'experiences',
        include: [{
          model: Models.Service,
          as: 'service'
        }, {
          model: Models.Post,
          as: 'poste'
        }] // Service & Post Associations (user.candidate.experiences.service|post)
      }, {
        model: Models.CandidateQualification, // CandidateQualifications Associations (user.candidate.qualifications)
        as: 'qualifications'
      }, {
        model: Models.CandidateFormation, // CandidateFormations Associations (user.candidate.formations)
        as: 'formations'
      }, {
        model: Models.CandidateSkill, // CandidateSkills Associations (user.candidate.skills)
        as: 'skills'
      }, {
        model: Models.CandidateEquipment, // CandidateEquipment Associations (user.candidate.skills)
        as: 'equipments'
      }, {
        model: Models.CandidateSoftware, // Softwares Associations (user.candidate.softwares)
        as: 'softwares'
      }, {
        model: Models.CandidateDocument, // Softwares Associations (user.candidate.softwares)
        as: 'documents'
      }]
    }).then(candidate => {
      return res.render('candidates/profile', { candidate, a: { main: 'profile' } })
    }).catch(error => next(new BackError(error)));
  },
  getEditProfile: (req, res, next) => {
    Models.User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ['password'] },
      include: [{
        model: Models.Candidate,
        as: 'candidate'
      }]
    }).then(usr => {
      return res.render('users/edit', { usr, a: { main: 'profile' } })
    }).catch(error => next(error));
  },
  postEditProfile: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }

    return Models.User.findOne({ where: { id: req.user.id } }).then(user => {
      Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.birthday = req.body.birthday;
        user.postal_code = req.body.postal_code;
        user.town = req.body.town;
        // user.phone = req.body.phone;
        user.save().then(() => {
          candidate.description = req.body.description;
          candidate.save().then(() => {
            req.flash('success_msg', 'Vos informations ont été sauvegardées.');
            return res.redirect('/profile/edit');
          });
        });
      })
    }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
  },
  getFormationsAndXP: (req, res, next) => {
    Models.Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Models.Experience, // Experiences Associations (user.candidate.experiences)
        as: 'experiences',
        required: true,
        include: [{
          model: Models.Service,
          as: 'service',
        }, {
          model: Models.Post,
          as: 'poste'
        }] // Service & Post Associations (user.candidate.experiences.service|post)
      }, {
        model: Models.CandidateQualification, // CandidateQualifications Associations (user.candidate.qualifications)
        as: 'qualifications'
      }, {
        model: Models.CandidateFormation, // CandidateFormations Associations (user.candidate.formations)
        as: 'formations'
      }]
    }).then(candidate => {
      Models.Post.findAll().then(posts => {
        Models.Service.findAll().then(services => {
          return res.render('candidates/formations', { candidate, posts, services, a: { main: 'cv' } })
        }).catch(error => next(new BackError(error)));
      }).catch(error => next(new BackError(error)));
    }).catch(error => next(new BackError(error)));
  },
  getKnowledge: (req, res, next) => {
    let render = { a: { main: 'knowledges' } };
    Models.Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Models.CandidateSkill,
        as: 'skills'
      }, {
        model: Models.CandidateEquipment,
        as: 'equipments'
      }, {
        model: Models.CandidateSoftware,
        as: 'softwares'
      }]
    }).then(candidate => {
      render.candidate = candidate;
      return Models.Skill.findAll();
    }).then(skills => {
      render.skills = skills;
      return Models.Equipment.findAll();
    }).then(equipments => {
      render.equipments = equipments;
      return Models.Software.findAll();
    }).then(softwares => {
      render.softwares = softwares;
      return res.render('candidates/skills', render)
    }).catch(error => next(new BackError(error)));
  },
  getDocuments: (req, res, next) => {
    let render = { a: { main: 'documents' } };
    Models.Candidate.findOne({
      where: { user_id: req.user.id },
      include: {
        model: Models.CandidateDocument,
        as: 'documents',
        required: true
      }
    }).then(candidate => {
      render.candidate = candidate;
      return res.render('candidates/documents', render)
    }).catch(error => next(new BackError(error)));
  },
  addApplication: (req, res, next) => {
    let render = { a: { main: 'applications' } };
    Models.Post.findAll().then(posts => {
      render.posts = posts;
      return res.render('candidates/add-application', render)
    }).catch(error => next(new BackError(error)));
  },
  getWishes: (req, res, next) => {
    let render = { a: { main: 'applications' } };
    Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
      render.candidate = candidate;
      return Models.Wish.findAll({ where: { candidate_id: candidate.id } });
    }).then(wishes => {
      render.wishes = wishes;
      return res.render('candidates/applications', render)
    }).catch(error => next(new BackError(error)));
  },
  getXpById: (req, res, next) => {
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
      Models.Experience.findOne(opts).then(experience => {
        res.status(200).send({ experience });
      }).catch(error => next(error));
    });
  },
  removeXP: (req, res, next) => {
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
      Models.Experience.findOne(opts).then(experience => {
        experience.destroy();
        res.status(200).send({ done: true });
      }).catch(error => next(error));
    });
  },
  getFormationById: (req, res, next) => {
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
      Models.CandidateFormation.findOne(opts).then(formation => {
        res.status(200).send({ formation });
      }).catch(error => next(error));
    });
  },
  removeFormation: (req, res, next) => {
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
      Models.CandidateFormation.findOne(opts).then(formation => {
        formation.destroy();
        res.status(200).send({ done: true });
      }).catch(error => next(error));
    });
  },
  getDiplomaById: (req, res, next) => {
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
      Models.CandidateQualification.findOne(opts).then(diploma => {
        res.status(200).send({ diploma });
      }).catch(error => next(error));
    });
  },
  removeDiploma: (req, res, next) => {
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
      Models.CandidateQualification.findOne(opts).then(diploma => {
        diploma.destroy();
        res.status(200).send({ done: true });
      }).catch(error => next(error));
    });
  },
  postAddExperience: (req, res, next) => {
    check('start').isBefore(new Date());
    check('start').isBefore(req.body.end);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }
    let xp = {};
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      Models.Experience.create({
        name: req.body.name,
        candidate_id: candidate.id,
        poste_id: parseInt(req.body.post_id),
        service_id: parseInt(req.body.service_id),
        internship: req.body.internship,
        current: req.body.current,
        start: req.body.start,
        end: req.body.end || null
      }).then(experience => {
        xp = experience.dataValues;
        Models.Service.findOne({ where: { id: experience.service_id } }).then(service => {
          xp.service = service.dataValues;
          return Models.Post.findOne({ where: { id: experience.poste_id } });
        }).then(poste => {
          xp.poste = poste.dataValues;
          res.status(200).send({ experience: xp });
        });
      }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
    })
  },
  postAddFormation: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      Models.CandidateFormation.create({
        name: req.body.name,
        candidate_id: candidate.id,
        formation_id: parseInt(req.body.formation_id),
        start: req.body.start,
        end: req.body.end || null
      }).then(formation => {
        res.status(200).send({ formation });
      }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
    })
  },
  postAddDiploma: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      Models.CandidateQualification.create({
        name: req.body.name,
        candidate_id: candidate.id,
        start: req.body.start,
        end: req.body.end || null
      }).then(diploma => {
        res.status(200).send({ diploma });
      }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
    })
  },
  putFormation: (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }

    // @todo secure with candidate_id clause
    return Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
      Models.CandidateFormation.findOne({ where: { id: req.params.id, candidate_id: candidate.id } }).then(formation => {
        if (!formation) return res.status(400).send({ errors: 'Formation not found' });
        formation.name = req.body.name;
        formation.start = req.body.start;
        formation.end = req.body.end;
        formation.save().then(() => {
          return res.status(200).send({ result: 'updated' });
        });
      })
    }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
  },
  addRating: (req, res, next) => {
    const errors = validationResult(req);
    let badType = false, type, as;
    switch (req.params.type) {
      case 'skill': type = 'CandidateSkill', as = 'skills'; break;
      case 'equipment': type = 'CandidateEquipment', as = 'equipments'; break;
      case 'software': type = 'CandidateSoftware', as = 'softwares'; break;
      default: badType = true;
    }
    if (!errors.isEmpty()) return res.status(400).send({ body: req.body, errors: errors.array() });
    else if (badType) return res.status(400).send({ body: req.body, error: 'Wrong url parameters.' });
    return Models.Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Models[type],
        as,
      }],
    }).then(candidate => {
      if (_.find(candidate[as], { name: req.body.name })) return res.status(400).send({ body: req.body, error: 'Already exists' });
      return Models[type].create({
        candidate_id: candidate.id,
        name: req.body.name,
        stars: 0
      }).then(data => res.status(201).send(data));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  starsRating: (req, res, next) => {
    const errors = validationResult(req);
    let badType = false, type, as;
    switch (req.params.type) {
      case 'skill': type = 'CandidateSkill', as = 'skills'; break;
      case 'equipment': type = 'CandidateEquipment', as = 'equipments'; break;
      case 'software': type = 'CandidateSoftware', as = 'softwares'; break;
      default: badType = true;
    }
    if (!errors.isEmpty() || badType) {
      return res.status(400).send({ body: req.body, errors: errors.array() || 'Wrong url parameters.' });
    }

    return Models.Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Models[type],
        as,
        where: { id: req.params.id }
      }],
    }).then(candidate => {
      if (!candidate) return res.status(400).send({ body: req.body, error: 'Not exists' });
      return candidate[as][0].update({
        stars: req.body.rate
      }).then(data => res.status(201).send({ data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  deleteRating: (req, res, next) => {
    const errors = validationResult(req);
    let badType = false, type, as;
    switch (req.params.type) {
      case 'skill': type = 'CandidateSkill', as = 'skills'; break;
      case 'equipment': type = 'CandidateEquipment', as = 'equipments'; break;
      case 'software': type = 'CandidateSoftware', as = 'softwares'; break;
      default: badType = true;
    }
    if (!errors.isEmpty() || badType) {
      return res.status(400).send({ body: req.body, errors: errors.array() || 'Wrong url parameters.' });
    }

    return Models.Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Models[type],
        as,
        where: { id: req.params.id }
      }],
    }).then(candidate => {
      if (!candidate) return res.status(400).send({ body: req.body, error: 'Not exists' });
      return candidate[as][0].destroy().then(data => res.status(201).send({ deleted: true, data }));
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  },
  addWish: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      Models.Wish.create({
        candidate_id: candidate.id,
        name: req.body.name || 'Candidature sans nom',
        contract_type: req.body.contractType,
        posts: req.body.posts,
        full_time: req.body.fullTime,
        part_time: req.body.partTime,
        day_time: req.body.dayTime,
        night_time: req.body.nightTime,
        liberal_cabinets: req.body.liberal,
        availability: req.body.availability,
        start: req.body.start,
        end: req.body.end,
        lat: req.body.lat,
        lon: req.body.lon,
        geolocation: !!req.body.lat,
        es_count: req.body.es_count
      }).then(wish => {
        req.flash('success_msg', `Souhait ajouté avec succès auprès de ${req.body.es_count} établissements.`);
        res.status(201).send({ wish });
        req.body.es = JSON.parse(`[${req.body.es}]`);
        for (let i = 0; i < req.body.es.length; i++) {
          Models.Establishment.findOne({ where: { finess: req.body.es[i] } }).then(es => {
            Models.Application.create({
              name: req.body.name || 'Candidature sans nom',
              wish_id: wish.id,
              candidate_id: candidate.id,
              ref_es_id: req.body.es[i],
              es_id: !_.isNil(es) ? es.id : null,
              new: true
            });
          });
        }
      });
    });
  },
  getWish: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }
    return Models.Candidate.findOne( {
      where: { user_id: req.user.id }
    }).then( candidate => {
      Models.Wish.findOne({
        where: { id: req.params.id }
      }).then( wish => {
        if (!wish) return res.status(400).send({ body: req.body, error: 'Not exists' });
        res.status(201).send({ get: true, wish })
      })
    })

  },
  getEditWish: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }

    let render = { a: { main: 'applications' } };
    Models.Candidate.findOne( {
      attributes: ['user_id'],
      where: { user_id: req.user.id },
      include: [{
        model: Models.Wish,
        where: { id: req.params.id },
        as: 'wishes'
      }, {
        model: Models.Application,
        attributes: ['ref_es_id'],
        where: { wish_id: req.params.id },
        as: 'applications',
        include: {
          model: Models.EstablishmentReference,
          attributes: ['name', 'finess_et'],
          on: { '$applications.ref_es_id$': {
            [Op.col]: 'applications->EstablishmentReference.finess_et' }
          }
        }
      }]
    }).then( candidate => {
      render.candidate = candidate;
      render.wish = candidate.wishes[0];
      render.applications = candidate.applications;
      return Models.Post.findAll();
    }).then( posts => {
      render.posts = posts;
      return Models.Service.findAll();
    }).then(services => {
      render.services = services;
      return res.render('candidates/edit-application', render);
    }).catch(error => next(new Error(error)));
  },
  addWish: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      console.log('test');
      Models.Wish.create({
        candidate_id: candidate.id,
        name: req.body.name || 'Candidature sans nom',
        contract_type: req.body.contractType,
        posts: req.body.posts,
        services: !_.isNil(req.body.services) ? req.body.services : null,
        full_time: req.body.fullTime,
        part_time: req.body.partTime,
        day_time: req.body.dayTime,
        night_time: req.body.nightTime,
        liberal_cabinets: req.body.liberal,
        availability: req.body.availability,
        start: req.body.start,
        end: req.body.end,
        lat: req.body.lat,
        lon: req.body.lon,
        geolocation: !!req.body.lat,
        es_count: req.body.es_count
      }).then(wish => {
        req.flash('success_msg', `Souhait ajouté avec succès auprès de ${req.body.es_count} établissements.`);
        res.status(201).send({ wish });
        req.body.es = JSON.parse(`[${req.body.es}]`);
        for (let i = 0; i < req.body.es.length; i++) {
          Models.Establishment.findOne({ where: { finess: req.body.es[i] } }).then(es => {
            Models.Application.create({
              name: req.body.name || 'Candidature sans nom',
              wish_id: wish.id,
              candidate_id: candidate.id,
              ref_es_id: req.body.es[i],
              es_id: !_.isNil(es) ? es.id : null,
              new: true
            }).catch(error => next(new Error(error)));
          }).catch(error => next(new Error(error)));
        }
      }).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  },
  removeWish: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }
    return Models.Candidate.findOne({
      where: { user_id: req.user.id }
    }).then(candidate => {
      Models.Wish.findOne({
        where: { id: req.params.id, candidate_id: candidate.id }
      }).then(wish => {
        if (!wish) return res.status(400).send({ body: req.body, error: 'Not exists' });
        wish.destroy().then(wish => res.status(201).send({ deleted: true, wish }));
      }).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  }
};