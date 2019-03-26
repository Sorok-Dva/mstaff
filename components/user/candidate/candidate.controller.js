const __ = process.cwd();
const { check, validationResult } = require('express-validator/check');
const { BackError } = require(`${__}/helpers/back.error`);
const { mkdirIfNotExists } = require(`${__}/helpers/helpers`);
const { Op } = require('sequelize');
const _ = require('lodash');
const fs = require('fs');
const Models = require(`${__}/orm/models/index`);

const User_Candidate = {};

User_Candidate.getProfile = (req, res, next) => {
  Models.Candidate.findOne({
    where: { user_id: req.params.userId },
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
      model: Models.Experience,
      as: 'experiences',
      include: [{
        model: Models.Service,
        as: 'service'
      }, {
        model: Models.Post,
        as: 'poste'
      }]
    }, {
      model: Models.CandidateQualification,
      as: 'qualifications'
    }, {
      model: Models.CandidateFormation,
      as: 'formations'
    }, {
      model: Models.CandidateSkill,
      as: 'skills'
    }, {
      model: Models.CandidateEquipment,
      as: 'equipments'
    }, {
      model: Models.CandidateSoftware,
      as: 'softwares'
    }, {
      model: Models.CandidateDocument,
      as: 'documents'
    }]
  }).then(candidate => {
    candidate.views += 1;
    candidate.save();
    return res.status(200).send(candidate);
  }).catch(error => next(new BackError(error)));
};

User_Candidate.addVideo = (req, res, next) => {
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
      mkdirIfNotExists(`${__}/public/uploads/candidates/videos/`);
      if (fs.existsSync(`${__}/public/uploads/candidates/videos/${candidate.video}`)) {
        fs.unlinkSync(`${__}/public/uploads/candidates/videos/${candidate.video}`)
      }
    }
    candidate.video = video.filename;
    candidate.save().then(() => {
      return res.send({ result: 'done' });
    })
  });
};

User_Candidate.uploadDocument = (req, res, next) => {
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
      // TODO CHECK THIS METHOD CUZ ITS APPEARS REALLY WEIRD
      /*mkdirIfNotExists(`${__}/public/uploads/documents/videos/`);*/
      if (fs.existsSync(`./public/uploads/documents/${document.filename}`)) {
        fs.unlinkSync(`./public/uploads/candidates/videos/${document.filename}`)
      }
      return res.status(400).send('Document of same type with same name already exist.')
    }
  });
};

User_Candidate.uploadAvatar = (req, res, next) => {
  console.log(req.file);
};

User_Candidate.viewProfile = (req, res, next) => {
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
};

User_Candidate.ViewEditProfile =(req, res, next) => {
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
};

User_Candidate.EditProfile =(req, res, next) => {
  const errors = validationResult(req);

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
};

User_Candidate.getFormationsAndXP = (req, res, next) => {
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
};

User_Candidate.getKnowledge = (req, res, next) => {
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
};

User_Candidate.getDocuments = (req, res, next) => {
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
};
User_Candidate.addApplication = (req, res, next) => {
  let render = { a: { main: 'applications' } };
  return Models.Post.findAll().then(posts => {
    render.posts = posts;
    return Models.Service.findAll();
  }).then( services => {
    render.services = services;
    return res.render('candidates/add-application', render)
  }).catch(error => next(new BackError(error)));
};

User_Candidate.getWishes = (req, res, next) => {
  let render = { a: { main: 'applications' } };
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    render.candidate = candidate;
    return Models.Wish.findAll({ where: { candidate_id: candidate.id } });
  }).then(wishes => {
    render.wishes = wishes;
    return res.render('candidates/applications', render)
  }).catch(error => next(new BackError(error)));
};

User_Candidate.getXpById = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.Experience.findOne(opts).then(experience => {
      res.status(200).send({ experience });
    }).catch(error => next(error));
  });
};

User_Candidate.removeXP = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.Experience.findOne(opts).then(experience => {
      experience.destroy();
      res.status(200).send({ done: true });
    }).catch(error => next(error));
  });
};

User_Candidate.getFormationById = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateFormation.findOne(opts).then(formation => {
      res.status(200).send({ formation });
    }).catch(error => next(error));
  });
};

User_Candidate.removeFormation = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateFormation.findOne(opts).then(formation => {
      formation.destroy();
      res.status(200).send({ done: true });
    }).catch(error => next(error));
  });
};

User_Candidate.getDiplomaById = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateQualification.findOne(opts).then(diploma => {
      res.status(200).send({ diploma });
    }).catch(error => next(error));
  });
};

User_Candidate.removeDiploma = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateQualification.findOne(opts).then(diploma => {
      diploma.destroy();
      res.status(200).send({ done: true });
    }).catch(error => next(error));
  });
};

User_Candidate.AddExperience = (req, res, next) => {
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
};

User_Candidate.AddFormation = (req, res, next) => {
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
};

User_Candidate.AddDiploma =(req, res, next) => {
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
};

User_Candidate.putFormation = (req, res, next) => {
  const errors = validationResult(req);

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
};

User_Candidate.addRating = (req, res, next) => {
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
};

User_Candidate.starsRating = (req, res, next) => {
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
};

User_Candidate.deleteRating = (req, res, next) => {
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
};

User_Candidate.addWish = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
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
          });
        }).catch(error => next(new BackError(error)));
      }
    }).catch(error => next(new BackError(error)));
  }).catch(error => next(new BackError(error)));
};

User_Candidate.getWish =(req, res, next) => {
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
};

User_Candidate.getEditWish = (req, res, next) => {
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
};

User_Candidate.editWish = (req, res, next) => {
  return Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    Models.Wish.findOne({
      where: { id: req.params.id }
    }).then(wish => {
      if (!wish) return res.status(400).send({ errors: 'Souhait introuvable.' });
      wish.name = req.body.name;
      wish.contract_type = req.body.contractType;
      wish.posts = req.body.posts;
      wish.services = !_.isNil(req.body.services) ? req.body.services : null;
      wish.full_time = req.body.fullTime;
      wish.part_time = req.body.partTime;
      wish.day_time = req.body.dayTime;
      wish.night_time = req.body.nightTime;
      wish.liberal_cabinets = req.body.liberal;
      wish.availability = req.body.availability;
      wish.start = req.body.start;
      wish.end = req.body.end;
      wish.lat = req.body.lat;
      wish.lon = req.body.lon;
      wish.geolocation = !!req.body.lat;
      wish.es_count = req.body.es_count;
      wish.save().then(() => {
        req.body.es = JSON.parse(`[${req.body.es}]`);
        Models.Application.destroy({
          where: {
            wish_id: req.params.id,
          }
        }).then( () => {
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
            }).catch(error => next(new BackError(error)));
          }
          return res.status(200).send({ result: 'updated' });
        })
      });
    })
  }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
};

User_Candidate.removeWish = (req, res, next) => {
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
};

module.exports = User_Candidate;