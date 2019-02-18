const express = require('express');
const router = express.Router();
const backOfficeController = require('../../controllers/backOffice');
const userController = require('../../controllers/user');

router.put('/formations/:id', userController.ensureIsAdmin, backOfficeController.editFormation)
  .delete('/formations/:id', userController.ensureIsAdmin, backOfficeController.removeFormation)
  .post('/formations/', userController.ensureIsAdmin, backOfficeController.addFormation);

router.put('/skills/:id', userController.ensureIsAdmin, backOfficeController.editSkill)
  .delete('/skills/:id', userController.ensureIsAdmin, backOfficeController.removeSkill)
  .post('/skills/', userController.ensureIsAdmin, backOfficeController.addSkill);

router.put('/equipments/:id', userController.ensureIsAdmin, backOfficeController.editEquipment)
  .delete('/equipments/:id', userController.ensureIsAdmin, backOfficeController.removeEquipment)
  .post('/equipments/', userController.ensureIsAdmin, backOfficeController.addEquipment);

router.put('/softwares/:id', userController.ensureIsAdmin, backOfficeController.editSoftware)
  .delete('/softwares/:id', userController.ensureIsAdmin, backOfficeController.removeSoftware)
  .post('/softwares/', userController.ensureIsAdmin, backOfficeController.addSoftware);

router.put('/services/:id', userController.ensureIsAdmin, backOfficeController.editService)
  .delete('/services/:id', userController.ensureIsAdmin, backOfficeController.removeService)
  .post('/services/', userController.ensureIsAdmin, backOfficeController.addService);

router.put('/posts/:id', userController.ensureIsAdmin, backOfficeController.editPost)
  .delete('/posts/:id', userController.ensureIsAdmin, backOfficeController.removePost)
  .post('/posts/', userController.ensureIsAdmin, backOfficeController.addPost);

router.put('/qualifications/:id', userController.ensureIsAdmin, backOfficeController.editQualification)
  .delete('/qualifications/:id', userController.ensureIsAdmin, backOfficeController.removeQualification)
  .post('/qualifications/', userController.ensureIsAdmin, backOfficeController.addQualification);

module.exports = router;