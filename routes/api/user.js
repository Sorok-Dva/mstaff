const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user');

router.get('/emailAvailable/:email', UserController.ApiVerifyEmailAvailability);

module.exports = router;