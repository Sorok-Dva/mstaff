const { Authentication } = require('../middlewares');
const { BackOffice } = require('../components');
const express = require('express');
const fileUpload = require('../helpers/file-upload');
const router = express.Router();

/**
 * @Route('/back-office/') GET;
 * Show Back Office Index page
 */
router.get('/',
  Authentication.ensureIsAdmin,
  BackOffice.Main.viewIndex);

/**
 * @Route('/back-office/stats') GET;
 * Show Back Office Stats page
 */
router.get('/stats',
  Authentication.ensureIsAdmin,
  BackOffice.Main.ViewStats);

/**
 * @Route('/back-office/users/') GET;
 * Show Users List page
 */
router.get(
  '/users',
  Authentication.ensureIsAdmin,
  BackOffice.User.getAll);

/**
 * @Route('/back-office/users/candidates') GET;
 * Show Users (candidates type) List page
 */
router.get(
  '/users/:type',
  Authentication.ensureIsAdmin,
  BackOffice.User.getList);

/**
 * @Route('/back-office/user/:id(\\d+)/') GET;
 * Show User data
 */
router.get(
  '/user/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.User.findOne
).post(
  '/user/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.User.edit
).delete(
  '/user/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.User.delete);

/**
 * @Route('/back-office/impersonate/user/:id(\\d+)/') GET;
 * Impersonate User Session
 */
router.get('/impersonate/user/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.removeImpersonationBeforeNewIfExists,
  BackOffice.Impersonation.User);

/**
 * @Route('/back-office/removeImpersonation/') GET;
 * Remove Impersonation
 */
router.get('/removeImpersonation',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.Remove);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/') GET;
 * Generate PinCode for Remove Read Only
 */
router.post('/impersonateRemoveReadOnly',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.removeReadOnly);

router.get('/impersonatePutReadOnly',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.PutReadOnly);

/**
 * @Route('/back-office/impersonateRemoveReadOnly/validate/') GET;
 * Validation of removing read only
 */
router.post('/impersonateRemoveReadOnly/validate',
  Authentication.ensureIsAdmin,
  BackOffice.Impersonation.RemoveReadOnlyValidation);

/**
 * @Route('/back-office/establishments/') GET;
 * Show establishments referential
 */
router.get('/establishments',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.ViewRefList);

/**
 * @Route('/back-office/es/') GET;
 * Show ES List page
 */
router.get('/es',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.ViewList);

/**
 * @Route('/back-office/es/types') GET;
 * Show ES List page
 */
router.get('/es/types',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.ViewTypesList);

router.all('/es/types/create',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.TypesCreate);

router.get('/es/types/:id(\\d+)/delete',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.TypesDelete);

router.all('/es/types/:id(\\d+)/edit',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.TypesEdit);

/**
 * @Route('/back-office/es/:id(\\d+)') GET;
 * Show ES page
 */
router.get('/es/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Establishment.View
).post(
  '/es/:id(\\d+)',
  Authentication.ensureIsAdmin,
  fileUpload.getUploader((req) => {
    return 'public/uploads/es/' + req.params.id;
  }).fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]),
  BackOffice.Establishment.Edit);

/**
 * @Route('/back-office/references/:type') GET;
 * Show Reference Model data
 */
router.get('/references/:type',
  Authentication.ensureIsAdmin,
  BackOffice.Reference.View);

/**
 * @Route('/back-office/users/groups/') GET;
 * Show services data
 */
router.get('/groups', Authentication.ensureIsAdmin, BackOffice.Group.ViewGroups);

/**
 * @Route('/back-office/users/super-groups/') GET;
 * Show services data
 */
router.get('/super-groups', Authentication.ensureIsAdmin, BackOffice.Group.ViewSuperGroups);

/**
 * @Route('/back-office/configuration/skills') GET;
 * Show configuration of skills
 */
router.get('/configuration/skills', Authentication.ensureIsAdmin, BackOffice.Configuration.ViewSkills);

/**
 * @Route('/back-office/configuration/skills') GET;
 * Show configuration of categories
 */
router.get('/configuration/categories', Authentication.ensureIsAdmin, BackOffice.Configuration.ViewCategories);

/**
 * @Route('/back-office/configuration/equipments') GET;
 * Show configuration of equipments
 */
router.get('/configuration/equipments', Authentication.ensureIsAdmin, BackOffice.Configuration.ViewEquipments);

/**
 * @Route('/back-office/jobBoard/sheets') GET;
 * Show job sheets
 */
router.get('/jobBoard/sheets',
  Authentication.ensureIsAdmin,
  BackOffice.JobBoard.ViewJobSheets);

/**
 * @Route('/back-office/jobBoard/sheet/:id') GET;
 * Show job sheet form
 */
router.get('/jobBoard/sheet/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.JobBoard.ViewJobSheet)
  .post('/jobBoard/sheet/:id(\\d+)',
    Authentication.ensureIsAdmin,
    BackOffice.JobBoard.EditJobSheet);

/**
 * @Route('/back-office/settings/') GET;
 * Show app settings page
 */
router.get('/settings',
  Authentication.ensureIsAdmin,
  BackOffice.Main.ViewSettings);

/**
 * @Route('/back-office/pool-list') GET, POST;
 * Show and configure pools
 */
router.get('/pools/pool-list',
  Authentication.ensureIsAdmin,
  BackOffice.Pool.viewList
).post('/pools/pool-list',
  Authentication.ensureIsAdmin,
  BackOffice.Pool.createPool);

/**
 * @Route('/back-office/pool-links/') GET;
 * Show and configure links between pools and user
 */
router.get('/pools/pool-links',
  Authentication.ensureIsAdmin,
  BackOffice.Pool.viewLinks
).post('/pools/pool-links',
  Authentication.ensureIsAdmin,
  BackOffice.Pool.forceLink
);

/**
 * @Route('/back-office/pool-dependencies/all') GET;
 * Get all dependencies to make new links
 */
router.get('/pool-dependencies/all',
  Authentication.ensureIsAdmin,
  BackOffice.Pool.linkDependencies);

/** @Route('/back-office/server/db_dumps') GET;
 * Show database dumps list
 */
router.get('/server/db_dumps',
  Authentication.ensureIsAdmin,
  BackOffice.Server.ViewDatabaseDumps);

router.get(
  '/server/message/:id(\\d+)',
  Authentication.ensureIsAdmin,
  BackOffice.Server.viewMessage
);

router.get(
  '/server/add/message/',
  Authentication.ensureIsAdmin,
  BackOffice.Server.RenderAddMessage
);

module.exports = router;
