const { Authentication } = require('../middlewares/index');
const ESSubdomainController = require('../controllers/establishment.subdomain');
const express = require('express');
const router = express.Router();

router.get('/', ESSubdomainController.getIndex);

router.get('/register', Authentication.ensureIsNotAuthenticated, ESSubdomainController.getRegister);

module.exports = router;