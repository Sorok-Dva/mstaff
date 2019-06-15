const __ = process.cwd();
const { check, validationResult } = require('express-validator/check');
const { BackError } = require(`${__}/helpers/back.error`);
const { mkdirIfNotExists } = require(`${__}/helpers/helpers`);
const { Op } = require('sequelize');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const Models = require(`${__}/orm/models/index`);
const Sequelize = require(`${__}/bin/sequelize`);
const Mailer = require(`${__}/components/mailer`);

/*const AvatarStorage = require('../../../helpers/avatar.storage');*/
const path = require('path');
const multer = require('multer');


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
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
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
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
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
  if (!['jpeg', 'jpg', 'png', 'pdf'].includes(file.mimetype.split('/')[1])) {
    return res.status(400).send('Mauvais format, seul les formats jpeg, jpg et png sont autorisés.');
  }
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(result => {
    if (_.isNil(result)) return next(new BackError('Candidat introuvable', 404));
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
        User_Candidate.updatePercentage(req.user, 'documents');
        return res.status(200).send(document);
      });
    } else {
      if (fs.existsSync(`./public/uploads/documents/${document.filename}`)) {
        fs.unlinkSync(`./public/uploads/documents/${document.filename}`)
      }
      return res.status(400).send('Document of same type with same name already exist.')
    }
  });
};

User_Candidate.deleteDocument = (req, res, next) => {
  let candidate;
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(result => {
    if (_.isNil(result)) return next(new BackError('Candidat introuvable', 404));
    candidate = result;
    return Models.CandidateDocument.findOne({ where: { id: req.params.id, candidate_id: candidate.id } });
  }).then(document => {
    if (_.isNil(document)) {
      return res.status(404).send('Document introuvable.')
    } else {
      if (fs.existsSync(`./public/uploads/candidates/documents/${document.filename}`)) {
        fs.unlinkSync(`./public/uploads/candidates/documents/${document.filename}`)
      }
      document.destroy().then(() => {
        User_Candidate.updatePercentage(req.user, 'documents');
        return res.status(200).send('Document supprimé.');
      });
    }
  });
};

User_Candidate.viewDocument = (req, res, next) => {
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    return Models.CandidateDocument.findOne({ where: { id: req.params.id, candidate_id: candidate.id } });
  }).then(document => {
    if (_.isNil(document)) {
      return next(new BackError('Document introuvable', 404));
    } else {
      if (fs.existsSync(`./public/uploads/candidates/documents/${document.filename}`)) {
        return res.sendFile(`${__}/public/uploads/candidates/documents/${document.filename}`);
      } else {
        return next(new BackError('Document introuvable sur ce serveur', 404));
      }
    }
  });
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
    }, {
      model: Models.Wish,
      as: 'wishes'
    }]
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    if (_.isNil(candidate.percentage)) {
      User_Candidate.updateWholePercentage(req.user);
    }
    return res.render('candidates/profile', { candidate, a: { main: 'profile' } })
  }).catch(error => next(new BackError(error)));
};

User_Candidate.ViewEditProfile = (req, res, next) => {
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

User_Candidate.EditProfile = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('users/edit', { body: req.body, a: { main: 'profile' }, errors: errors.array() });
  }

  return Models.User.findOne({ where: { id: req.user.id } }).then(user => {
    if (_.isNil(user)) return next(new BackError('Utilisateur introuvable', 404));
    Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
      if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.birthday = req.body.birthday;
      user.postal_code = req.body.postal_code;
      user.town = req.body.town;
      user.country = req.body.country;
      user.phone = req.body.phone;
      user.save().then(() => {
        candidate.description = req.body.description;
        candidate.save().then(() => {
          req.flash('success_msg', 'Vos informations ont été sauvegardées.');
          User_Candidate.updatePercentage(req.user, 'identity');
          if (req.body.email !== user.email) {
            Models.User.findOne({ where: { email: req.body.email } }).then(verifEmail => {
              if (!_.isNil(verifEmail)) {
                req.flash('error_msg', 'Cet adresse e-mail est déjà utilisée.');
              } else {
                user.email = req.body.email;
                user.save();
              }
              return res.redirect('/profile/edit');
            });
          } else return res.redirect('/profile/edit');
        });
      });
    })
  }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
};

