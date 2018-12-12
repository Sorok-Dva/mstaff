const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User');
const IndexController = require('../controllers/index');

router.get('/', IndexController.getIndex);
router.get('/login', UserController.ensureIsNotAuthenticated, IndexController.getLogin);

module.exports = router;