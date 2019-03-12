const { Authentication, HTTPValidation } = require('../../middlewares/index');
const BackOfficeController = require('../../controllers/backOffice');
const express = require('express');
const router = express.Router();

router.get('/establishmentsReferences', Authentication.ensureIsAdmin, BackOfficeController.APIgetEstablishmentsRefList);
router.post('/establishmentsReferences/info/:id', Authentication.ensureIsAdmin, BackOfficeController.APIgetEstablishmentRefInfo);
router.post('/establishmentsReferences/info/:id/toCreate', Authentication.ensureIsAdmin, BackOfficeController.APIgetEstablishmentRefInfoToCreate);

router.post('/establishment/create',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.createEstablishmentFromReference,
  BackOfficeController.APICreateEstablishment);

router.post('/candidates/sendVerifEmail/', Authentication.ensureIsAdmin, BackOfficeController.sendCandidateVerifEmail);

router.put('/formations/:id', Authentication.ensureIsAdmin, BackOfficeController.editFormation)
  .delete('/formations/:id', Authentication.ensureIsAdmin, BackOfficeController.removeFormation)
  .post('/formations/', Authentication.ensureIsAdmin, BackOfficeController.addFormation);

router.put('/skills/:id', Authentication.ensureIsAdmin, BackOfficeController.editSkill)
  .delete('/skills/:id', Authentication.ensureIsAdmin, BackOfficeController.removeSkill)
  .post('/skills/', Authentication.ensureIsAdmin, BackOfficeController.addSkill);

router.put('/equipments/:id', Authentication.ensureIsAdmin, BackOfficeController.editEquipment)
  .delete('/equipments/:id', Authentication.ensureIsAdmin, BackOfficeController.removeEquipment)
  .post('/equipments/', Authentication.ensureIsAdmin, BackOfficeController.addEquipment);

router.put('/softwares/:id', Authentication.ensureIsAdmin, BackOfficeController.editSoftware)
  .delete('/softwares/:id', Authentication.ensureIsAdmin, BackOfficeController.removeSoftware)
  .post('/softwares/', Authentication.ensureIsAdmin, BackOfficeController.addSoftware);

router.put('/services/:id', Authentication.ensureIsAdmin, BackOfficeController.editService)
  .delete('/services/:id', Authentication.ensureIsAdmin, BackOfficeController.removeService)
  .post('/services/', Authentication.ensureIsAdmin, BackOfficeController.addService);

router.put('/posts/:id', Authentication.ensureIsAdmin, BackOfficeController.editPost)
  .delete('/posts/:id', Authentication.ensureIsAdmin, BackOfficeController.removePost)
  .post('/posts/', Authentication.ensureIsAdmin, BackOfficeController.addPost);

router.put('/qualifications/:id', Authentication.ensureIsAdmin, BackOfficeController.editQualification)
  .delete('/qualifications/:id', Authentication.ensureIsAdmin, BackOfficeController.removeQualification)
  .post('/qualifications/', Authentication.ensureIsAdmin, BackOfficeController.addQualification);

module.exports = router;