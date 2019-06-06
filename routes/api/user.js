const __ = process.cwd();
const { HTTPValidation, Authentication } = require(`${__}/middlewares`);
const express = require('express');
const router = express.Router();

const { User, Notification } = require(`${__}/components`);

router.delete('/account',
  HTTPValidation.UserController.ApiVerifyPassword,
  User.Main.Delete);

router.get('/emailAvailable/:email',
  HTTPValidation.UserController.ApiVerifyEmailAvailability,
  User.Main.verifyEmailAvailability);

router.get('/notifications',
  Authentication.ensureAuthenticated,
  Notification.Main.getAndCount);

router.put('/notification/read',
  Authentication.ensureAuthenticated,
  Notification.Main.read);

router.get('/notification/:id(\\d+)',
  Authentication.ensureAuthenticated,
  Notification.Main.view);

module.exports = router;