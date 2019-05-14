const __ = process.cwd();
const { validationResult } = require('express-validator/check');
const { _ } = require('lodash');
const { BackError } = require(`${__}/helpers/back.error`);
const httpStatus = require('http-status');

const Models = require(`${__}/orm/models/index`);

const Subdomain = {};

Subdomain.find = (req, res, next) => {
  let term;
  if (req.get('host') === 'postuler.croix-rouge.fr') term = 'postuler.crf';
  else term = req.subdomains[0];
  Models.Subdomain.findOne({
    where: {
      name: term,
      enable: true
    }
  }).then(subdomain => {
    if (_.isNil(subdomain)) return res.redirect('https://mstaff.co');
    else next(subdomain);
  })
};

module.exports = Subdomain;