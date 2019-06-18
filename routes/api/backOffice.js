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

router.post('/establishment/:id(\\d+)/remove/user/:userId',
  Authentication.ensureIsAdmin,
  HTTPValidation.BackOfficeController.addUserInEstablishment,
  BackOffice.Establishment.removeUser);

router.post('/establishment/:id(\\d+)/edit/user/:userId',
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
router.post('/references/categories',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.AddCategory
).put('/references/categories/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.EditCategory
).delete('/references/categories/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.DeleteCategory);

router.post('/references/:type',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.Add
).put('/references/:type/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.Edit
).delete('/references/:type/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.Delete);

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

router.put('/groups/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.EditGroup)
  .delete('/groups/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.RemoveGroup)
  .post('/groups/', Authentication.ensureIsAdmin, BackOffice.Group.AddGroup);

router.get('/groups/:id(\\d+)/users/all', Authentication.ensureIsAdmin, BackOffice.Group.getUsersFromGroup);

router.put('/groups/:id(\\d+)/add/user', Authentication.ensureIsAdmin, BackOffice.Group.addUserGroup);
/*
  .post('/groups/:id(\\d+)/edit/user/:userId', Authentication.ensureIsAdmin, BackOffice.Group.editUser)
  .delete('/groups/:id(\\d+)/remove/user/:userId', Authentication.ensureIsAdmin, BackOffice.Group.removeUser);
*/
router.put('/super-groups/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.EditSuperGroup)
  .delete('/super-groups/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.RemoveSuperGroup)
  .post('/super-groups/', Authentication.ensureIsAdmin, BackOffice.Group.AddSuperGroup);

router.put('/linkES/:id',
  Authentication.ensureIsAdmin,
  BackOffice.Group.EditLinkES);

router.put('/linkGroup/:id',
  Authentication.ensureIsAdmin,
  BackOffice.Group.EditLinkGroup);

/**
 * @Route('/back-office/references/:type') POST;
 * Create Reference Model data
 */

router.get('/eslinks/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Establishment.getEsLinksList);
router.get('/groupslinks/:id(\\d+)', Authentication.ensureIsAdmin, BackOffice.Group.getGroupLinksList);
router.get('/establishments/all', Authentication.ensureIsAdmin, BackOffice.Establishment.getEstablishmentList);

module.exports = router;