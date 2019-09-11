const __ = process.cwd();
const { _ } = require('lodash');
const Models = require(`${__}/orm/models/index`);
const { BackError } = require(`${__}/helpers/back.error`);
const gmap = require(__ + '/helpers/google-map-api');

const Subdomain_SuperGroup = {};

Subdomain_SuperGroup.ViewIndex = (req, res, next) => {
  if (req.method == 'POST') {
    let getAddressPromise = new Promise(function (resolve, reject) {
      if (req.body.address_components) {
        try {
          let result = { address_components: JSON.parse(req.body.address_components) };
          resolve(gmap.formatResult(result));
        } catch (error) {
          reject({ status: error.message });
        }
      } else if (req.body.search) {
        resolve(gmap.getAddress(req.body.search, false, false));
      } else {
        reject({ status: 'BAD_REQUEST' });
      }
    });

    getAddressPromise
      .then((address) => {

        // XXX: "address" is now "results" and is an array of results

        Models.Establishment.findAll({
          where: address,
          include: {
            model: Models.EstablishmentGroups,
            on: {
              'Establishment.id': 'EstablishmentGroups.id_es'
            },
            include: {
              model: Models.Groups,
              on: {
                'EstablishmentGroups.id_group': 'Groups.id'
              },
              include: {
                model: Models.GroupsSuperGroups,
                on: {
                  'Groups.id': 'GroupsSuperGroups.id_group'
                },
                include: {
                  model: Models.SuperGroups,
                  on: {
                    'GroupsSuperGroups.id_super_group': 'SuperGroups.id'
                  }
                }
              }
            }
          }
        })
          .then(establishments => {

            res.render('subdomain/supergroup-search', {
              layout: 'subdomain',
              pageName: 'subdomain-supergroup-search',
              layoutName: 'subdomain',
              establishments: establishments
            });

          })
          .catch(error => next(new Error(error)));

      })
      .catch(error => {
        // TODO
      });

  } else {

    res.render('subdomain/supergroup', {
      layout: 'subdomain',
      pageName: 'subdomain-supergroup',
      layoutName: 'map-search'
    });

  }
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
