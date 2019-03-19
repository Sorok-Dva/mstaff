const __ = process.cwd();
const { HTTPValidation } = require(`${__}/middlewares`);
const express = require('express');
const router = express.Router();

const Controller = require(`${__}/components/user`);

router.get('/emailAvailable/:email',
  HTTPValidation.UserController.ApiVerifyEmailAvailability,
  Controller.Main.verifyEmailAvailability);

module.exports = router;