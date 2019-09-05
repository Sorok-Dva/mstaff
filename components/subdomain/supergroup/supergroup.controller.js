const __ = process.cwd();
const { _ } = require('lodash');
const Models = require(`${__}/orm/models/index`);
const { BackError } = require(`${__}/helpers/back.error`);

const Subdomain_SuperGroup = {};

Subdomain_SuperGroup.ViewIndex = (req, res, next) => {
  return res.render('subdomain/supergroup', {
    layout: 'subdomain',
    pageName: 'subdomain-supergroup',
    layoutName: 'subdomain'
  });
};

Subdomain_SuperGroup.find = (id, next) => {
  Models.SuperGroups.findOne({
    where: { id }
  }).then(supergroup => {
    if (_.isNil(supergroup)) return new BackError('Établissement introuvable', 403);
    next(supergroup);
  }).catch( error => next(new BackError(error)));
};

module.exports = Subdomain_SuperGroup;
