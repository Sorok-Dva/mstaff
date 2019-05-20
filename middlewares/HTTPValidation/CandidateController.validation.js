const { check } = require('express-validator/check');
const _ = require('lodash');
const moment = require('moment');
const HTTPValidation = {};


HTTPValidation.ats = [
  //TODO fix les boolean
  check('experiences').custom( (value, {req}) => {
    console.log(req.body.experiences);
    if (value !== '1'){
      console.log('EXPERIENCESSSSSSSSSSSSSSSS', value);
      console.log(typeof value);

      value.forEach(xp => {
        if (xp.name.length < 3)
          throw new Error('name doit avoir au minimum 3 caractères');
        else if (isNaN(xp.post_id))
          throw new Error('post_id doit être numérique');
        else if (isNaN(xp.service_id))
          throw new Error('service_id doit être numérique');
        else if (!_.isBoolean(xp.internship))
          throw new Error('internship doit être un booléen');
        else if (!_.isBoolean(xp.current))
          throw new Error('current doit être un booléen');
        else if (moment(xp.start).isAfter(new Date()) && moment(xp.start).isAfter(xp.end))
          throw new Error("la date de départ doit être antérieur à la date courante et d'arrivée");
      });
    }
  }),
  check('diplomas').custom((value) => {
    console.log('DIPLOMASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS', value);
    if (!_.isNil(value)){
      value.forEach(diploma => {
        if (diploma.name.length < 3)
          throw new Error('Name doit avoir au minimum 3 caractères');
        else if (moment(diploma.start).isAfter(new Date()) && moment(diploma.start).isAfter(diploma.end))
          throw new Error("La date de départ doit être antérieur à la date courante et d'arrivée");
      });
    }
  }),
  check('qualifications').custom((value) => {
    console.log('QUALIFICATIONSSSSSSSSSSSSSSSSSSSSSSSS', value);
    if (!_.isNil(value)){
      value.forEach(qualification => {
        if (qualification.name.length < 3)
          throw new Error('Name doit avoir au minimum 3 caractères');
        else if (moment(qualification.start).isAfter(new Date()) && moment(qualification.start).isAfter(qualification.end))
          throw new Error("La date de départ doit être antérieur à la date courante et d'arrivée");
      });
    }
  }),
  check('skills').custom((value) => {
    console.log('SKILLSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS', value);
    if (!_.isNil(value)){
      value.forEach(skill => {
        if (skill.name.length < 3)
          throw new Error('Name doit avoir au minimum 3 caractères');
        else if (isNaN(skill.stars))
          throw new Error('stars doit être numérique');
      });
    }
  }),
];

HTTPValidation.postAddExperience = [
  check('name').isLength({ min: 3 }),
  check('post_id').isNumeric(),
  check('service_id').isNumeric(),
  check('internship').isBoolean(),
  check('current').isBoolean()

  //TODO check wish
];

HTTPValidation.postAddFormation = [
  check('name').isLength({ min: 3 })
];

HTTPValidation.postAddDiploma = [
  check('name').isLength({ min: 3 })
];

HTTPValidation.putFormation = [
  check('name').isLength({ min: 4 })
];

HTTPValidation.getWish = [
  check('id').isNumeric()
];

HTTPValidation.removeWish = [
  check('id').isNumeric()
];

HTTPValidation.getEditWish = [
  check('id').isNumeric()
];

HTTPValidation.checkPassEdit = [
  check('oldPassword').isLength({ min: 8 }),
  check('newPassword').isLength({ min: 8 }),
  check('newPasswordVerification').isLength({ min: 8 }),
];

module.exports = HTTPValidation;