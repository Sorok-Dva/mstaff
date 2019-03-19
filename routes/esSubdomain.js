const { Authentication } = require('../middlewares/index');
const { Establishment } = require('../components');
const express = require('express');
const router = express.Router();

router.get('/',
  Establishment.Website.getIndex);

router.get('/register',
  Authentication.ensureIsNotAuthenticated,
  Establishment.Website.getRegister);

module.exports = router;