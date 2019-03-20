const express = require('express');
const router = express.Router();

const ApiController = require('../../controllers/api');
const ESController = require('../../controllers/establishment');

router.get('/', (req, res) => res.json({ message: 'welcome' }));
router.get('/skills/all', ApiController.getSkillsList);
router.get('/equipments/all', ApiController.getEquipmentsList);
router.get('/softwares/all', ApiController.getSoftwaresList);
router.get('/establishments/all', ApiController.getEstablishmentList);
router.get('/categoriesPostsServices/all', ApiController.getCategoriesList);
router.post('/establishments/findByGeo', ESController.findByGeo);
router.get('/establishments/findByCity/:city', ESController.findByCity);

module.exports = router;