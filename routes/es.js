const { Authentication } = require('../middlewares/index');
const { Establishment } = require('../components');
const express = require('express');
const router = express.Router();

/**
 * @Route('/select/es') GET;
 * Show Select Establishments Page
 */
router.get('/select/es',
  Authentication.ensureIsEs,
  Establishment.Main.ViewAccounts);

router.get('/select/es/:currentEsId',
  Authentication.ensureIsEs,
  Establishment.Main.Select);

/**
 * @Route('/candidates') GET;
 * Show Candidates Index page
 */
router.get('/candidates',
  Authentication.ensureIsEs,
  Establishment.Application.getCVs);

/**
 * @Route('/needs') GET;
 * Show Needs Index page
 */
router.get('/needs',
  Authentication.ensureIsEs,
  Establishment.Need.ViewAll);

/**
 * @Route('/need/:id(\\d+)') GET;
 * Show Specific Need Page
 */
router.get('/need/:id(\\d+)',
  Authentication.ensureIsEs,
  Establishment.Need.View);

/**
 * @Route('/history/:id(\\d+)') GET;
 * Show Specific History Need Page
 */
router.get('/history/:id(\\d+)',
  Authentication.ensureIsEs,
  Establishment.Need.ViewHistory);

/**
 * @Route('/history') GET;
 * Show History page
 */
router.get('/history',
  Authentication.ensureIsEs,
  Establishment.Need.ViewClosed);

module.exports = router;
