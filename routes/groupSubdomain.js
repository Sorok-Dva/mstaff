const { Authentication } = require('../middlewares/index');
const { Subdomain, User } = require('../components');
const { HTTPValidation } = require('../middlewares/');
const express = require('express');
const router = express.Router();

// router.get('/postuler', (req, res, next) => res.redirect('/join'));

router.get('/',
  Subdomain.Group.ViewIndex);

router.get('/join',
  Subdomain.Group.ViewATS);

module.exports = router;