const express = require('express');
const router = express.Router();
const backOfficeController = require('../../controllers/backOffice');
const userController = require('../../controllers/user');

router.put('/formations/:id', userController.ensureIsAdmin, backOfficeController.editFormation)
  .delete('/formations/:id', userController.ensureIsAdmin);

module.exports = router;