User_Candidate.UploadImageProfile = (req, res, next) => {
  if (!['add', 'delete'].includes(req.params.action)) return res.status(400).send('Wrong method.');
  let photo = { filename: null };
  if (req.params.action === 'add') {
    if (Object.keys(req.file).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    if (!['jpeg', 'jpg', 'png'].includes(req.file.mimetype.split('/')[1])) {
      return res.status(400).send('Mauvais format, seul les formats jpeg, jpg et png sont autorisés.');
    }
    photo = req.file;
  }

  Models.User.findOne({ where: { id: req.user.id } }).then(user => {
    if (_.isNil(user)) return next(new BackError('Utilisateur introuvable', 404));
    if (!_.isNil(user.photo)) {
      mkdirIfNotExists(`${__}/public/uploads/avatars/`);
      if (fs.existsSync(`./public/uploads/avatars/${user.photo}`)) {
        fs.unlinkSync(`./public/uploads/avatars/${user.photo}`)
      }
    }
    user.photo = photo.filename;
    user.save().then(() => {
      User_Candidate.updatePercentage(req.user, 'photo');
      req.flash('success_msg', 'Votre photo a été sauvegardée.');
      if (req.xhr) {
        return res.status(200).send('saved');
      } else {
        return res.redirect('/profile/edit');
      }
    });
  });
};

User_Candidate.getFormationsAndXP = (req, res, next) => {
  Models.Candidate.findOne({
    where: { user_id: req.user.id },
    include: [{
      model: Models.Experience, // Experiences Associations (user.candidate.experiences)
      as: 'experiences',
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
    }],
    order: [
      [ 'experiences', 'start', 'ASC' ]
    ]
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
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
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
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
      as: 'documents'
    }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    render.candidate = candidate;
    return res.render('candidates/documents', render)
  }).catch(error => next(new BackError(error)));
};

User_Candidate.addApplication = (req, res, next) => {
  let render = { a: { main: 'applications' } };
  return Models.Post.findAll().then(posts => {
    render.posts = posts;
    return Models.Service.findAll();
  }).then(services => {
    render.services = services;
    return res.render('candidates/add-application', render)
  }).catch(error => next(new BackError(error)));
};

User_Candidate.getWishes = (req, res, next) => {
  let render = { a: { main: 'applications' } };
  Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError(`Candidat introuvable.`, 404));
    render.candidate = candidate;
    return Models.Wish.findAll({ where: { candidate_id: candidate.id } });
  }).then(wishes => {
    render.wishes = wishes;
    return res.render('candidates/applications', render)
  }).catch(error => next(new BackError(error)));
};

User_Candidate.getXpById = (req, res, next) => {
  Models.Candidate.findOne({
    where: { user_id: req.user.id },
    include: {
      model: Models.Experience,
      as: 'experiences',
      where: { id: req.params.id },
      required: true
    }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Experience introuvable', 404));
    res.status(200).send(candidate.experiences[0]);
  }).catch(error => next(new BackError(error)));
};

User_Candidate.removeXP = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.Experience.findOne(opts).then(experience => {
      if (_.isNil(experience)) return next(new BackError('Experience introuvable', 404));
      experience.destroy().then(() => User_Candidate.updatePercentage(req.user, 'experiences'));
      res.status(200).send({ done: true });
    }).catch(error => next(error));
  });
};

User_Candidate.getFormationById = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateFormation.findOne(opts).then(formation => {
      if (_.isNil(formation)) return next(new BackError('Formation introuvable', 404));
      res.status(200).send({ formation });
    }).catch(error => next(error));
  });
};

User_Candidate.removeFormation = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateFormation.findOne(opts).then(formation => {
      if (_.isNil(formation)) return next(new BackError('Formation introuvable', 404));
      formation.destroy().then(() => User_Candidate.updatePercentage(req.user, 'formations'));
      res.status(200).send({ done: true });
    }).catch(error => next(error));
  });
};

