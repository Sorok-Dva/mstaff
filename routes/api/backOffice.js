const { Authentication, HTTPValidation } = require('../../middlewares/index');
const BackOfficeController = require('../../controllers/backOffice');
const express = require('express');
const router = express.Router();

router.get(
  '/establishmentsReferences',
  Authentication.ensureIsAdmin,
  BackOfficeController.BackOffice.Establishment.getRefList);

router.post(
  '/establishmentsReferences/info/:id',
  Authentication.ensureIsAdmin,
  BackOfficeController.BackOffice.Establishment.getRefInfo);

router.post(
  '/establishmentsReferences/info/:id/toCreate',
  Authentication.ensureIsAdmin,
  BackOfficeController.BackOffice.Establishment.getRefInfoToCreate);

router.post('/establishment/create',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.createEstablishmentFromReference,
  BackOfficeController.APICreateEstablishment);

router.post('/establishment/:id/add/user',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  BackOfficeController.APIAddUserInEstablishment);

router.post('/establishment/:id/remove/user/:userId',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  BackOfficeController.APIRemoveUserFromEstablishment);

router.post('/establishment/:id/edit/user/:userId',
  Authentication.ensureIsAdmin,
  BackOfficeController.APIEditUserEstablishmentRole);

router.get('/establishment/:esId/needs', Authentication.ensureIsAdmin, BackOfficeController.APIshowESNeeds);
router.get('/establishment/:esId/need/:id', Authentication.ensureIsAdmin, BackOfficeController.APIshowESNeed);
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

router.put('/groups/:id', Authentication.ensureIsAdmin, BackOfficeController.editGroups)
  .delete('/groups/:id', Authentication.ensureIsAdmin, BackOfficeController.removeGroups)
  .post('/groups/', Authentication.ensureIsAdmin, BackOfficeController.addGroups);

router.put('/super-groups/:id', Authentication.ensureIsAdmin, BackOfficeController.editSuperGroups)
  .delete('/super-groups/:id', Authentication.ensureIsAdmin, BackOfficeController.removeSuperGroups)
  .post('/super-groups/', Authentication.ensureIsAdmin, BackOfficeController.addSuperGroups);

module.exports = router;