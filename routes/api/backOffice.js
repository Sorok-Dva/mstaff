const express = require('express');
const router = express.Router();
const backOfficeController = require('../../controllers/backOffice');
const userController = require('../../controllers/user');

router.put('/formations/:id', userController.ensureIsAdmin, backOfficeController.editFormation)
  .delete('/formations/:id', userController.ensureIsAdmin, backOfficeController.removeFormation)
  .post('/formations/', userController.ensureIsAdmin, backOfficeController.addFormation);

router.put('/skills/:id', userController.ensureIsAdmin, backOfficeController.editSkill)
  .delete('/skills/:id', userController.ensureIsAdmin, backOfficeController.removeSkill)
  .post('/skills/', userController.ensureIsAdmin, backOfficeController.addSkill);

module.exports = router;