User_Candidate.getDiplomaById = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateQualification.findOne(opts).then(diploma => {
      if (_.isNil(diploma)) return next(new BackError('Diplôme introuvable', 404));
      res.status(200).send({ diploma });
    }).catch(error => next(error));
  });
};

User_Candidate.removeDiploma = (req, res, next) => {
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    let opts = { where: { id: req.params.id, candidate_id: candidate.id } };
    Models.CandidateQualification.findOne(opts).then(diploma => {
      if (_.isNil(diploma)) return next(new BackError('Diplôme introuvable', 404));
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
    if (_.isNil(candidate)) return next(new BackError('Utilisateur introuvable', 404));
    Models.Experience.create({
      name: req.body.name,
      candidate_id: candidate.id,
      poste_id: parseInt(req.body.post_id),
      service_id: parseInt(req.body.service_id),
      internship: req.body.internship,
      liberal: req.body.liberal,
      current: req.body.current,
      start: req.body.start,
      end: req.body.end || null
    }).then(experience => {
      User_Candidate.updatePercentage(req.user, 'experiences');
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

// ATS -----------------------------------------------------------

function isBoolean(value) {
  if (value == true || value == false)
    return true;
  return false;
}

function errorsExperiences(experiences) {
  let errors = [];
  experiences.forEach(xp => {
    if (xp.name.length < 3)
      errors.push('experience name doit avoir au minimum 3 caractères');
    else if (isNaN(xp.post_id))
      errors.push('post_id doit être numérique');
    else if (isNaN(xp.service_id))
      errors.push('service_id doit être numérique');
    else if (!isBoolean(xp.internship))
      errors.push('internship doit être un booléen');
    else if (!isBoolean(xp.current))
      errors.push('current doit être un booléen');
    else if (moment(xp.start).isAfter(new Date()) && moment(xp.start).isAfter(xp.end))
      errors.push('la date de départ doit être antérieur à la date courante et d\'arrivée');
  });
  return errors;
}

function errorsDiplomasQualifications(entities) {
  let errors = [];
  entities.forEach(entity => {
    if (entity.name.length < 3)
      errors.push('name doit avoir au minimum 3 caractères');
    else if (moment(entity.start).isAfter(new Date()) && moment(entity.start).isAfter(entity.end))
      errors.push('la date de départ doit être antérieur à la date courante et d\'arrivée');
  });
  return errors;
}

function errorsSkills(skills) {
  let errors = [];
  skills.forEach(skill => {
    if (skill.name.length < 185)
      errors.push('name doit avoir au minimum 3 caractères');
    else if (_.isNaN(skill.stars))
      errors.push('stars doit être numérique');
  });
  return errors;
}

function errorsWish(wish){
  let errors = [];

  if (!isBoolean(wish.fullTime))
    errors.push('fullTime doit être un booléen');
  else if (!isBoolean(wish.partTime))
    errors.push('partTime doit être un booléen');
  else if (!isBoolean(wish.dayTime))
    errors.push('dayTime doit être un booléen');
  else if (!isBoolean(wish.nightTime))
    errors.push('nightTime doit être un booléen');
  else if (moment(wish.start).isAfter(wish.end))
    errors.push('la date de départ doit être antérieur à la date courante et d\'arrivée');
  return errors;
}

function initPercentage(candidate, bulks){
  let percentage = {};
  percentage.profile = { main: 0, description: 0, photo: 0 };
  percentage.profile.main = 20;
  bulks.createXp ? percentage.experiences = 10 : percentage.experiences = 0;
  bulks.createDiplomas ? percentage.formations = 10 : percentage.formations = 0;
  percentage.total = percentage.main + percentage.experiences + percentage.formations;
  User_Candidate.updateTotalPercentage(candidate, percentage);
}

function initBulks(bulks, candidate, req) {
  bulks.experiences = [];
  bulks.diplomas = [];
  bulks.qualifications = [];
  bulks.skills = [];
  bulks.wish = [];

  if (bulks.createXp) {
    req.body.experiences.forEach(experience => {
      bulks.experiences.push({
        name: experience.name,
        candidate_id: candidate.id,
        poste_id: parseInt(experience.post_id),
        service_id: parseInt(experience.service_id),
        internship: experience.internship,
        liberal: experience.liberal || null,
        current: experience.current,
        start: experience.start,
        end: experience.end || null
      });
    });
  }
  if (bulks.createDiplomas) {
    req.body.diplomas.forEach(diploma => {
      bulks.diplomas.push({
        name: diploma.name,
        candidate_id: candidate.id,
        start: diploma.start,
        end: diploma.end || null
      });
    });
  }
  if (bulks.createQualifications) {
    req.body.qualifications.forEach(qualification => {
      bulks.qualifications.push({
        name: qualification.name,
        candidate_id: candidate.id,
        start: qualification.start,
        end: qualification.end || null
      });
    });
  }
  if (bulks.createSkills) {
    req.body.skills.forEach( skill => {
      bulks.skills.push({
        candidate_id: candidate.id,
        name: skill.name,
        stars: skill.stars
      });
    });
  }
  if (bulks.createWish){
    bulks.wish.push({
      candidate_id: candidate.id,
      name: 'Ma première candidature',
      contract_type: req.body.wish.contractType,
      posts: req.body.wish.post,
      services: !_.isNil(req.body.wish.services) ? req.body.wish.services : null,
      full_time: req.body.wish.fullTime,
      part_time: req.body.wish.partTime,
      day_time: req.body.wish.dayTime,
      night_time: req.body.wish.nightTime,
      start: req.body.wish.start,
      end: req.body.wish.end,
      es_count: 1
    });
  }
}

function createApplicationsBulk(wish, candidateId, esList){
  let applicationsBulk = [];

  esList.forEach( es => {
    applicationsBulk.push({
      name: 'Ma première candidature',
      wish_id: wish,
      candidate_id: candidateId,
      ref_es_id: es.finess,
      es_id: !_.isNil(es) ? es.id : null,
      new: true
    });
  });
  return applicationsBulk;
}

User_Candidate.ATSAddAll = (req, res, next) => {

  let user = {};
  user.id = req.session.atsUserId;

  let errors = [];
  let bulks = {
    createContact: false,
    createXp: false,
    createDiplomas: false,
    createQualifications: false,
    createSkills: false,
    createWish: false
  };

  if (req.body.experiences !== 'none') {
    errors.concat(errorsExperiences(req.body.experiences));
    bulks.createXp = true;
  }
  if (req.body.diplomas !== 'none') {
    errors.concat(errorsDiplomasQualifications(req.body.diplomas));
    bulks.createDiplomas = true;
  }
  if (req.body.qualifications !== 'none') {
    errors.concat(errorsDiplomasQualifications(req.body.qualifications));
    bulks.createQualifications = true;
  }
  if (req.body.skills !== 'none') {
    errors.concat(errorsSkills(req.body.skills));
    bulks.createSkills = true;
  }
  if (req.body.wish !== 'none'){
    errors.concat(errorsWish(req.body.wish));
    bulks.createWish = true;
  }

  if (errors.length > 0) {
    return res.status(400).send({ body: req.body, errors: errors });
  }
  else {
    return Sequelize.transaction(t => {
      return Models.Candidate.findOne({
        where: { user_id: user.id }
      }, { transaction: t }).then(candidate => {
        initBulks(bulks, candidate, req);
        initPercentage(candidate, bulks);
        return Models.Experience.bulkCreate(bulks.experiences, { transaction: t }).then(() => {
          return Models.CandidateFormation.bulkCreate(bulks.diplomas, { transaction: t }).then( () => {
            return Models.CandidateQualification.bulkCreate(bulks.qualifications, { transaction: t }).then( () => {
              return Models.CandidateSkill.bulkCreate(bulks.skills, { transaction: t }).then( () => {
                return  Models.Wish.bulkCreate(bulks.wish, { transaction: t }).then(wish => {
                  return Models.Establishment.findAll({
                    where: { finess: req.body.finess }
                  }, { transaction: t }).then(es => {
                    bulks.application = createApplicationsBulk(wish[0].id, candidate.id, es);
                    return Models.Application.bulkCreate(bulks.application, { transaction: t }).then( () => {
                      return Models.User.findOne({
                        where: { id: user.id }
                      }, { transaction: t }).then(item => {
                        user = item;
                      })
                    });
                  })
                })
              })
            })
          })
        })
      }, { transaction: t });
    }).then(result => {
      Mailer.Main.sendUserVerificationEmail(user);
      return res.status(200).send({ result: 'created', entities: result });
    }).catch(error => {
      Models.Candidate.destroy({
        where: { user_id: user.id }
      }).then( () => {
        Models.User.destroy({
          where: { id: user.id }
        }).then( () => {
          return res.status(400).send({ body: req.body, sequelizeError: error })
        })
      });
    });
  }
};

// ----------------------------------------------------------------

User_Candidate.AddFormation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  return Models.Candidate.findOne({
    where: { user_id: req.user.id },
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.CandidateFormation.create({
      name: req.body.name,
      candidate_id: candidate.id,
      formation_id: parseInt(req.body.formation_id),
      start: req.body.start,
      end: req.body.end || null
    }).then(formation => {
      User_Candidate.updatePercentage(req.user, 'formations');
      res.status(200).send({ formation });
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  })
};

User_Candidate.AddDiploma = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
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

  return Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.CandidateFormation.findOne({ where: { id: req.params.id, candidate_id: candidate.id } }).then(formation => {
      if (!formation) return res.status(400).send({ errors: 'Formation not found' });
      formation.name = req.body.name || formation.name;
      formation.start = req.body.start || formation.start;
      formation.end = req.body.end || formation.end;
      formation.save().then(() => {
        User_Candidate.updatePercentage(req.user, 'formations');
        return res.status(200).send({ result: 'updated' });
      });
    })
  }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
};

User_Candidate.putDiploma = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }

  return Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.CandidateQualification.findOne({ where: { id: req.params.id, candidate_id: candidate.id } }).then(diploma => {
      if (!diploma) return res.status(400).send({ errors: 'Diplôme introuvable.' });
      diploma.name = req.body.name;
      diploma.start = req.body.start;
      diploma.end = req.body.end;
      diploma.save().then(() => {
        return res.status(200).send({ result: 'updated' });
      });
    })
  }).catch(errors => res.status(400).send({ body: req.body, sequelizeError: errors }))
};

