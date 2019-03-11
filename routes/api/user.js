const { HTTPValidation } = require('../../middlewares');
const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user');

router.get('/emailAvailable/:email',
  HTTPValidation.UserController.ApiVerifyEmailAvailability,
  UserController.ApiVerifyEmailAvailability);

module.exports = router;