const __ = process.cwd();
const { HTTPValidation, Authentication } = require(`${__}/middlewares`);
const express = require('express');
const router = express.Router();

const { Offer } = require(`${__}/components`);

router.get('/offer/:id(\\d+)',
  Offer.View);

module.exports = router;