User_Candidate.putXP = (req, res, next) => {
  check('start').isBefore(new Date());
  check('start').isBefore(req.body.end);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }

  Models.Candidate.findOne({
    where: { user_id: req.user.id },
    include: {
      model: Models.Experience,
      as: 'experiences',
      where: { id: req.params.id },
      required: true
    }
  }).then(candidate => {
    if (!candidate) return res.status(400).send({ errors: 'Candidat ou formation introuvable.' });
    candidate.experiences[0].name = req.body.name;
    candidate.experiences[0].start = req.body.start;
    candidate.experiences[0].end = _.isNil(req.body.end) ? null : req.body.end;
    candidate.experiences[0].poste_id = parseInt(req.body.post_id);
    candidate.experiences[0].service_id = parseInt(req.body.service_id);
    candidate.experiences[0].internship = req.body.internship;
    candidate.experiences[0].current = req.body.current;
    candidate.experiences[0].save().then(() => {
      User_Candidate.updatePercentage(req.user, 'experiences');
      return res.status(200).send({ result: 'updated' });
    }).catch(error => next(new BackError(error)));
  }).catch(errors => next(new BackError(errors)))
};

User_Candidate.addRating = (req, res, next) => {
  const errors = validationResult(req);
  let badType = false, type, as;
  switch (req.params.type) {
    case 'skill':
      type = 'CandidateSkill', as = 'skills';
      break;
    case 'equipment':
      type = 'CandidateEquipment', as = 'equipments';
      break;
    case 'software':
      type = 'CandidateSoftware', as = 'softwares';
      break;
    default:
      badType = true;
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
    case 'skill':
      type = 'CandidateSkill', as = 'skills';
      break;
    case 'equipment':
      type = 'CandidateEquipment', as = 'equipments';
      break;
    case 'software':
      type = 'CandidateSoftware', as = 'softwares';
      break;
    default:
      badType = true;
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
    case 'skill':
      type = 'CandidateSkill', as = 'skills';
      break;
    case 'equipment':
      type = 'CandidateEquipment', as = 'equipments';
      break;
    case 'software':
      type = 'CandidateSoftware', as = 'softwares';
      break;
    default:
      badType = true;
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
    where: { user_id: req.user.id },
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
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

User_Candidate.getWish = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.Wish.findOne({
      where: { id: req.params.id, candidate_id: candidate.id }
    }).then(wish => {
      if (!wish) return res.status(404).send({ body: req.body, error: 'Souhait introuvable.' });
      res.status(201).send({ get: true, wish })
    })
  })
};

