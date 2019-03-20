const { Authentication, HTTPValidation } = require('../../middlewares/index');
const Controller = require('../../controllers/backOffice');
const { BackOffice } = require('../../components');
const express = require('express');
const router = express.Router();

router.get(
  '/establishmentsReferences',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.getRefList);

router.post(
  '/establishmentsReferences/info/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.getRefInfo);

router.post(
  '/establishmentsReferences/info/:id(\\d+)/toCreate',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.getRefInfoToCreate);

router.post('/establishment/create',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.createEstablishmentFromReference,
  BackOffice.Establishment.create);

router.post('/establishment/:id(\\d+)/add/user',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  BackOffice.Establishment.addUser);

router.post('/establishment/:id(\\d+)/remove/user/:userId',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  BackOffice.Establishment.removeUser);

router.post('/establishment/:id(\\d+)/edit/user/:userId',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.editUserRole);

router.get('/establishment/:esId/needs', Authentication.ensureIsAdmin, BackOffice.Establishment.getNeeds);
router.get('/establishment/:esId/need/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Establishment.getNeed);
router.post('/candidates/sendVerifEmail/', Authentication.ensureIsAdmin, BackOffice.User.sendVerificationEmail);

/**
 * @Route('/back-office/references/:type') POST;
 * Create Reference Model data
 */
router.post('/references/:type',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.Add
).put('/references/:type/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.Edit
).delete('/references/:type/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.Delete);

router.put('/groups/:id(\\d+)', Authentication.ensureIsAdmin, Controller.editGroups)
  .delete('/groups/:id(\\d+)', Authentication.ensureIsAdmin, Controller.removeGroups)
  .post('/groups/', Authentication.ensureIsAdmin, Controller.addGroups);

router.put('/super-groups/:id(\\d+)', Authentication.ensureIsAdmin, Controller.editSuperGroups)
  .delete('/super-groups/:id(\\d+)', Authentication.ensureIsAdmin, Controller.removeSuperGroups)
  .post('/super-groups/', Authentication.ensureIsAdmin, Controller.addSuperGroups);

module.exports = router;