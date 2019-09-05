const { Subdomain } = require('../components');
const express = require('express');
const router = express.Router();

router.get('/',
  Subdomain.SuperGroup.ViewIndex);

module.exports = router;