const Models = require('../models/index');

module.exports = {
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
  }
};