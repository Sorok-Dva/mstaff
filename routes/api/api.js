const express = require('express');
const router = express.Router();
const { Authentication } = require('../../middlewares/index');
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
router.get('/categoriesPostsServices/all', Api.Main.getCategoriesList);
router.post('/establishments/findByGeo', Establishment.Reference.findByGeo);
router.get('/establishments/findByCity/:city', Establishment.Reference.findByCity);

/**
 * @Route('/api/avatar/view/:name') GET;
 * Show user avatar (or default avatar if the photo isn't found in the fs)
 */
router.get('/avatar/view/:name', Authentication.ensureAuthenticated, Api.Main.getUserAvatar);

module.exports = router;