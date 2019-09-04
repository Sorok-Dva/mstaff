const { Authentication, HTTPValidation } = require('../../middlewares/index');
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

router.post('/establishment/:id(\\d+)/remove/user/:userId(\\d+)',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  BackOffice.Establishment.removeUser);

router.post('/establishment/:id(\\d+)/edit/user/:userId(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.editUserRole);

router.get('/establishment/:esId(\\d+)/needs', Authentication.ensureIsAdmin, BackOffice.Establishment.getNeeds);
router.get('/establishment/:esId(\\d+)/need/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Establishment.getNeed);
router.post('/candidates/sendVerifEmail/', Authentication.ensureIsAdmin, BackOffice.User.sendVerificationEmail);
router.post('/candidates/resetProfilePercentage/', Authentication.ensureIsAdmin, BackOffice.User.resetProfilePercentage);

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

router.put('/references/posts/multiple/category',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.EditMulTipleCategory);

router.post('/configuration/skills/',
  Authentication.ensureIsAdmin,
  BackOffice.Configuration.AddSkill)
  .delete('/configuration/skills/:id(\\d+)',
    Authentication.ensureIsAdmin,
    BackOffice.Configuration.RemoveSkill);

router.put('/configuration/category/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Configuration.LinkCategory);

router.post('/configuration/equipments/',
  Authentication.ensureIsAdmin,
  BackOffice.Configuration.AddEquipment)
  .delete('/configuration/equipments/:id(\\d+)',
    Authentication.ensureIsAdmin,
    BackOffice.Configuration.RemoveEquipment);

router.put('/groups/:type/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.Edit)
  .delete('/groups/:type/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.Remove)
  .post('/groups/:type', Authentication.ensureIsAdmin, BackOffice.Group.Add);

router.get('/groups/:type/:id(\\d+)/users/all', Authentication.ensureIsAdmin, BackOffice.Group.getUsers)
  .put('/groups/:type/:id(\\d+)/add/user', Authentication.ensureIsAdmin, BackOffice.Group.addUser)
  .post('/groups/:type/:id(\\d+)/edit/user/:userId(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.editUser)
  .delete('/groups/:type/:id(\\d+)/remove/user/:userId(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.removeUser);

router.get('/groups/:type/:id(\\d+)/user/:user_id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.getEsFromUser);

router.post('/groups/:type/linkES/:id(\\d+)/user/:userId(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.EditLinkES)
  .get('/groups/:type/linkES/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.GetLinkES);

router.put('/linkGroup/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Group.EditLinkGroup);

/**
 * @Route('/back-office/references/:type') POST;
 * Create Reference Model data
 */
router.get('/eslinks/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Establishment.getEsLinksList);
router.get('/groupslinks/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.getGroupLinksList);
router.get('/establishments/all', Authentication.ensureIsAdmin, BackOffice.Establishment.getEstablishmentList);

router.get(
  '/server/db_dumps/:name',
  Authentication.ensureIsAdmin,
  BackOffice.Server.DownloadDatabaseDumps)
  .delete(
    '/server/db_dumps/:name',
    Authentication.ensureIsAdmin,
    BackOffice.Server.RemoveDatabaseDumps
  );

module.exports = router;