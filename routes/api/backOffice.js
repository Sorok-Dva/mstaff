const express = require('express');
const router = express.Router();
const BackOfficeController = require('../../controllers/backOffice');
const UserController = require('../../controllers/user');

router.post('/candidates/sendVerifEmail/', UserController.ensureIsAdmin, BackOfficeController.sendCandidateVerifEmail);

router.put('/formations/:id', UserController.ensureIsAdmin, BackOfficeController.editFormation)
  .delete('/formations/:id', UserController.ensureIsAdmin, BackOfficeController.removeFormation)
  .post('/formations/', UserController.ensureIsAdmin, BackOfficeController.addFormation);

router.put('/skills/:id', UserController.ensureIsAdmin, BackOfficeController.editSkill)
  .delete('/skills/:id', UserController.ensureIsAdmin, BackOfficeController.removeSkill)
  .post('/skills/', UserController.ensureIsAdmin, BackOfficeController.addSkill);

router.put('/equipments/:id', UserController.ensureIsAdmin, BackOfficeController.editEquipment)
  .delete('/equipments/:id', UserController.ensureIsAdmin, BackOfficeController.removeEquipment)
  .post('/equipments/', UserController.ensureIsAdmin, BackOfficeController.addEquipment);

router.put('/softwares/:id', UserController.ensureIsAdmin, BackOfficeController.editSoftware)
  .delete('/softwares/:id', UserController.ensureIsAdmin, BackOfficeController.removeSoftware)
  .post('/softwares/', UserController.ensureIsAdmin, BackOfficeController.addSoftware);

router.put('/services/:id', UserController.ensureIsAdmin, BackOfficeController.editService)
  .delete('/services/:id', UserController.ensureIsAdmin, BackOfficeController.removeService)
  .post('/services/', UserController.ensureIsAdmin, BackOfficeController.addService);

router.put('/posts/:id', UserController.ensureIsAdmin, BackOfficeController.editPost)
  .delete('/posts/:id', UserController.ensureIsAdmin, BackOfficeController.removePost)
  .post('/posts/', UserController.ensureIsAdmin, BackOfficeController.addPost);

router.put('/qualifications/:id', UserController.ensureIsAdmin, BackOfficeController.editQualification)
  .delete('/qualifications/:id', UserController.ensureIsAdmin, BackOfficeController.removeQualification)
  .post('/qualifications/', UserController.ensureIsAdmin, BackOfficeController.addQualification);

module.exports = router;