const express = require('express');
const router = express.Router();

const ApiController = require('../../controllers/api');
const Controller = require('../../controllers/establishment');

router.get('/', (req, res) => res.json({ message: 'welcome' }));
router.get('/skills/all', ApiController.getSkillsList);
router.get('/equipments/all', ApiController.getEquipmentsList);
router.get('/softwares/all', ApiController.getSoftwaresList);
router.get('/establishments/all', ApiController.getEstablishmentList);
router.get('/categoriesPostsServices/all', ApiController.getCategoriesList);
router.post('/establishments/findByGeo', Controller.Establishment.Reference.findByGeo);
router.get('/establishments/findByCity/:city', Controller.Establishment.Reference.findByCity);

module.exports = router;