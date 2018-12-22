const { check, validationResult } = require('express-validator/check');

const Models = require('../models/index');

module.exports = {
  /**
   * validate MiddleWare
   * @param method
   * @description Form Validator. Each form validation must be created in new case.
   */
  validate: (method) => {
    switch (method) {
    case 'postAddExperience': {
      return [
        check('name').isLength({ min: 3 }),
        check('post_id').isNumeric(),
        check('service_id').isNumeric(),
        check('internship').isBoolean(),
        check('current').isBoolean()
      ]
    }
    }
  },
  addVideo: (req, res, next) => {

  },
  getProfile: (req, res, next) => {
    if (req.user.type === 'candidate') {
      Models.User.findOne({
        where: { id: req.user.id },
        include:[{
          model: Models.Candidate, // Candidate Associations (user.candidate)
          as: 'candidate',
          include:[{
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
            as: 'qualifications',
            include: {
              model: Models.Qualification,
              as: 'diploma'
            } // Qualifications Associations (user.candidate.qualifications.qualification)
          }, {
            model: Models.CandidateFormation, // CandidateFormations Associations (user.candidate.formations)
            as: 'formations',
            include: {
              model: Models.Formation,
              as: 'formation'
            } // Formations Associations (user.candidate.formations.formation)
          }, {
            model: Models.CandidateSkill, // CandidateSkills Associations (user.candidate.skills)
            as: 'skills',
            include: {
              model: Models.Skill,
              as: 'skill'
            } // Skills Associations (user.candidate.skills.skill)
          }, {
            model: Models.CandidateEquipment, // CandidateEquipment Associations (user.candidate.skills)
            as: 'equipments',
            include: {
              model: Models.Equipment,
              as: 'equipment'
            } // Equipments Associations (user.candidate.equipments.equipment)
          }, {
            model: Models.CandidateSoftware, // Softwares Associations (user.candidate.softwares)
            as: 'softwares',
            include: {
              model: Models.Software,
              as: 'software'
            } // Skills Associations (user.candidate.softwares.software)
          }]
        }]
      }).then(user => {
        console.log(user.candidate);
        return res.render('users/profile', { user, a: { main: 'profile' } })
      }).catch(error => next(new Error(error)));
    }
  },
  getEditProfile: (req, res, next) => {
    if (req.user.type === 'candidate') {
      Models.User.findOne({
        where: { id: req.user.id },
        include:[{
          model: Models.Candidate,
          as: 'candidate'
        }]
      }).then(user => {
        return res.render('users/edit', { user, a: { main: 'profile' } })
      }).catch(error => next(error));
    }
  },
  getFormationsAndXP: (req, res, next) => {
    Models.User.findOne({
      where: { id: req.user.id },
      include:[{
        model: Models.Candidate, // Candidate Associations (user.candidate)
        as: 'candidate',
        include:[{
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
          as: 'qualifications',
          include: {
            model: Models.Qualification,
            as: 'diploma'
          } // Qualifications Associations (user.candidate.qualifications.qualification)
        }, {
          model: Models.CandidateFormation, // CandidateFormations Associations (user.candidate.formations)
          as: 'formations',
          include: {
            model: Models.Formation,
            as: 'formation'
          } // Formations Associations (user.candidate.formations.formation)
        }]
      }]
    }).then(user => {
      Models.Post.findAll().then(posts => {
        Models.Service.findAll().then(services => {
          return res.render('users/formations', { user, posts, services, a: { main: 'cv' } })
        }).catch(error => next(new Error(error)));
      }).catch(error => next(new Error(error)));
    }).catch(error => next(new Error(error)));
  },
  postAddExperience: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ body: req.body, errors: errors.array() });
    }

    Models.Experience.create({
      name: req.body.name,
      candidate_id: req.user.id,
      poste_id: parseInt(req.body.post_id),
      service_id: parseInt(req.body.service_id),
      internship: req.body.internship,
      current: req.body.current,
      start: req.body.start,
      end: req.body.end || null
    }).then(experience => {
      res.status(200).send({ experience });
    }).catch(error => res.status(400).send({ body: req.body, sequelizeError: error }));
  }
};