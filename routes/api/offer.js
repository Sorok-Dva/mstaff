const __ = process.cwd();
const { HTTPValidation, Authentication } = require(`${__}/middlewares`);
const express = require('express');
const router = express.Router();

const { Establishment } = require(`${__}/components/`);

router.get('/:id(\\d+)',
  Establishment.Offer.View);

module.exports = router;