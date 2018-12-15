const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user');

router.get('/emailAvailable/:email',
  UserController.validate('ApiVerifyEmailAvailability'),
  UserController.ApiVerifyEmailAvailability);

module.exports = router;