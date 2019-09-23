const express = require('express');
const router = express.Router();
const { HTTPValidation } = require('../../middlewares');
const Api = require(`../../components/api`);
const Establishment = require(`../../components/establishment`);

router.get('/', (req, res) => res.json({ message: 'welcome' }));
router.get('/skills/all', Api.Main.getSkillsList);
router.get('/services/all', Api.Main.getServicesList);
router.get('/posts/all', Api.Main.getPostsList);
router.get('/formations/all', Api.Main.getFormationList);
router.get('/qualifications/all', Api.Main.getQualificationList);
router.get('/groups/all', Api.Main.getGroupsList);
router.get('/equipments/all', Api.Main.getEquipmentsList);
router.get('/softwares/all', Api.Main.getSoftwaresList);
router.get('/pool/data/all', Api.Main.getPoolDatas);
router.get('/categoriesPostsServices/all', Api.Main.getCategoriesList);
router.post('/establishments/findByGeo', Establishment.Reference.findByGeo);
router.get(
  '/establishments/findByCity/:city',
  HTTPValidation.ApiController.findByCity,
  Establishment.Reference.findByCity
);
router.post('/address/geoloc', Api.Main.geolocAddress);

module.exports = router;