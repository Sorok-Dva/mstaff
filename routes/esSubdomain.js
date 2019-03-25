const { Authentication } = require('../middlewares/index');
const { Establishment } = require('../components');
const express = require('express');
const router = express.Router();

router.get('/',
  Establishment.Website.ViewIndex);

router.get('/register',
  Authentication.ensureIsNotAuthenticated,
  Establishment.Website.ViewRegister);

router.get('/posts/all',
  Establishment.Website.GetPosts);

module.exports = router;