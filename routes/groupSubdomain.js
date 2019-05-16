const { Authentication } = require('../middlewares/index');
const { Subdomain, User } = require('../components');
const { HTTPValidation } = require('../middlewares/');
const express = require('express');
const router = express.Router();

router.get('/',
  Subdomain.Group.ViewIndex);

module.exports = router;