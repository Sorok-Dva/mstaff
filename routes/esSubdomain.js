const { Authentication } = require('../middlewares/index');
const Controller = require('../controllers/establishment');
const express = require('express');
const router = express.Router();

router.get('/',
  Controller.Establishment.Website.getIndex);

router.get('/register',
  Authentication.ensureIsNotAuthenticated,
  Controller.Establishment.Website.getRegister);

module.exports = router;