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
          resolve(gmap.formatResult(result, false));
        } catch (error) {
          reject({ status: error.message });
        }
      } else if (req.body.search) {
        resolve(gmap.getAddress(req.body.search, false));
      } else {
        reject({ status: 'BAD_REQUEST' });
      }
    });

    getAddressPromise
      .then((results) => {
        if (results.length > 1)
          return Promise.reject({ status: 'GEOCODING_TOO_MUCH_RESULTS_ERROR' });

        let getEstablishmentsPromise = new Promise((resolve, reject) => {

          if (
            // Linteur de merde! Obligé d'explicitement signifier le prototype, les avantages de JS et de son héritage prototypal sont morts
            Object.prototype.hasOwnProperty.call(results[0].address, 'street_number') ||
            Object.prototype.hasOwnProperty.call(results[0].address, 'street_name') ||
            Object.prototype.hasOwnProperty.call(results[0].address, 'city') ||
            Object.prototype.hasOwnProperty.call(results[0].address, 'postal_code')
          ) {
            return resolve(
              Models.Establishment.repository.getWhereBelongsToSuperGroup(res.locals.supergroup.id)
            );
            /*return resolve(
              Models.Establishment.repository.rawGetInRange(results[0].location, 1000, [
                'LEFT JOIN EstablishmentGroups ON InBounds.id = EstablishmentGroups.id_es',
                'LEFT JOIN `Groups` ON EstablishmentGroups.id_group = Groups.id',
                'LEFT JOIN GroupsSuperGroups ON `Groups`.id = GroupsSuperGroups.id_group',
                'LEFT JOIN SuperGroups ON GroupsSuperGroups.id_super_group = SuperGroups.id'
              ], 'WHERE SuperGroups.id = ' + res.locals.supergroup.id)
            );*/
          } else {
            let where = {};
            for (const addressKey in results[0].address) {
              where[addressKey] = results[0].address[addressKey];
            }
            return resolve(Models.Establishment.repository.getWhereBelongsToSuperGroup(res.locals.supergroup.id, where));
          }

        });

        return getEstablishmentsPromise
          .then(establishments => {
            return res.render('subdomain/supergroup-results', {
              layout: 'subdomain',
              pageName: 'subdomain-supergroup-results',
              layoutName: 'map-results',
              establishments: establishments
            });
          })
          .catch(error => next(new Error(error)));

      })
      .catch(error => next(new Error(error.status)));

  } else {

    res.render('subdomain/supergroup-search', {
      layout: 'subdomain',
      pageName: 'subdomain-supergroup-search',
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
