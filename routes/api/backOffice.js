const { Authentication, HTTPValidation } = require('../../middlewares/index');
const Controller = require('../../controllers/backOffice');
const express = require('express');
const router = express.Router();

router.get(
  '/establishmentsReferences',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Establishment.getRefList);

router.post(
  '/establishmentsReferences/info/:id',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Establishment.getRefInfo);

router.post(
  '/establishmentsReferences/info/:id/toCreate',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Establishment.getRefInfoToCreate);

router.post('/establishment/create',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.createEstablishmentFromReference,
  Controller.BackOffice.Establishment.create);

router.post('/establishment/:id/add/user',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  Controller.BackOffice.Establishment.addUser);

router.post('/establishment/:id/remove/user/:userId',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  Controller.BackOffice.Establishment.removeUser);

router.post('/establishment/:id/edit/user/:userId',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Establishment.editUserRole);

router.get('/establishment/:esId/needs', Authentication.ensureIsAdmin, Controller.BackOffice.Establishment.getNeeds);
router.get('/establishment/:esId/need/:id', Authentication.ensureIsAdmin, Controller.BackOffice.Establishment.getNeed);
router.post('/candidates/sendVerifEmail/', Authentication.ensureIsAdmin, Controller.sendCandidateVerifEmail);

/**
 * @Route('/back-office/references/:type') POST;
 * Create Reference Model data
 */
router.post('/references/:type',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Reference.Add
).put('/references/:type/:id',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Reference.Edit
).delete('/references/:type/:id',
  Authentication.ensureIsAdmin,
  Controller.BackOffice.Reference.Delete);

router.put('/groups/:id', Authentication.ensureIsAdmin, Controller.editGroups)
  .delete('/groups/:id', Authentication.ensureIsAdmin, Controller.removeGroups)
  .post('/groups/', Authentication.ensureIsAdmin, Controller.addGroups);

router.put('/super-groups/:id', Authentication.ensureIsAdmin, Controller.editSuperGroups)
  .delete('/super-groups/:id', Authentication.ensureIsAdmin, Controller.removeSuperGroups)
  .post('/super-groups/', Authentication.ensureIsAdmin, Controller.addSuperGroups);

module.exports = router;