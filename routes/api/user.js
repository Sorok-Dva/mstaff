const __ = process.cwd();
const { HTTPValidation } = require(`${__}/middlewares`);
const express = require('express');
const router = express.Router();

const { User } = require(`${__}/components`);

router.get('/emailAvailable/:email',
  HTTPValidation.UserController.ApiVerifyEmailAvailability,
  User.Main.verifyEmailAvailability);

module.exports = router;