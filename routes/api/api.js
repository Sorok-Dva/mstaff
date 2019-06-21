const express = require('express');
const router = express.Router();

const ApiController = require('../../controllers/api');
const Establishment = require(`../../components/establishment`);

router.get('/', (req, res) => res.json({ message: 'welcome' }));
router.get('/skills/all', ApiController.getSkillsList);
router.get('/services/all', ApiController.getServicesList);
router.get('/posts/all', ApiController.getPostsList);
router.get('/formations/all', ApiController.getFormationList);
router.get('/qualifications/all', ApiController.getQualificationList);
router.get('/groups/all', ApiController.getGroupsList);
router.get('/equipments/all', ApiController.getEquipmentsList);
router.get('/softwares/all', ApiController.getSoftwaresList);
router.get('/categoriesPostsServices/all', ApiController.getCategoriesList);
router.post('/establishments/findByGeo', Establishment.Reference.findByGeo);
router.get('/establishments/findByCity/:city', Establishment.Reference.findByCity);

module.exports = router;