User_Candidate.getESWish = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.Application.findAll({
      where: { wish_id: req.params.id, candidate_id: candidate.id },
      attributes: ['id', 'wish_id', 'candidate_id', 'es_id'],
      include: {
        model: Models.EstablishmentReference,
        attributes: ['id', 'finess_et', 'name'],
        on: {
          '$Application.ref_es_id$': {
            [Op.col]: 'EstablishmentReference.finess_et'
          }
        }
      }
    }).then(wish => {
      if (!wish) return res.status(404).send({ body: req.body, error: 'Souhait introuvable.' });
      res.status(201).send({ es: wish })
    })
  })
};

User_Candidate.getEditWish = (req, res, next) => {
  let render = { a: { main: 'applications' } };
  Models.Candidate.findOne({
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
        on: {
          '$applications.ref_es_id$': {
            [Op.col]: 'applications->EstablishmentReference.finess_et'
          }
        }
      }
    }]
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    render.candidate = candidate;
    render.wish = candidate.wishes[0];
    render.applications = candidate.applications;
    return Models.Post.findAll();
  }).then(posts => {
    render.posts = posts;
    return Models.Service.findAll();
  }).then(services => {
    render.services = services;
    return res.render('candidates/edit-application', render);
  }).catch(error => next(new Error(error)));
};

