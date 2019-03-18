const { Authentication } = require('../middlewares/index');
const Controller = require('../controllers/establishment');
const express = require('express');
const router = express.Router();

/**
 * @Route('/select/es') GET;
 * Show Select Establishments Page
 */
router.get('/select/es',
  Authentication.ensureIsEs,
  Controller.Establishment.Main.ViewAccounts);

router.get('/select/es/:currentEsId',
  Authentication.ensureIsEs,
  Controller.Establishment.Main.Select);

/**
 * @Route('/candidates') GET;
 * Show Candidates Index page
 */
router.get('/candidates',
  Authentication.ensureIsEs,
  Controller.Establishment.Need.ViewCreate);

/**
 * @Route('/needs') GET;
 * Show Needs Index page
 */
router.get('/needs',
  Authentication.ensureIsEs,
  Controller.Establishment.Need.ViewAll);

/**
 * @Route('/need/:id') GET;
 * Show Specific Need Page
 */
router.get('/need/:id',
  Authentication.ensureIsEs,
  Controller.Establishment.Need.View);

module.exports = router;