User_Candidate.editWish = (req, res, next) => {
  return Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
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
        }).then(() => {
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

User_Candidate.refreshWish = (req, res, next) => {
  return Models.Candidate.findOne({ where: { user_id: req.user.id } }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.Wish.findOne({
      where: {
        id: req.params.id,
        candidate_id: candidate.id,
        renewed_date: {
          [Op.lte]: moment().subtract(1, 'months').toDate()
        }
      }
    }).then(wish => {
      if (!wish) return res.status(400).send({ errors: 'Souhait introuvable.' });
      wish.renewed_date = new Date();
      wish.save().then(() => {
        return res.status(200).send({ result: 'updated' });
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
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.Wish.findOne({
      where: { id: req.params.id, candidate_id: candidate.id }
    }).then(wish => {
      if (!wish) return res.status(400).send({ body: req.body, error: 'Not exists' });
      wish.destroy().then(wish => res.status(201).send({ deleted: true, wish }));
    }).catch(error => next(new Error(error)));
  }).catch(error => next(new Error(error)));
};

User_Candidate.removeApplicationWish = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ body: req.body, errors: errors.array() });
  }
  return Models.Candidate.findOne({
    where: { user_id: req.user.id }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.Wish.findOne({ where: { id: req.params. id } }).then(wish => {
      if (!wish) return res.status(400).send({ error: 'Souhait introuvable' });
      Models.Application.findAll({
        where: { wish_id: req.params.id, candidate_id: candidate.id }
      }).then(countApp => {
        if (countApp.length <= 1) return res.status(400).send({ error: 'Vous devez garder au minimum un établissement dans votre souhait.' });
        Models.Application.findOne({
          where: { wish_id: req.params.id, candidate_id: candidate.id, ref_es_id: req.params.applicationId }
        }).then(application => {
          if (!application) return res.status(400).send({ error: 'Not exists' });
          application.destroy().then(application => {
            wish.es_count = countApp.length;
            wish.save();
            res.status(201).send({ deleted: true, application, count: wish.es_count })
          });
        }).catch(error => next(new Error(error)));
      }).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  });
};

User_Candidate.updatePercentage = (user, type) => {
  if (_.isNil(type)) return false;
  Models.Candidate.findOne({ where: { user_id: user.id } }).then(candidate => {
    if (_.isNil(candidate)) return false;
    let { percentage } = candidate;
    if (_.isNil(percentage)) percentage = {};
    switch (type) {
      case 'identity':
        if (!('profile' in percentage)) percentage.profile = { main: 0, description: 0, photo: 0 };
        Models.User.findOne({ where: { id: user.id } }).then(user => {
          if (user.firstName && user.lastName && user.phone && user.town) {
            percentage.profile.main = 20;
          } else percentage.profile.main = 0;

          if (!_.isNil(candidate.description) && candidate.description.length >= 500) {
            percentage.profile.description = 30;
          } else percentage.profile.description = 0;

          candidate.percentage = percentage;
          return User_Candidate.updateTotalPercentage(candidate, percentage);
        });
        break;
      case 'photo':
        if (!('profile' in percentage)) percentage.profile = { main: 0, description: 0, photo: 0 };
        if (user.photo) {
          percentage.profile.photo = 10;
        } else percentage.profile.photo = 0;
        candidate.percentage = percentage;
        return User_Candidate.updateTotalPercentage(candidate, percentage);
      case 'experiences':
        if (!('experiences' in percentage)) percentage.experiences = 0;
        Models.Experience.findAndCountAll({ where: { candidate_id: candidate.id } }).then(experiences => {
          if (experiences.count > 0) percentage.experiences = 10;
          else percentage.experiences = 0;
          candidate.percentage = percentage;
          return User_Candidate.updateTotalPercentage(candidate, percentage);
        });
        break;
      case 'formations':
        if (!('formations' in percentage)) percentage.formations = 0;
        Models.CandidateFormation.findAndCountAll({ where: { candidate_id: candidate.id } }).then(formations => {
          if (formations.count > 0) percentage.formations = 10;
          else percentage.formations = 0;
          candidate.percentage = percentage;
          return User_Candidate.updateTotalPercentage(candidate, percentage);
        });
        break;
      case 'documents':
        if (!('documents' in percentage)) percentage.documents = { DIP: 0, RIB: 0, CNI: 0, VIT: 0 };
        Models.CandidateDocument.findAll({ where: { candidate_id: candidate.id } }).then(documents => {
          let have = { DIP: false, CNI: false, RIB: false, VIT: false };
          documents.forEach(document => {
            if (document.type === 'DIP') have.DIP = true;
            if (document.type === 'RIB') have.RIB = true;
            if (document.type === 'CNI') have.CNI = true;
            if (document.type === 'VIT') have.VIT = true;
          });
          if (have.DIP) percentage.documents.DIP = 5;
          else percentage.documents.DIP = 0;
          if (have.RIB) percentage.documents.RIB = 5;
          else percentage.documents.RIB = 0;
          if (have.CNI) percentage.documents.CNI = 5;
          else percentage.documents.CNI = 0;
          if (have.VIT) percentage.documents.VIT = 5;
          else percentage.documents.VIT = 0;
          candidate.percentage = percentage;
          return User_Candidate.updateTotalPercentage(candidate, percentage);
        });
        break;
    }
  });
};

User_Candidate.updateWholePercentage = (user) => {
  Models.Candidate.findOne({ where: { user_id: user.id } }).then(candidate => {
    if (_.isNil(candidate)) return false;
    let { percentage } = candidate;
    if (_.isNil(percentage)) percentage = {};

    if (!('profile' in percentage)) percentage.profile = { main: 0, description: 0, photo: 0 };
    if (!('formations' in percentage)) percentage.formations = 0;
    if (!('experiences' in percentage)) percentage.experiences = 0;
    if (!('documents' in percentage)) percentage.documents = { DIP: 0, RIB: 0, CNI: 0, VIT: 0 };

    Models.Experience.findAndCountAll({ where: { candidate_id: candidate.id } }).then(experiences => {
      Models.CandidateFormation.findAndCountAll({ where: { candidate_id: candidate.id } }).then(formations => {
        Models.CandidateDocument.findAll({ where: { candidate_id: candidate.id } }).then(documents => {
          Models.User.findOne({ where: { id: user.id } }).then(user => {
            if (user.firstName && user.lastName && user.phone && user.town) {
              percentage.profile.main = 20;
            } else percentage.profile.main = 0;

            if (!_.isNil(candidate.description) && candidate.description.length >= 500) {
              percentage.profile.description = 30;
            } else percentage.profile.description = 0;

            if (user.photo) {
              percentage.profile.photo = 10;
            } else percentage.profile.photo = 0;

            if (experiences.count > 0) percentage.experiences = 10;
            else percentage.experiences = 0;

            if (formations.count > 0) percentage.formations = 10;
            else percentage.formations = 0;

            let have = { DIP: false, CNI: false, RIB: false, VIT: false };
            documents.forEach(document => {
              if (document.type === 'DIP') have.DIP = true;
              if (document.type === 'RIB') have.RIB = true;
              if (document.type === 'CNI') have.CNI = true;
              if (document.type === 'VIT') have.VIT = true;
            });
            if (have.DIP) percentage.documents.DIP = 5;
            else percentage.documents.DIP = 0;
            if (have.RIB) percentage.documents.RIB = 5;
            else percentage.documents.RIB = 0;
            if (have.CNI) percentage.documents.CNI = 5;
            else percentage.documents.CNI = 0;
            if (have.VIT) percentage.documents.VIT = 5;
            else percentage.documents.VIT = 0;
            candidate.percentage = percentage;

            return User_Candidate.updateTotalPercentage(candidate, percentage);
          });
        });
      });
    });
  });
};

User_Candidate.updateTotalPercentage = (candidate, percentage) => {
  if (_.isNil(candidate)) return false;
  if (Object.keys(percentage).length < 1) return false;
  if ('total' in percentage) delete percentage.total;
  percentage.total = 0;
  let scores = [];
  _.valuesIn(percentage).forEach((e) => {
    if (typeof e === 'object') {
      _.valuesIn(e).forEach(value => scores.push(value));
    } else scores.push(e);
  });
  percentage.total = _.sum(scores);
  candidate.percentage = percentage;
  candidate.save();
};

User_Candidate.viewConferences = (req, res, next) => {
  Models.Candidate.findOne({
    where: {
      user_id: req.user.id
    }, include: {
      model: Models.User
    }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    Models.Conference.findAll({ where: { candidate_id: candidate.id } }).then(conferences => {
      let a = { main: 'conferences' };
      return res.render('candidates/calendar', { a, conferences });
    })
  })
};

User_Candidate.viewUpload = (req, res, next) => {
  Models.Candidate.findOne({
    where: {
      user_id: req.user.id
    }, include: {
      model: Models.User
    }
  }).then(candidate => {
    if (_.isNil(candidate)) return next(new BackError('Candidat introuvable', 404));
    return res.render('candidates/upload', { candidate, layout: 'onepage' });
  })
};

User_Candidate.setAvailability = (req, res, next) => {
  Models.User.findOne({
    where: { id: req.user.id },
    include: {
      model: Models.Candidate,
      as: 'candidate',
      required: true
    }
  }).then(user => {
    if (_.isNil(user)) return res.status(400).send('Utilisateur introuvable.');
    user.candidate.is_available = req.body.available;
    user.candidate.save().then(result => {
      return res.status(200).send(result.is_available);
    });
  }).catch(error => next(new BackError(error)));
};

module.exports = User_Candidate;